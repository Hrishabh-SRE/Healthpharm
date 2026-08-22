import { AuditAction, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

type AuditInput = {
  userId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function createAuditLog(input: AuditInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: input.userId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      metadata: input.metadata,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}

export async function listRecentAuditLogs(limit = 10) {
  return prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}
