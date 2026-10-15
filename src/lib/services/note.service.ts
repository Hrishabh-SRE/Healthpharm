import { AuditAction, NoteType, NoteVisibility } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { assertDieticianCanAccessClient } from "@/lib/services/assignment.service";
import { createAuditLog } from "@/lib/services/audit-log.service";

type NoteFilters = {
  visibility?: NoteVisibility;
  noteType?: NoteType;
};

type NoteInput = {
  title?: string | null;
  content: string;
  visibility: NoteVisibility;
  noteType: NoteType;
};

type NoteUpdateInput = {
  title?: string | null;
  content?: string;
  visibility?: NoteVisibility;
  noteType?: NoteType;
};

export async function getSharedNotesForClient(clientUserId: string) {
  return prisma.note.findMany({
    where: {
      clientId: clientUserId,
      visibility: NoteVisibility.SHARED_WITH_CLIENT,
      isDeleted: false,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getNotesForAssignedClient(
  dieticianUserId: string,
  clientId: string,
  filters: NoteFilters,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const notes = await prisma.note.findMany({
    where: {
      clientId,
      isDeleted: false,
      visibility: filters.visibility,
      noteType: filters.noteType,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data: notes };
}

export async function createNoteForAssignedClient(
  dieticianUserId: string,
  clientId: string,
  input: NoteInput,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const note = await prisma.note.create({
    data: {
      clientId,
      authorId: dieticianUserId,
      title: input.title ?? null,
      content: input.content,
      visibility: input.visibility,
      noteType: input.noteType,
      isDeleted: false,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  await createAuditLog({
    userId: dieticianUserId,
    action: AuditAction.NOTE_CREATED,
    entityType: "Note",
    entityId: note.id,
    metadata: {
      clientId,
      visibility: note.visibility,
      noteType: note.noteType,
    },
  });

  return { data: note };
}

export async function updateNoteForAssignedClient(
  dieticianUserId: string,
  clientId: string,
  noteId: string,
  input: NoteUpdateInput,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const existing = await prisma.note.findFirst({
    where: {
      id: noteId,
      clientId,
      isDeleted: false,
    },
  });

  if (!existing) {
    return { error: "NOTE_NOT_FOUND" as const };
  }

  const note = await prisma.note.update({
    where: { id: noteId },
    data: {
      title: input.title !== undefined ? input.title : existing.title,
      content: input.content !== undefined ? input.content : existing.content,
      visibility: input.visibility !== undefined ? input.visibility : existing.visibility,
      noteType: input.noteType !== undefined ? input.noteType : existing.noteType,
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  await createAuditLog({
    userId: dieticianUserId,
    action: AuditAction.NOTE_UPDATED,
    entityType: "Note",
    entityId: note.id,
    metadata: {
      clientId,
    },
  });

  return { data: note };
}

export async function softDeleteNoteForAssignedClient(
  dieticianUserId: string,
  clientId: string,
  noteId: string,
) {
  const access = await assertDieticianCanAccessClient(dieticianUserId, clientId);
  if (!access.allowed) {
    return { error: "CLIENT_NOT_ASSIGNED" as const };
  }

  const existing = await prisma.note.findFirst({
    where: {
      id: noteId,
      clientId,
      isDeleted: false,
    },
  });

  if (!existing) {
    return { error: "NOTE_NOT_FOUND" as const };
  }

  const note = await prisma.note.update({
    where: { id: noteId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedById: dieticianUserId,
    },
  });

  await createAuditLog({
    userId: dieticianUserId,
    action: AuditAction.NOTE_DELETED,
    entityType: "Note",
    entityId: note.id,
    metadata: {
      clientId,
    },
  });

  return { data: note };
}
