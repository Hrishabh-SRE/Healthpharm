import { requireDieticianApi } from "@/lib/auth/guards";
import { getDieticianDashboard } from "@/lib/services/dietician-client.service";
import { successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const data = await getDieticianDashboard(auth.user.id);
  return successResponse(data);
}
