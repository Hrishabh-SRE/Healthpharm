import type { UserRole, UserStatus } from "@/types/auth";

export type UserListItem = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string | null;
};
