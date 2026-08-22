import { AuditAction, UserStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ROLES } from "@/lib/auth/roles";
import { readSessionTokenFromCookieStore } from "@/lib/auth/session";
import { createAuditLog } from "@/lib/services/audit-log.service";
import { createUserSession, findValidSessionByToken, revokeSessionByToken } from "@/lib/services/session.service";
import { findUserByEmail, isUserActive, updateUserLastLogin } from "@/lib/services/user.service";
import { AUTH_ROUTES, ROLE_DASHBOARD_ROUTES } from "@/lib/utils/routes";
import { verifyPassword } from "@/lib/auth/password";
import type { AuthRequestContext, AuthUser, LoginInput, UserRole } from "@/types/auth";

type LoginResult = {
  user: AuthUser;
  sessionToken: string;
};

function toAuthUser(user: {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
  lastName: string;
  phone: string | null;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionToken = readSessionTokenFromCookieStore(cookieStore);

  if (!sessionToken) {
    return null;
  }

  const session = await findValidSessionByToken(sessionToken);
  if (!session || !isUserActive(session.user.status)) {
    return null;
  }

  return toAuthUser(session.user);
}

export async function loginWithCredentials(
  input: LoginInput,
  context?: AuthRequestContext,
): Promise<LoginResult | null> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user || !isUserActive(user.status)) {
    return null;
  }

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
  if (!isPasswordValid) {
    return null;
  }

  const sessionToken = await createUserSession(user.id, {
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });

  await updateUserLastLogin(user.id);
  await createAuditLog({
    userId: user.id,
    action: AuditAction.USER_LOGIN,
    entityType: "Session",
    entityId: user.id,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });

  return { user: toAuthUser(user), sessionToken };
}

export async function logout(context?: AuthRequestContext): Promise<void> {
  const cookieStore = await cookies();
  const sessionToken = readSessionTokenFromCookieStore(cookieStore);
  if (!sessionToken) {
    return;
  }

  const activeSession = await findValidSessionByToken(sessionToken);
  await revokeSessionByToken(sessionToken);

  await createAuditLog({
    userId: activeSession?.userId ?? null,
    action: AuditAction.USER_LOGOUT,
    entityType: "Session",
    entityId: activeSession?.id ?? null,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });

  await createAuditLog({
    userId: activeSession?.userId ?? null,
    action: AuditAction.SESSION_REVOKED,
    entityType: "Session",
    entityId: activeSession?.id ?? null,
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
  });
}

export function getDashboardRouteForRole(role: UserRole): string {
  return ROLE_DASHBOARD_ROUTES[role];
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(AUTH_ROUTES.LOGIN);
  }

  return user;
}

export async function requireRole(role: UserRole): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== role) {
    redirect(getDashboardRouteForRole(user.role));
  }

  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  return requireRole(ROLES.ADMIN);
}

export async function requireDietician(): Promise<AuthUser> {
  return requireRole(ROLES.DIETICIAN);
}

export async function requireClient(): Promise<AuthUser> {
  return requireRole(ROLES.CLIENT);
}

export function isKnownRole(value: string): value is UserRole {
  return [ROLES.ADMIN, ROLES.DIETICIAN, ROLES.CLIENT].includes(value as UserRole);
}
