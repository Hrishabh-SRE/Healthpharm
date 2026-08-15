import { ROLES } from "@/lib/auth/roles";
import type { UserRole } from "@/types/auth";

export const DASHBOARD_ACCESS: Record<UserRole, UserRole> = {
  [ROLES.ADMIN]: ROLES.ADMIN,
  [ROLES.DIETICIAN]: ROLES.DIETICIAN,
  [ROLES.CLIENT]: ROLES.CLIENT,
};
