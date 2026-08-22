import { z } from "zod";

export const createAdminUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().optional(),
  role: z.enum(["CLIENT", "DIETICIAN", "ADMIN"]),
  temporaryPassword: z.string().min(8, "Temporary password must be at least 8 characters."),
  status: z.enum(["ACTIVE", "INACTIVE", "INVITED", "SUSPENDED"]),
});

export const updateAdminUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").optional(),
  lastName: z.string().trim().min(1, "Last name is required.").optional(),
  phone: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "INVITED", "SUSPENDED"]).optional(),
});
