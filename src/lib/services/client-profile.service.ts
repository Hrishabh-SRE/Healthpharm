import { AuditAction } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { createAuditLog } from "@/lib/services/audit-log.service";
import { getActiveAssignmentForClient } from "@/lib/services/assignment.service";

type ProfileUpdateInput = Record<string, unknown>;

const completionFields = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "primaryContact",
  "gender",
  "dateOfBirth",
  "height",
  "weight",
  "primaryGoal",
  "activityState",
  "clientMedicalCondition",
] as const;

export function calculateProfileCompletion(input: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  primaryContact?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  height?: unknown;
  weight?: unknown;
  primaryGoal?: string | null;
  activityState?: string | null;
  clientMedicalCondition?: string | null;
}): number {
  const completed = completionFields.filter((key) => {
    const value = input[key];
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  }).length;

  return Math.round((completed / completionFields.length) * 100);
}

export async function createClientProfileForUser(userId: string, primaryGoal?: string | null) {
  return prisma.clientProfile.upsert({
    where: { userId },
    create: {
      userId,
      primaryGoal: primaryGoal || null,
    },
    update: {
      primaryGoal: primaryGoal || null,
    },
  });
}

export async function getClientProfileBundle(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      firstName: true,
      lastName: true,
      phone: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      clientProfile: true,
    },
  });

  if (!user) {
    return null;
  }

  const assignment = await getActiveAssignmentForClient(userId);

  return {
    user,
    clientProfile: user.clientProfile,
    assignedDietician: assignment?.dietician ?? null,
    assignment: assignment ?? null,
  };
}

export async function updateClientProfile(
  targetUserId: string,
  input: ProfileUpdateInput,
  actorUserId: string,
) {
  const existing = await getClientProfileBundle(targetUserId);
  if (!existing) {
    return null;
  }

  const { firstName, lastName, phone, ...profilePayload } = input;

  const updated = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      data: {
        firstName: (firstName as string | undefined) ?? existing.user.firstName,
        lastName: (lastName as string | undefined) ?? existing.user.lastName,
        phone: phone !== undefined ? ((phone as string | null) ?? null) : existing.user.phone,
      },
    });

    const profile = await tx.clientProfile.upsert({
      where: { userId: targetUserId },
      create: {
        userId: targetUserId,
      },
      update: {},
    });

    const mergedProfile = {
      ...profile,
      ...profilePayload,
    };
    const profileCompletionPercent = calculateProfileCompletion({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      primaryContact: (mergedProfile.primaryContact as string | null | undefined) ?? profile.primaryContact,
      gender: (mergedProfile.gender as string | null | undefined) ?? profile.gender,
      dateOfBirth: (mergedProfile.dateOfBirth as Date | null | undefined) ?? profile.dateOfBirth,
      height: mergedProfile.height ?? profile.height,
      weight: mergedProfile.weight ?? profile.weight,
      primaryGoal: (mergedProfile.primaryGoal as string | null | undefined) ?? profile.primaryGoal,
      activityState: (mergedProfile.activityState as string | null | undefined) ?? profile.activityState,
      clientMedicalCondition:
        (mergedProfile.clientMedicalCondition as string | null | undefined) ?? profile.clientMedicalCondition,
    });

    const updatedProfile = await tx.clientProfile.update({
      where: { userId: targetUserId },
      data: {
        ...profilePayload,
        profileCompletionPercent,
      },
    });

    return { user, clientProfile: updatedProfile };
  });

  await createAuditLog({
    userId: actorUserId,
    action: AuditAction.PROFILE_UPDATED,
    entityType: "ClientProfile",
    entityId: updated.clientProfile.id,
    metadata: {
      targetUserId,
    },
  });

  return updated;
}
