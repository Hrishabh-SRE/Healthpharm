import { requireClientApi } from "@/lib/auth/guards";
import { getClientDashboardSummary } from "@/lib/services/client-dashboard.service";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireClientApi();
  if (auth.error) {
    return auth.error;
  }

  const summary = await getClientDashboardSummary(auth.user.id);
  if (!summary) {
    return errorResponse("NOT_FOUND", "Client profile not found.", 404);
  }

  return successResponse(summary);
}
