import type { z } from "zod";

import type { loginSchema } from "@/lib/validation/auth.schema";

export type UserRole = "ADMIN" | "DIETICIAN" | "CLIENT";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginInput = z.infer<typeof loginSchema>;
