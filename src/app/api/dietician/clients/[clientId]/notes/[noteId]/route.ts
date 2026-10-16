import { NextRequest } from "next/server";

import { requireDieticianApi } from "@/lib/auth/guards";
import { softDeleteNoteForAssignedClient, updateNoteForAssignedClient } from "@/lib/services/note.service";
import { updateNoteSchema } from "@/lib/validation/note.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ clientId: string; noteId: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json()) as unknown;
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid note payload.", 400);
  }

  const { clientId, noteId } = await params;
  const result = await updateNoteForAssignedClient(auth.user.id, clientId, noteId, parsed.data);
  if ("error" in result) {
    if (result.error === "CLIENT_NOT_ASSIGNED") {
      return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
    }
    return errorResponse("NOTE_NOT_FOUND", "Note not found.", 404);
  }

  return successResponse({ note: result.data });
}

export async function DELETE(_: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const { clientId, noteId } = await params;
  const result = await softDeleteNoteForAssignedClient(auth.user.id, clientId, noteId);
  if ("error" in result) {
    if (result.error === "CLIENT_NOT_ASSIGNED") {
      return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
    }
    return errorResponse("NOTE_NOT_FOUND", "Note not found.", 404);
  }

  return successResponse({ ok: true });
}
