import type { z } from "zod";

import type { leadSchema } from "@/lib/validation/lead.schema";

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadRecord = LeadInput & {
  id: string;
  createdAt: string;
  status: "NEW";
};
