import { requireClientApi } from "@/lib/auth/guards";
import { getSharedNotesForClient } from "@/lib/services/note.service";
import { successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const notes = await getSharedNotesForClient(auth.user.id);
  return successResponse({ notes });
}
