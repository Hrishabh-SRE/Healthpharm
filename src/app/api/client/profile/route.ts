import { NextRequest } from "next/server";

import { assertClientCanAccessOwnData } from "@/lib/auth/permissions";
import { requireClientApi } from "@/lib/auth/guards";
import { getClientProfileBundle, updateClientProfile } from "@/lib/services/client-profile.service";
import { clientProfileUpdateSchema } from "@/lib/validation/profile.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const profile = await getClientProfileBundle(auth.user.id);
  if (!profile) {
    return errorResponse("NOT_FOUND", "Client profile not found.", 404);
  }

  return successResponse({
    user: profile.user,
    clientProfile: profile.clientProfile,
  });
}

export async function PATCH(request: NextRequest): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const body = (await request.json()) as unknown;
  const parsed = clientProfileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid profile payload.", 400);
  }

  if (!assertClientCanAccessOwnData(auth.user.id, auth.user.id)) {
    return errorResponse("FORBIDDEN", "You can only update your own profile.", 403);
  }

  const updated = await updateClientProfile(auth.user.id, parsed.data, auth.user.id);
  if (!updated) {
    return errorResponse("NOT_FOUND", "Client profile not found.", 404);
  }

  return successResponse({
    user: updated.user,
    clientProfile: updated.clientProfile,
  });
}
