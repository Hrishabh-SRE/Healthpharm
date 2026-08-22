import { z } from "zod";

export const adminLeadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

export const convertLeadToClientSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(8, "Phone is required."),
  temporaryPassword: z.string().min(8, "Temporary password must be at least 8 characters."),
  primaryGoal: z.string().trim().optional(),
});
