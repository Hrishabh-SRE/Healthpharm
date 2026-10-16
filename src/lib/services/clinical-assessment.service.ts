import { AssignmentStatus, AuditAction, ClinicalAssessmentStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { assertDieticianCanAccessClient } from "@/lib/services/assignment.service";
import { createAuditLog } from "@/lib/services/audit-log.service";

type ClientAssessmentInput = {
  chiefConcern?: string | null;
  currentSymptoms?: string | null;
  currentMedications?: string | null;
  allergies?: string | null;
  medicalHistory?: string | null;
  familyHistory?: string | null;
  digestiveIssues?: string | null;
  sleepPattern?: string | null;
  stressLevel?: string | null;
  activityLevel?: string | null;
  menstrualHistory?: string | null;
  pregnancyOrLactation?: string | null;
  smokingAlcoholHistory?: string | null;
  foodIntolerances?: string | null;
  previousDietHistory?: string | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
  waistCircumference?: number | null;
  hipCircumference?: number | null;
  bloodPressure?: string | null;
  systolicBp?: number | null;
  diastolicBp?: number | null;
  restingHeartRate?: number | null;
  fastingBloodSugar?: number | null;
  postMealBloodSugar?: number | null;
  hba1c?: number | null;
  totalCholesterol?: number | null;
  hdl?: number | null;
  ldl?: number | null;
  triglycerides?: number | null;
  thyroidTsh?: number | null;
  vitaminD?: number | null;
  vitaminB12?: number | null;
  hemoglobin?: number | null;
  creatinine?: number | null;
  sgpt?: number | null;
  sgot?: number | null;
};

type DieticianAssessmentInput = ClientAssessmentInput & {
  clinicalObservations?: string | null;
  assessmentSummary?: string | null;
  nutritionDiagnosis?: string | null;
  riskFlags?: string | null;
  dieticianRecommendations?: string | null;
  followUpRecommendations?: string | null;
  internalRemarks?: string | null;
};

const defaultClientAssessmentSelect = {
  id: true,
  clientId: true,
  createdById: true,
  updatedById: true,
  reviewedById: true,
  finalizedById: true,
  status: true,
  version: true,
  chiefConcern: true,
  currentSymptoms: true,
  currentMedications: true,
  allergies: true,
  medicalHistory: true,
  familyHistory: true,
  digestiveIssues: true,
  sleepPattern: true,
  stressLevel: true,
  activityLevel: true,
  menstrualHistory: true,
  pregnancyOrLactation: true,
  smokingAlcoholHistory: true,
  foodIntolerances: true,
  previousDietHistory: true,
  height: true,
  weight: true,
  bmi: true,
  waistCircumference: true,
  hipCircumference: true,
  bloodPressure: true,
  systolicBp: true,
  diastolicBp: true,
  restingHeartRate: true,
  fastingBloodSugar: true,
  postMealBloodSugar: true,
  hba1c: true,
  totalCholesterol: true,
  hdl: true,
  ldl: true,
  triglycerides: true,
  thyroidTsh: true,
  vitaminD: true,
  vitaminB12: true,
  hemoglobin: true,
  creatinine: true,
  sgpt: true,
  sgot: true,
  clinicalObservations: true,
  assessmentSummary: true,
  nutritionDiagnosis: true,
  riskFlags: true,
  dieticianRecommendations: true,
  followUpRecommendations: true,
  internalRemarks: true,
  submittedAt: true,
  reviewedAt: true,
  finalizedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ClinicalAssessmentSelect;

function withoutInternalRemarks<T extends { internalRemarks: string | null }>(
  row: T,
): Omit<T, "internalRemarks"> {
  const { internalRemarks, ...rest } = row;
  void internalRemarks;
  return rest;
}

async function createAssessment(
  clientId: string,
  actorUserId: string,
  input: ClientAssessmentInput | DieticianAssessmentInput,
) {
  const created = await prisma.clinicalAssessment.create({
    data: {
      clientId,
      createdById: actorUserId,
      updatedById: actorUserId,
      ...input,
    },
    select: defaultClientAssessmentSelect,
  });

  await createAuditLog({
    userId: actorUserId,
    action: AuditAction.CLINICAL_ASSESSMENT_CREATED,
    entityType: "ClinicalAssessment",
    entityId: created.id,
    metadata: { clientId },
  });

  return created;
}

export async function getClientClinicalAssessment(clientUserId: string) {
  const assessment = await prisma.clinicalAssessment.findUnique({
    where: { clientId: clientUserId },
    select: defaultClientAssessmentSelect,
  });

  if (!assessment) {
    return { data: null };
  }

  return { data: withoutInternalRemarks(assessment) };
}

export async function updateClientClinicalAssessment(
  clientUserId: string,
  input: ClientAssessmentInput,
) {
  const existing = await prisma.clinicalAssessment.findUnique({
    where: { clientId: clientUserId },
    select: {
      id: true,
      status: true,
    },
  });

  if (existing && existing.status !== ClinicalAssessmentStatus.DRAFT) {
    return { error: "CLINICAL_ASSESSMENT_LOCKED" as const };
  }

  const assessment = existing
    ? await prisma.clinicalAssessment.update({
        where: { clientId: clientUserId },
        data: {
          ...input,
          updatedById: clientUserId,
          version: { increment: 1 },
        },
        select: defaultClientAssessmentSelect,
      })
    : await createAssessment(clientUserId, clientUserId, input);

  await createAuditLog({
    userId: clientUserId,
    action: AuditAction.CLINICAL_ASSESSMENT_UPDATED,
    entityType: "ClinicalAssessment",
    entityId: assessment.id,
    metadata: {
      clientId: clientUserId,
      status: assessment.status,
    },
  });

  return { data: withoutInternalRemarks(assessment) };
}

export async function submitClientClinicalAssessment(clientUserId: string) {
  const existing = await prisma.clinicalAssessment.findUnique({
    where: { clientId: clientUserId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    return { error: "CLINICAL_ASSESSMENT_NOT_FOUND" as const };
  }

  if (existing.status !== ClinicalAssessmentStatus.DRAFT) {
    return { error: "INVALID_STATUS_TRANSITION" as const };
  }

  const updated = await prisma.clinicalAssessment.update({
    where: { clientId: clientUserId },
    data: {
      status: ClinicalAssessmentStatus.SUBMITTED,
      submittedAt: new Date(),
      updatedById: clientUserId,
      version: { increment: 1 },
    },
    select: defaultClientAssessmentSelect,
  });

  await createAuditLog({
    userId: clientUserId,
    action: AuditAction.CLINICAL_ASSESSMENT_SUBMITTED,
    entityType: "ClinicalAssessment",
    entityId: updated.id,
    metadata: { clientId: clientUserId },
  });

  return { data: withoutInternalRemarks(updated) };
}

export async function getDieticianClientClinicalAssessment(
  dieticianUserId: string,
  clientId: string,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const assessment = await prisma.clinicalAssessment.findUnique({
    where: { clientId },
    select: defaultClientAssessmentSelect,
  });

  return { data: assessment };
}

export async function updateDieticianClientClinicalAssessment(
  dieticianUserId: string,
  clientId: string,
  input: DieticianAssessmentInput,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const existing = await prisma.clinicalAssessment.findUnique({
    where: { clientId },
    select: {
      id: true,
      status: true,
    },
  });

  if (existing?.status === ClinicalAssessmentStatus.FINALIZED) {
    return { error: "CLINICAL_ASSESSMENT_LOCKED" as const };
  }

  const assessment = existing
    ? await prisma.clinicalAssessment.update({
        where: { clientId },
        data: {
          ...input,
          updatedById: dieticianUserId,
          version: { increment: 1 },
        },
        select: defaultClientAssessmentSelect,
      })
    : await createAssessment(clientId, dieticianUserId, input);

  await createAuditLog({
    userId: dieticianUserId,
    action: AuditAction.CLINICAL_ASSESSMENT_UPDATED,
    entityType: "ClinicalAssessment",
    entityId: assessment.id,
    metadata: {
      clientId,
      status: assessment.status,
    },
  });

  return { data: assessment };
}

export async function reviewDieticianClientClinicalAssessment(
  dieticianUserId: string,
  clientId: string,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const existing = await prisma.clinicalAssessment.findUnique({
    where: { clientId },
    select: { id: true, status: true },
  });
  if (!existing) {
    return { error: "CLINICAL_ASSESSMENT_NOT_FOUND" as const };
  }
  if (
    existing.status !== ClinicalAssessmentStatus.DRAFT &&
    existing.status !== ClinicalAssessmentStatus.SUBMITTED
  ) {
    return { error: "INVALID_STATUS_TRANSITION" as const };
  }

  const updated = await prisma.clinicalAssessment.update({
    where: { clientId },
    data: {
      status: ClinicalAssessmentStatus.REVIEWED,
      reviewedAt: new Date(),
      reviewedById: dieticianUserId,
      updatedById: dieticianUserId,
      version: { increment: 1 },
    },
    select: defaultClientAssessmentSelect,
  });

  await createAuditLog({
    userId: dieticianUserId,
    action: AuditAction.CLINICAL_ASSESSMENT_REVIEWED,
    entityType: "ClinicalAssessment",
    entityId: updated.id,
    metadata: {
      clientId,
      previousStatus: existing.status,
      nextStatus: updated.status,
    },
  });

  return { data: updated };
}

export async function finalizeDieticianClientClinicalAssessment(
  dieticianUserId: string,
  clientId: string,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const existing = await prisma.clinicalAssessment.findUnique({
    where: { clientId },
    select: { id: true, status: true },
  });
  if (!existing) {
    return { error: "CLINICAL_ASSESSMENT_NOT_FOUND" as const };
  }
  if (existing.status !== ClinicalAssessmentStatus.REVIEWED) {
    return { error: "INVALID_STATUS_TRANSITION" as const };
  }

  const updated = await prisma.clinicalAssessment.update({
    where: { clientId },
    data: {
      status: ClinicalAssessmentStatus.FINALIZED,
      finalizedAt: new Date(),
      finalizedById: dieticianUserId,
      updatedById: dieticianUserId,
      version: { increment: 1 },
    },
    select: defaultClientAssessmentSelect,
  });

  await createAuditLog({
    userId: dieticianUserId,
    action: AuditAction.CLINICAL_ASSESSMENT_FINALIZED,
    entityType: "ClinicalAssessment",
    entityId: updated.id,
    metadata: {
      clientId,
      previousStatus: existing.status,
      nextStatus: updated.status,
    },
  });

  return { data: updated };
}

export async function getClinicalAssessmentStatusForClient(clientUserId: string) {
  const assessment = await prisma.clinicalAssessment.findUnique({
    where: { clientId: clientUserId },
    select: { status: true, updatedAt: true },
  });

  if (!assessment) {
    return null;
  }

  return {
    status: assessment.status,
    updatedAt: assessment.updatedAt,
  };
}

export async function getClinicalAssessmentReviewCountForDietician(dieticianUserId: string) {
  const assignments = await prisma.clientDieticianAssignment.findMany({
    where: {
      dieticianId: dieticianUserId,
      status: AssignmentStatus.ACTIVE,
    },
    select: { clientId: true },
  });

  const clientIds = assignments.map((row) => row.clientId);
  if (clientIds.length === 0) {
    return 0;
  }

  return prisma.clinicalAssessment.count({
    where: {
      clientId: { in: clientIds },
      status: ClinicalAssessmentStatus.SUBMITTED,
    },
  });
}

export async function getClinicalAssessmentStatusByAssignedClient(dieticianUserId: string) {
  const assignments = await prisma.clientDieticianAssignment.findMany({
    where: {
      dieticianId: dieticianUserId,
      status: AssignmentStatus.ACTIVE,
    },
    select: { clientId: true },
  });
  const clientIds = assignments.map((row) => row.clientId);
  if (clientIds.length === 0) {
    return {};
  }

  const rows = await prisma.clinicalAssessment.findMany({
    where: {
      clientId: { in: clientIds },
    },
    select: {
      clientId: true,
      status: true,
    },
  });

  return rows.reduce<Record<string, ClinicalAssessmentStatus>>((acc, row) => {
    acc[row.clientId] = row.status;
    return acc;
  }, {});
}
