import type { z } from "zod";

import type { loginSchema } from "@/lib/validation/auth.schema";

export type UserRole = "ADMIN" | "DIETICIAN" | "CLIENT";
export type UserStatus = "INVITED" | "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
  lastName: string;
  phone: string | null;
};

export type LoginInput = z.infer<typeof loginSchema>;

export type AuthRequestContext = {
  ipAddress?: string | null;
  userAgent?: string | null;
};
