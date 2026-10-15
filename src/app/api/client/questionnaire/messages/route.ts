import { NextRequest } from "next/server";

import { requireClientApi } from "@/lib/auth/guards";
import { sendClientQuestionnaireMessage } from "@/lib/services/questionnaire.service";
import { sendMessageSchema } from "@/lib/validation/questionnaire.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json()) as unknown;
  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid message payload.", 400);
  }

  const result = await sendClientQuestionnaireMessage(auth.user.id, parsed.data);
  if ("error" in result) {
    return errorResponse("NO_ACTIVE_ASSIGNMENT", "No active dietician assignment found.", 403);
  }

  return successResponse({ message: result.data }, 201);
}
