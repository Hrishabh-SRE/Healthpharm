import { NextRequest } from "next/server";

import { requireAdminApi } from "@/lib/auth/guards";
import { deactivateAssignment } from "@/lib/services/assignment.service";
import { updateAssignmentSchema } from "@/lib/validation/assignment.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ assignmentId: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = updateAssignmentSchema.safeParse(body);
    if (!parsed.success || parsed.data.status !== "INACTIVE") {
      return errorResponse("VALIDATION_ERROR", "Invalid assignment update payload.", 400);
    }

    const { assignmentId } = await params;
    const result = await deactivateAssignment(assignmentId);
    if ("error" in result) {
      return errorResponse("NOT_FOUND", "Assignment not found.", 404);
    }

    return successResponse({ assignment: result.data });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to update assignment.", 500);
  }
}
