import { NextRequest } from "next/server";

import { requireDieticianApi } from "@/lib/auth/guards";
import {
  getDieticianClientClinicalAssessment,
  updateDieticianClientClinicalAssessment,
} from "@/lib/services/clinical-assessment.service";
import { dieticianClinicalAssessmentUpdateSchema } from "@/lib/validation/clinical-assessment.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ clientId: string }>;
};

export async function GET(_: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const { clientId } = await params;
  const result = await getDieticianClientClinicalAssessment(auth.user.id, clientId);
  if ("error" in result) {
    return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
  }

  return successResponse({ assessment: result.data });
}

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json()) as unknown;
  const parsed = dieticianClinicalAssessmentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid clinical assessment payload.", 400);
  }

  const { clientId } = await params;
  const result = await updateDieticianClientClinicalAssessment(auth.user.id, clientId, parsed.data);
  if ("error" in result) {
    if (result.error === "CLINICAL_ASSESSMENT_LOCKED") {
      return errorResponse(
        "CLINICAL_ASSESSMENT_LOCKED",
        "Finalized assessments are read-only in this phase.",
        409,
      );
    }
    return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
  }

  return successResponse({ assessment: result.data });
}
