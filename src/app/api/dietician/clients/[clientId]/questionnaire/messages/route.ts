import { NextRequest } from "next/server";

import { requireDieticianApi } from "@/lib/auth/guards";
import { sendDieticianQuestionnaireMessage } from "@/lib/services/questionnaire.service";
import { sendMessageSchema } from "@/lib/validation/questionnaire.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ clientId: string }>;
};

export async function POST(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json()) as unknown;
  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid message payload.", 400);
  }

  const { clientId } = await params;
  const result = await sendDieticianQuestionnaireMessage(auth.user.id, clientId, parsed.data);
  if ("error" in result) {
    if (result.error === "NOT_FOUND") {
      return errorResponse("NOT_FOUND", "Client not found.", 404);
    }
    return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
  }

  return successResponse({ message: result.data }, 201);
}
