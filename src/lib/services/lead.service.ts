import { LeadStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import type { LeadInput } from "@/types/lead";

export async function createLeadRecord(input: LeadInput) {
  return prisma.lead.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      interestedService: input.interestedService,
      healthGoal: input.healthGoal || null,
      preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
      preferredTime: input.preferredTime || null,
      message: input.message || null,
      consentAccepted: input.consent,
      status: LeadStatus.NEW,
    },
  });
}
