import { requireAdminApi } from "@/lib/auth/guards";
import { listActiveClients } from "@/lib/services/user.service";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const clients = await listActiveClients();
    return successResponse({ clients });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to fetch clients.", 500);
  }
}
