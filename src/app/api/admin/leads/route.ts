import { NextRequest } from "next/server";
import { LeadStatus } from "@prisma/client";

import { requireAdminApi } from "@/lib/auth/guards";
import { listAdminLeads } from "@/lib/services/lead.service";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") ?? undefined;
    const statusParam = searchParams.get("status");
    const status =
      statusParam && statusParam !== "ALL" && Object.values(LeadStatus).includes(statusParam as LeadStatus)
        ? (statusParam as LeadStatus)
        : "ALL";

    const leads = await listAdminLeads({ q, status });
    return successResponse({ leads });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to fetch leads.", 500);
  }
}
