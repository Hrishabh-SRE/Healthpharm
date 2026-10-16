import { NextRequest } from "next/server";

import { requireDieticianApi } from "@/lib/auth/guards";
import { markDieticianClientQuestionnaireMessagesRead } from "@/lib/services/questionnaire.service";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ clientId: string }>;
};

export async function POST(_: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const { clientId } = await params;
  const result = await markDieticianClientQuestionnaireMessagesRead(auth.user.id, clientId);
  if ("error" in result) {
    if (result.error === "NOT_FOUND") {
      return errorResponse("NOT_FOUND", "Client not found.", 404);
    }
    return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
  }

  return successResponse(result.data);
}
