import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.email("Enter a valid email address."),
  phone: z.string().min(8, "Phone number is required."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});
