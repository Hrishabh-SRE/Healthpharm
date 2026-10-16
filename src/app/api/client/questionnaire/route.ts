import { requireClientApi } from "@/lib/auth/guards";
import { getClientQuestionnaire } from "@/lib/services/questionnaire.service";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const result = await getClientQuestionnaire(auth.user.id);
  if ("error" in result) {
    return errorResponse("NO_ACTIVE_ASSIGNMENT", "No active dietician assignment found.", 403);
  }

  return successResponse(result.data);
}
