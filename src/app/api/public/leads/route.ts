import { NextRequest } from "next/server";
import { AuditAction } from "@prisma/client";

import { createAuditLog } from "@/lib/services/audit-log.service";
import { createLeadRecord } from "@/lib/services/lead.service";
import { leadSchema } from "@/lib/validation/lead.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = (await request.json()) as unknown;
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid lead submission payload.", 400);
    }

    const lead = await createLeadRecord(parsed.data);
    await createAuditLog({
      action: AuditAction.LEAD_CREATED,
      entityType: "Lead",
      entityId: lead.id,
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    });

    return successResponse(
      {
        leadId: lead.id,
        status: lead.status,
        message: "Thank you. Your consultation request has been submitted. Our team will contact you soon.",
      },
      201,
    );
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to submit consultation request at the moment.", 500);
  }
}
