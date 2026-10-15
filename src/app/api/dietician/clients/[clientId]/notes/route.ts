import { NextRequest } from "next/server";
import { NoteType, NoteVisibility } from "@prisma/client";

import { requireDieticianApi } from "@/lib/auth/guards";
import { createNoteForAssignedClient, getNotesForAssignedClient } from "@/lib/services/note.service";
import { createNoteSchema, noteFilterSchema } from "@/lib/validation/note.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ clientId: string }>;
};

export async function GET(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const { clientId } = await params;
  const parsedFilters = noteFilterSchema.safeParse({
    visibility: request.nextUrl.searchParams.get("visibility") ?? undefined,
    noteType: request.nextUrl.searchParams.get("noteType") ?? undefined,
  });
  if (!parsedFilters.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid notes filters.", 400);
  }

  const result = await getNotesForAssignedClient(auth.user.id, clientId, {
    visibility: parsedFilters.data.visibility as NoteVisibility | undefined,
    noteType: parsedFilters.data.noteType as NoteType | undefined,
  });

  if ("error" in result) {
    return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
  }

  return successResponse({ notes: result.data });
}

export async function POST(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json()) as unknown;
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid note payload.", 400);
  }

  const { clientId } = await params;
  const result = await createNoteForAssignedClient(auth.user.id, clientId, {
    title: parsed.data.title ?? null,
    content: parsed.data.content,
    visibility: parsed.data.visibility,
    noteType: parsed.data.noteType,
  });

  if ("error" in result) {
    return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
  }

  return successResponse({ note: result.data }, 201);
}
