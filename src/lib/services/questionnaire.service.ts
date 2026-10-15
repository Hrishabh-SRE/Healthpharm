import { AuditAction, QuestionThreadStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { getActiveAssignmentForClient, assertDieticianCanAccessClient } from "@/lib/services/assignment.service";
import { createAuditLog } from "@/lib/services/audit-log.service";

type SendMessageInput = {
  messageBody: string;
};

async function getThreadMessages(threadId: string, limit = 100) {
  const rows = await prisma.message.findMany({
    where: {
      threadId,
      isDeleted: false,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return rows.reverse();
}

async function getOrCreateThreadForPair(clientId: string, dieticianId: string) {
  const existing = await prisma.questionThread.findUnique({
    where: {
      clientId_dieticianId: {
        clientId,
        dieticianId,
      },
    },
  });

  if (existing) {
    return { thread: existing, created: false as const };
  }

  const thread = await prisma.questionThread.create({
    data: {
      clientId,
      dieticianId,
      status: QuestionThreadStatus.OPEN,
    },
  });

  await createAuditLog({
    userId: dieticianId,
    action: AuditAction.QUESTION_THREAD_CREATED,
    entityType: "QuestionThread",
    entityId: thread.id,
    metadata: {
      clientId,
      dieticianId,
    },
  });

  return { thread, created: true as const };
}

export async function getOrCreateThreadForClient(clientUserId: string) {
  const activeAssignment = await getActiveAssignmentForClient(clientUserId);
  if (!activeAssignment) {
    return { error: "NO_ACTIVE_ASSIGNMENT" as const };
  }

  const pair = await getOrCreateThreadForPair(clientUserId, activeAssignment.dieticianId);
  const messages = await getThreadMessages(pair.thread.id);
  const unreadCount = await prisma.message.count({
    where: {
      threadId: pair.thread.id,
      senderId: {
        not: clientUserId,
      },
      readAt: null,
      isDeleted: false,
    },
  });

  return {
    data: {
      thread: pair.thread,
      assignedDietician: activeAssignment.dietician,
      messages,
      unreadCount,
    },
  };
}

export async function getClientQuestionnaire(clientUserId: string) {
  return getOrCreateThreadForClient(clientUserId);
}

export async function getOrCreateThreadForDieticianClient(dieticianUserId: string, clientId: string) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const pair = await getOrCreateThreadForPair(clientId, dieticianUserId);
  const messages = await getThreadMessages(pair.thread.id);
  const unreadCount = await prisma.message.count({
    where: {
      threadId: pair.thread.id,
      senderId: {
        not: dieticianUserId,
      },
      readAt: null,
      isDeleted: false,
    },
  });

  const client = await prisma.user.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });

  if (!client) {
    return { error: "NOT_FOUND" as const };
  }

  return {
    data: {
      thread: pair.thread,
      client,
      messages,
      unreadCount,
    },
  };
}

export async function getDieticianClientQuestionnaire(dieticianUserId: string, clientId: string) {
  return getOrCreateThreadForDieticianClient(dieticianUserId, clientId);
}

export async function sendClientQuestionnaireMessage(clientUserId: string, input: SendMessageInput) {
  const bundle = await getOrCreateThreadForClient(clientUserId);
  if ("error" in bundle) {
    return bundle;
  }

  const now = new Date();
  const message = await prisma.message.create({
    data: {
      threadId: bundle.data.thread.id,
      senderId: clientUserId,
      messageBody: input.messageBody,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  await prisma.questionThread.update({
    where: { id: bundle.data.thread.id },
    data: { lastMessageAt: now, status: QuestionThreadStatus.OPEN },
  });

  await createAuditLog({
    userId: clientUserId,
    action: AuditAction.MESSAGE_SENT,
    entityType: "Message",
    entityId: message.id,
    metadata: {
      threadId: bundle.data.thread.id,
    },
  });

  return { data: message };
}

export async function sendDieticianQuestionnaireMessage(
  dieticianUserId: string,
  clientId: string,
  input: SendMessageInput,
) {
  const bundle = await getOrCreateThreadForDieticianClient(dieticianUserId, clientId);
  if ("error" in bundle) {
    return bundle;
  }

  const now = new Date();
  const message = await prisma.message.create({
    data: {
      threadId: bundle.data.thread.id,
      senderId: dieticianUserId,
      messageBody: input.messageBody,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  await prisma.questionThread.update({
    where: { id: bundle.data.thread.id },
    data: { lastMessageAt: now, status: QuestionThreadStatus.OPEN },
  });

  await createAuditLog({
    userId: dieticianUserId,
    action: AuditAction.MESSAGE_SENT,
    entityType: "Message",
    entityId: message.id,
    metadata: {
      threadId: bundle.data.thread.id,
      clientId,
    },
  });

  return { data: message };
}

export async function markClientQuestionnaireMessagesRead(clientUserId: string) {
  const bundle = await getOrCreateThreadForClient(clientUserId);
  if ("error" in bundle) {
    return bundle;
  }

  const result = await prisma.message.updateMany({
    where: {
      threadId: bundle.data.thread.id,
      senderId: {
        not: clientUserId,
      },
      readAt: null,
      isDeleted: false,
    },
    data: {
      readAt: new Date(),
    },
  });

  if (result.count > 0) {
    await createAuditLog({
      userId: clientUserId,
      action: AuditAction.MESSAGES_MARKED_READ,
      entityType: "QuestionThread",
      entityId: bundle.data.thread.id,
      metadata: {
        markedReadCount: result.count,
      },
    });
  }

  return { data: { markedReadCount: result.count } };
}

export async function markDieticianClientQuestionnaireMessagesRead(dieticianUserId: string, clientId: string) {
  const bundle = await getOrCreateThreadForDieticianClient(dieticianUserId, clientId);
  if ("error" in bundle) {
    return bundle;
  }

  const result = await prisma.message.updateMany({
    where: {
      threadId: bundle.data.thread.id,
      senderId: {
        not: dieticianUserId,
      },
      readAt: null,
      isDeleted: false,
    },
    data: {
      readAt: new Date(),
    },
  });

  if (result.count > 0) {
    await createAuditLog({
      userId: dieticianUserId,
      action: AuditAction.MESSAGES_MARKED_READ,
      entityType: "QuestionThread",
      entityId: bundle.data.thread.id,
      metadata: {
        clientId,
        markedReadCount: result.count,
      },
    });
  }

  return { data: { markedReadCount: result.count } };
}

export async function getUnreadQuestionnaireCountForClient(clientUserId: string) {
  const activeAssignment = await getActiveAssignmentForClient(clientUserId);
  if (!activeAssignment) {
    return 0;
  }

  const thread = await prisma.questionThread.findUnique({
    where: {
      clientId_dieticianId: {
        clientId: clientUserId,
        dieticianId: activeAssignment.dieticianId,
      },
    },
    select: { id: true },
  });

  if (!thread) {
    return 0;
  }

  return prisma.message.count({
    where: {
      threadId: thread.id,
      senderId: {
        not: clientUserId,
      },
      readAt: null,
      isDeleted: false,
    },
  });
}

export async function getUnreadQuestionnaireCountForDietician(dieticianUserId: string) {
  const assignments = await prisma.clientDieticianAssignment.findMany({
    where: {
      dieticianId: dieticianUserId,
      status: "ACTIVE",
    },
    select: {
      clientId: true,
    },
  });
  const clientIds = assignments.map((assignment) => assignment.clientId);
  if (clientIds.length === 0) {
    return 0;
  }

  return prisma.message.count({
    where: {
      thread: {
        dieticianId: dieticianUserId,
        clientId: { in: clientIds },
      },
      senderId: {
        not: dieticianUserId,
      },
      readAt: null,
      isDeleted: false,
    },
  });
}

export async function getUnreadQuestionnaireCountByAssignedClient(dieticianUserId: string) {
  const assignments = await prisma.clientDieticianAssignment.findMany({
    where: {
      dieticianId: dieticianUserId,
      status: "ACTIVE",
    },
    select: {
      clientId: true,
    },
  });
  const clientIds = assignments.map((assignment) => assignment.clientId);
  if (clientIds.length === 0) {
    return {};
  }

  const unread = await prisma.message.groupBy({
    by: ["threadId"],
    where: {
      thread: {
        dieticianId: dieticianUserId,
        clientId: { in: clientIds },
      },
      senderId: {
        not: dieticianUserId,
      },
      readAt: null,
      isDeleted: false,
    },
    _count: {
      _all: true,
    },
  });

  const threadIds = unread.map((item) => item.threadId);
  const threads = await prisma.questionThread.findMany({
    where: {
      id: { in: threadIds },
    },
    select: {
      id: true,
      clientId: true,
    },
  });

  const clientMap: Record<string, number> = {};
  for (const thread of threads) {
    const count = unread.find((item) => item.threadId === thread.id)?._count._all ?? 0;
    clientMap[thread.clientId] = count;
  }

  return clientMap;
}
