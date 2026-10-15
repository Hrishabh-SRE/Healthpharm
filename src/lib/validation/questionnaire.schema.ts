import { z } from "zod";

export const sendMessageSchema = z.object({
  messageBody: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(2000, "Message must be at most 2000 characters."),
});
