import { requireClientApi } from "@/lib/auth/guards";
import { submitClientClinicalAssessment } from "@/lib/services/clinical-assessment.service";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function POST(): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const result = await submitClientClinicalAssessment(auth.user.id);
  if ("error" in result) {
    if (result.error === "CLINICAL_ASSESSMENT_NOT_FOUND") {
      return errorResponse("CLINICAL_ASSESSMENT_NOT_FOUND", "Clinical assessment not found.", 404);
    }
    return errorResponse(
      "INVALID_STATUS_TRANSITION",
      "Only DRAFT assessments can be submitted.",
      409,
    );
  }

  return successResponse({ assessment: result.data });
}
