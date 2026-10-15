import { NextRequest } from "next/server";

import { requireDieticianApi } from "@/lib/auth/guards";
import { finalizeDieticianClientClinicalAssessment } from "@/lib/services/clinical-assessment.service";
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
  const result = await finalizeDieticianClientClinicalAssessment(auth.user.id, clientId);
  if ("error" in result) {
    if (result.error === "CLINICAL_ASSESSMENT_NOT_FOUND") {
      return errorResponse("CLINICAL_ASSESSMENT_NOT_FOUND", "Clinical assessment not found.", 404);
    }
    if (result.error === "INVALID_STATUS_TRANSITION") {
      return errorResponse(
        "INVALID_STATUS_TRANSITION",
        "Only REVIEWED assessments can be finalized.",
        409,
      );
    }
    return errorResponse("CLIENT_NOT_ASSIGNED", "Client is not assigned to this dietician.", 403);
  }

  return successResponse({ assessment: result.data });
}
