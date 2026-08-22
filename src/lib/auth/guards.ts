export {
  getCurrentUser,
  requireAdmin,
  requireAuth,
  requireClient,
  requireDietician,
  requireRole,
} from "@/lib/auth/auth";
import { getCurrentUser } from "@/lib/auth/auth";

import { ROLES } from "@/lib/auth/roles";
import { errorResponse } from "@/lib/utils/api-response";

export async function requireAdminApi() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: errorResponse("UNAUTHORIZED", "Authentication is required.", 401), user: null };
  }

  if (user.role !== ROLES.ADMIN) {
    return { error: errorResponse("FORBIDDEN", "Only admins can access this resource.", 403), user: null };
  }

  return { error: null, user };
}

export async function requireDieticianApi() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: errorResponse("UNAUTHORIZED", "Authentication is required.", 401), user: null };
  }
  if (user.role !== ROLES.DIETICIAN) {
    return { error: errorResponse("FORBIDDEN", "Only dieticians can access this resource.", 403), user: null };
  }

  return { error: null, user };
}

export async function requireClientApi() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: errorResponse("UNAUTHORIZED", "Authentication is required.", 401), user: null };
  }
  if (user.role !== ROLES.CLIENT) {
    return { error: errorResponse("FORBIDDEN", "Only clients can access this resource.", 403), user: null };
  }

  return { error: null, user };
}
