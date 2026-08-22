import { NextRequest } from "next/server";

import { requireDieticianApi } from "@/lib/auth/guards";
import { getAssignedClientDetail } from "@/lib/services/dietician-client.service";
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

  return successResponse(data);
}
