import { requireClientApi } from "@/lib/auth/guards";
import { getClientProfileBundle } from "@/lib/services/client-profile.service";
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
    assignedDietician: profile.assignedDietician,
    profileCompletionPercent: profile.clientProfile?.profileCompletionPercent ?? 0,
  });
}
