import { NextRequest } from "next/server";

import { requireAdminApi } from "@/lib/auth/guards";
import { createAssignment, listAssignments } from "@/lib/services/assignment.service";
import { createAssignmentSchema } from "@/lib/validation/assignment.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const assignments = await listAssignments();
    return successResponse({ assignments });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to fetch assignments.", 500);
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = createAssignmentSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid assignment payload.", 400);
    }

    const result = await createAssignment(parsed.data.clientId, parsed.data.dieticianId);
    if ("error" in result) {
      if (result.error === "USER_NOT_CLIENT") {
        return errorResponse("USER_NOT_CLIENT", "Selected user is not a client.", 400);
      }
      if (result.error === "USER_NOT_DIETICIAN") {
        return errorResponse("USER_NOT_DIETICIAN", "Selected user is not a dietician.", 400);
      }
      if (result.error === "CLIENT_ALREADY_ASSIGNED") {
        return errorResponse("CLIENT_ALREADY_ASSIGNED", "Client already has an active assignment.", 409);
      }
      return errorResponse("VALIDATION_ERROR", "Unable to create assignment.", 400);
    }

    return successResponse({ assignment: result.data }, 201);
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to create assignment.", 500);
  }
}
