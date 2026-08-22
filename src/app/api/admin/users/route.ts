import { NextRequest } from "next/server";
import { AuditAction, UserRole, UserStatus } from "@prisma/client";

import { requireAdminApi } from "@/lib/auth/guards";
import { createAuditLog } from "@/lib/services/audit-log.service";
import { createUserWithRoleProfile, findUserByEmail, listUsers } from "@/lib/services/user.service";
import { createAdminUserSchema } from "@/lib/validation/admin-user.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") ?? undefined;
    const role = (searchParams.get("role") ?? "ALL") as UserRole | "ALL";
    const status = (searchParams.get("status") ?? "ALL") as UserStatus | "ALL";

    const users = await listUsers({ q, role, status });
    return successResponse({ users });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to fetch users.", 500);
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = createAdminUserSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid user payload.", 400);
    }

    const existing = await findUserByEmail(parsed.data.email.toLowerCase());
    if (existing) {
      return errorResponse("DUPLICATE_EMAIL", "A user with this email already exists.", 409);
    }

    const user = await createUserWithRoleProfile({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      role: parsed.data.role as UserRole,
      status: parsed.data.status as UserStatus,
      temporaryPassword: parsed.data.temporaryPassword,
    });

    await createAuditLog({
      userId: auth.user?.id ?? null,
      action: AuditAction.USER_CREATED,
      entityType: "User",
      entityId: user.id,
    });

    return successResponse(
      {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
      },
      201,
    );
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to create user.", 500);
  }
}
