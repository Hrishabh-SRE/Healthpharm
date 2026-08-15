import { compare } from "bcryptjs";
import { redirect } from "next/navigation";

import { MOCK_USERS } from "@/lib/auth/mock-users";
import { ROLES } from "@/lib/auth/roles";
import { destroySession, readCurrentSession } from "@/lib/auth/session";
import { AUTH_ROUTES, ROLE_DASHBOARD_ROUTES } from "@/lib/utils/routes";
import type { AuthUser, LoginInput, UserRole } from "@/types/auth";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await readCurrentSession();
  return session?.user ?? null;
}

export async function loginWithCredentials(input: LoginInput): Promise<AuthUser | null> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = MOCK_USERS.find((item) => item.email === normalizedEmail);

  if (!user) {
    return null;
  }

  const isPasswordValid = await compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function logout(): Promise<void> {
  const session = await readCurrentSession();
  if (!session) {
    return;
  }

  destroySession(session.token);
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

export function isKnownRole(value: string): value is UserRole {
  return [ROLES.ADMIN, ROLES.DIETICIAN, ROLES.CLIENT].includes(value as UserRole);
}
