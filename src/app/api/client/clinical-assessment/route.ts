import { NextRequest } from "next/server";

import { requireClientApi } from "@/lib/auth/guards";
import {
  getClientClinicalAssessment,
  updateClientClinicalAssessment,
} from "@/lib/services/clinical-assessment.service";
import { clientClinicalAssessmentUpdateSchema } from "@/lib/validation/clinical-assessment.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const result = await getClientClinicalAssessment(auth.user.id);
  return successResponse({ assessment: result.data });
}

export async function PATCH(request: NextRequest): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json()) as unknown;
  const parsed = clientClinicalAssessmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid clinical assessment payload.", 400);
  }

  const result = await updateClientClinicalAssessment(auth.user.id, parsed.data);
  if ("error" in result) {
    return errorResponse(
      "CLINICAL_ASSESSMENT_LOCKED",
      "Assessment can only be edited while status is DRAFT.",
      409,
    );
  }

  return successResponse({ assessment: result.data });
}
