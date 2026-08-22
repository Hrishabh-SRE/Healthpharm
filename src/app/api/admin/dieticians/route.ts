import { requireAdminApi } from "@/lib/auth/guards";
import { listActiveDieticians } from "@/lib/services/user.service";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const dieticians = await listActiveDieticians();
    return successResponse({ dieticians });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to fetch dieticians.", 500);
  }
}
