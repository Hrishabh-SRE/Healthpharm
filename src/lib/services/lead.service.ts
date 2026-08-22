import { AuditAction, LeadStatus, UserRole, UserStatus } from "@prisma/client";

import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";
import { createAuditLog } from "@/lib/services/audit-log.service";
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

export async function listAdminLeads(filters: { q?: string; status?: LeadStatus | "ALL" }) {
  const q = filters.q?.trim();

  return prisma.lead.findMany({
    where: {
      status: filters.status && filters.status !== "ALL" ? filters.status : undefined,
      OR: q
        ? [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { interestedService: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getLeadCountByStatus(status: LeadStatus) {
  return prisma.lead.count({
    where: { status },
  });
}

export async function getLeadById(leadId: string) {
  return prisma.lead.findUnique({ where: { id: leadId } });
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });

  await createAuditLog({
    action: AuditAction.LEAD_UPDATED,
    entityType: "Lead",
    entityId: lead.id,
    metadata: { status: lead.status },
  });

  return lead;
}

type ConvertLeadInput = {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  temporaryPassword: string;
  primaryGoal?: string;
};

export async function convertLeadToClient(input: ConvertLeadInput) {
  const lead = await prisma.lead.findUnique({ where: { id: input.leadId } });
  if (!lead) {
    return { error: "NOT_FOUND" as const };
  }
  if (lead.status === LeadStatus.CONVERTED || lead.convertedClientId) {
    return { error: "LEAD_ALREADY_CONVERTED" as const };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });
  if (existingUser) {
    return { error: "DUPLICATE_EMAIL" as const };
  }

  const passwordHash = await hashPassword(input.temporaryPassword);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        passwordHash,
      },
    });

    const clientProfile = await tx.clientProfile.create({
      data: {
        userId: user.id,
        primaryGoal: input.primaryGoal || lead.healthGoal || null,
      },
    });

    const updatedLead = await tx.lead.update({
      where: { id: lead.id },
      data: {
        status: LeadStatus.CONVERTED,
        convertedClientId: user.id,
        email: input.email.toLowerCase(),
        phone: input.phone,
      },
    });

    return { user, clientProfile, updatedLead };
  });

  await createAuditLog({
    userId: result.user.id,
    action: AuditAction.USER_CREATED,
    entityType: "User",
    entityId: result.user.id,
  });
  await createAuditLog({
    userId: result.user.id,
    action: AuditAction.CLIENT_PROFILE_CREATED,
    entityType: "ClientProfile",
    entityId: result.clientProfile.id,
  });
  await createAuditLog({
    userId: result.user.id,
    action: AuditAction.LEAD_CONVERTED_TO_CLIENT,
    entityType: "Lead",
    entityId: result.updatedLead.id,
  });

  return { data: result };
}
