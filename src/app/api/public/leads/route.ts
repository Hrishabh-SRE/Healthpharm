import { NextRequest } from "next/server";

import { createLead } from "@/lib/public/leads-store";
import { leadSchema } from "@/lib/validation/lead.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json()) as unknown;
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid lead submission payload.", 400);
  }

  const lead = createLead(parsed.data);
  return successResponse(
    {
      leadId: lead.id,
      status: lead.status,
    },
    201,
  );
}
