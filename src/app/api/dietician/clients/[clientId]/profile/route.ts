import { NextRequest } from "next/server";

import { requireDieticianApi } from "@/lib/auth/guards";
import { getAssignedClientDetail, updateAssignedClientProfile } from "@/lib/services/dietician-client.service";
import { clientProfileUpdateSchema } from "@/lib/validation/profile.schema";
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
  const data = await getAssignedClientDetail(auth.user.id, clientId);
  if (!data) {
    return errorResponse("FORBIDDEN", "Client is not assigned to this dietician.", 403);
  }

  return successResponse({
    user: data.client,
    clientProfile: data.client.clientProfile,
  });
}

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json()) as unknown;
  const parsed = clientProfileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid profile payload.", 400);
  }

  const { clientId } = await params;
  const result = await updateAssignedClientProfile(auth.user.id, clientId, parsed.data);
  if ("error" in result) {
    if (result.error === "FORBIDDEN") {
      return errorResponse("FORBIDDEN", "Client is not assigned to this dietician.", 403);
    }
    return errorResponse("NOT_FOUND", "Client profile not found.", 404);
  }

  return successResponse({
    user: result.data.user,
    clientProfile: result.data.clientProfile,
  });
}
