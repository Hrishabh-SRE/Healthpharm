import { z } from "zod";

export const createAssignmentSchema = z.object({
  clientId: z.string().uuid("Client is required."),
  dieticianId: z.string().uuid("Dietician is required."),
});

export const updateAssignmentSchema = z.object({
  status: z.enum(["INACTIVE"]),
});
