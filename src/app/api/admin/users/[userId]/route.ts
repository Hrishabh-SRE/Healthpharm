import { NextRequest } from "next/server";
import { AuditAction } from "@prisma/client";

import { requireAdminApi } from "@/lib/auth/guards";
import { createAuditLog } from "@/lib/services/audit-log.service";
import { deactivateUser, findUserById, updateUserBasicInfo } from "@/lib/services/user.service";
import { updateAdminUserSchema } from "@/lib/validation/admin-user.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ userId: string }>;
};

export async function GET(_: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  const { userId } = await params;
  const user = await findUserById(userId);
  if (!user) {
    return errorResponse("NOT_FOUND", "User not found.", 404);
  }

  return successResponse({
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
  });
}

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const { userId } = await params;
    const user = await findUserById(userId);
    if (!user) {
      return errorResponse("NOT_FOUND", "User not found.", 404);
    }

    const body = (await request.json()) as unknown;
    const parsed = updateAdminUserSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid user update payload.", 400);
    }

    if (parsed.data.status === "INACTIVE" && user.status !== "INACTIVE") {
      const deactivatedUser = await deactivateUser(userId);
      await createAuditLog({
        userId: auth.user?.id ?? null,
        action: AuditAction.USER_DEACTIVATED,
        entityType: "User",
        entityId: deactivatedUser.id,
      });
      return successResponse({
        user: {
          id: deactivatedUser.id,
          firstName: deactivatedUser.firstName,
          lastName: deactivatedUser.lastName,
          email: deactivatedUser.email,
          phone: deactivatedUser.phone,
          role: deactivatedUser.role,
          status: deactivatedUser.status,
          createdAt: deactivatedUser.createdAt,
          lastLoginAt: deactivatedUser.lastLoginAt,
        },
      });
    }

    const updated = await updateUserBasicInfo(userId, parsed.data);
    await createAuditLog({
      userId: auth.user?.id ?? null,
      action: AuditAction.USER_UPDATED,
      entityType: "User",
      entityId: updated.id,
    });

    return successResponse({
      user: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        status: updated.status,
        createdAt: updated.createdAt,
        lastLoginAt: updated.lastLoginAt,
      },
    });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to update user.", 500);
  }
}
