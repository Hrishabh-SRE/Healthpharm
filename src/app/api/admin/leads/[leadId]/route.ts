import { NextRequest } from "next/server";
import { LeadStatus } from "@prisma/client";

import { requireAdminApi } from "@/lib/auth/guards";
import { getLeadById, updateLeadStatus } from "@/lib/services/lead.service";
import { adminLeadStatusSchema } from "@/lib/validation/admin-lead.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ leadId: string }>;
};

export async function GET(_: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  const { leadId } = await params;
  const lead = await getLeadById(leadId);
  if (!lead) {
    return errorResponse("NOT_FOUND", "Lead not found.", 404);
  }

  return successResponse({ lead });
}

export async function PATCH(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const { leadId } = await params;
    const body = (await request.json()) as unknown;
    const parsed = adminLeadStatusSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid lead status payload.", 400);
    }

    const lead = await getLeadById(leadId);
    if (!lead) {
      return errorResponse("NOT_FOUND", "Lead not found.", 404);
    }

    const updated = await updateLeadStatus(leadId, parsed.data.status as LeadStatus);
    return successResponse({ lead: updated });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to update lead status.", 500);
  }
}
