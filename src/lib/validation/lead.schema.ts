import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(8, "Phone number is required."),
  interestedService: z.string().trim().min(2, "Please select an interested service."),
  healthGoal: z.string().trim().min(5, "Please share your health goal."),
  preferredDate: z.iso.date("Preferred date is required."),
  preferredTime: z.string().trim().min(1, "Preferred time is required."),
  message: z.string().trim().min(10, "Please share a short message."),
  consent: z.boolean().refine((value) => value, {
    message: "You must provide consent before submitting.",
  }),
});
