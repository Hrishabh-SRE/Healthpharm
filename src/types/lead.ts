import type { z } from "zod";

import type { leadSchema } from "@/lib/validation/lead.schema";

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";

export type LeadRecord = LeadInput & {
  id: string;
  consentAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: LeadStatus;
};
