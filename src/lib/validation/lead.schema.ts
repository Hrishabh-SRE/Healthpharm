import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.email("Enter a valid email address."),
  phone: z.string().min(8, "Phone number is required."),
  interestedService: z.string().min(2, "Please select an interested service."),
  healthGoal: z.string().min(5, "Please share your health goal."),
  preferredDate: z.string().min(1, "Preferred date is required."),
  preferredTime: z.string().min(1, "Preferred time is required."),
  message: z.string().min(10, "Please share a short message."),
  consent: z.boolean().refine((value) => value, {
    message: "You must provide consent before submitting.",
  }),
});
