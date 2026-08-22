import { NextRequest } from "next/server";

import { requireDieticianApi } from "@/lib/auth/guards";
import { searchAssignedClients } from "@/lib/services/dietician-client.service";
import { dieticianClientsQuerySchema } from "@/lib/validation/profile.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireDieticianApi();
  if (auth.error) {
    return auth.error;
  }

  const query = {
    q: request.nextUrl.searchParams.get("q") ?? undefined,
    incompleteOnly: request.nextUrl.searchParams.get("incompleteOnly") ?? undefined,
  };
  const parsed = dieticianClientsQuerySchema.safeParse(query);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid search filters.", 400);
  }

  const clients = await searchAssignedClients(auth.user.id, parsed.data);
  return successResponse({ clients });
}
