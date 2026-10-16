import { AssignmentStatus, UserRole } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { assertDieticianCanAccessClient } from "@/lib/services/assignment.service";
import {
  getClinicalAssessmentReviewCountForDietician,
  getClinicalAssessmentStatusByAssignedClient,
} from "@/lib/services/clinical-assessment.service";
import { updateClientProfile } from "@/lib/services/client-profile.service";
import {
  getUnreadQuestionnaireCountByAssignedClient,
  getUnreadQuestionnaireCountForDietician,
} from "@/lib/services/questionnaire.service";

export async function getDieticianDashboard(dieticianUserId: string) {
  const [assignments, pendingQuestionsCount, pendingClinicalAssessmentsCount] = await Promise.all([
    prisma.clientDieticianAssignment.findMany({
      where: {
        dieticianId: dieticianUserId,
        status: AssignmentStatus.ACTIVE,
      },
      include: {
        client: {
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
        },
      },
      orderBy: {
        assignedAt: "desc",
      },
    }),
    getUnreadQuestionnaireCountForDietician(dieticianUserId),
    getClinicalAssessmentReviewCountForDietician(dieticianUserId),
  ]);

  const totalAssigned = assignments.length;
  const incompleteProfiles = assignments.filter(
    (assignment) => (assignment.client.clientProfile?.profileCompletionPercent ?? 0) < 100,
  ).length;

  return {
    totalAssigned,
    activeAssigned: totalAssigned,
    incompleteProfiles,
    pendingQuestionsCount,
    pendingClinicalAssessmentsCount,
    recentAssignedClients: assignments.slice(0, 5),
  };
}

export async function searchAssignedClients(
  dieticianUserId: string,
  filters: { q?: string; incompleteOnly?: boolean },
) {
  const q = filters.q?.trim();
  const [unreadByClient, clinicalByClient] = await Promise.all([
    getUnreadQuestionnaireCountByAssignedClient(dieticianUserId),
    getClinicalAssessmentStatusByAssignedClient(dieticianUserId),
  ]);

  const assignments = await prisma.clientDieticianAssignment.findMany({
    where: {
      dieticianId: dieticianUserId,
      status: AssignmentStatus.ACTIVE,
      client: {
        role: UserRole.CLIENT,
        OR: q
          ? [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
            ]
          : undefined,
      },
    },
    include: {
      client: {
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
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
  });

  return assignments
    .filter((assignment) => {
      if (!filters.incompleteOnly) return true;
      return (assignment.client.clientProfile?.profileCompletionPercent ?? 0) < 100;
    })
    .map((assignment) => ({
      ...assignment,
      unreadQuestionnaireCount: unreadByClient[assignment.clientId] ?? 0,
      clinicalAssessmentStatus: clinicalByClient[assignment.clientId] ?? null,
    }));
}

export async function getAssignedClientDetail(dieticianUserId: string, clientId: string) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return null;
  }

  const client = await prisma.user.findUnique({
    where: { id: clientId },
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

  if (!client) {
    return null;
  }

  return {
    client,
    assignment: access.assignment,
  };
}

export async function updateAssignedClientProfile(
  dieticianUserId: string,
  clientId: string,
  input: Record<string, unknown>,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "FORBIDDEN" as const };
  }

  const updated = await updateClientProfile(clientId, input, dieticianUserId);
  if (!updated) {
    return { error: "NOT_FOUND" as const };
  }

  return { data: updated };
}
