import { AssignmentStatus, AuditAction, UserRole, UserStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { createAuditLog } from "@/lib/services/audit-log.service";

export async function listAssignments() {
  return prisma.clientDieticianAssignment.findMany({
    include: {
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      dietician: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
  });
}

export async function createAssignment(clientId: string, dieticianId: string) {
  const [client, dietician] = await Promise.all([
    prisma.user.findUnique({ where: { id: clientId } }),
    prisma.user.findUnique({ where: { id: dieticianId } }),
  ]);

  if (!client || client.role !== UserRole.CLIENT) {
    return { error: "USER_NOT_CLIENT" as const };
  }
  if (!dietician || dietician.role !== UserRole.DIETICIAN) {
    return { error: "USER_NOT_DIETICIAN" as const };
  }
  if (client.status !== UserStatus.ACTIVE || dietician.status !== UserStatus.ACTIVE) {
    return { error: "VALIDATION_ERROR" as const };
  }

  const existingActive = await prisma.clientDieticianAssignment.findFirst({
    where: {
      clientId,
      status: AssignmentStatus.ACTIVE,
    },
  });
  if (existingActive) {
    return { error: "CLIENT_ALREADY_ASSIGNED" as const };
  }

  const assignment = await prisma.clientDieticianAssignment.create({
    data: {
      clientId,
      dieticianId,
      status: AssignmentStatus.ACTIVE,
    },
  });

  await createAuditLog({
    action: AuditAction.CLIENT_ASSIGNED,
    entityType: "ClientDieticianAssignment",
    entityId: assignment.id,
    metadata: {
      clientId,
      dieticianId,
    },
  });

  return { data: assignment };
}

export async function deactivateAssignment(assignmentId: string) {
  const existing = await prisma.clientDieticianAssignment.findUnique({
    where: { id: assignmentId },
  });

  if (!existing) {
    return { error: "NOT_FOUND" as const };
  }

  const updated = await prisma.clientDieticianAssignment.update({
    where: { id: assignmentId },
    data: {
      status: AssignmentStatus.INACTIVE,
      unassignedAt: new Date(),
    },
  });

  await createAuditLog({
    action: AuditAction.CLIENT_UNASSIGNED,
    entityType: "ClientDieticianAssignment",
    entityId: updated.id,
    metadata: {
      clientId: updated.clientId,
      dieticianId: updated.dieticianId,
    },
  });

  return { data: updated };
}

export async function getActiveAssignmentsCount() {
  return prisma.clientDieticianAssignment.count({
    where: { status: AssignmentStatus.ACTIVE },
  });
}
