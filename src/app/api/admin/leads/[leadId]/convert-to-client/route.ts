import { NextRequest } from "next/server";

import { requireAdminApi } from "@/lib/auth/guards";
import { convertLeadToClient } from "@/lib/services/lead.service";
import { convertLeadToClientSchema } from "@/lib/validation/admin-lead.schema";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ leadId: string }>;
};

export async function POST(request: NextRequest, { params }: Params): Promise<Response> {
  const auth = await requireAdminApi();
  if (auth.error) {
    return auth.error;
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = convertLeadToClientSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid conversion payload.", 400);
    }

    const { leadId } = await params;
    const result = await convertLeadToClient({
      leadId,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      temporaryPassword: parsed.data.temporaryPassword,
      primaryGoal: parsed.data.primaryGoal,
    });

    if ("error" in result) {
      if (result.error === "NOT_FOUND") {
        return errorResponse("NOT_FOUND", "Lead not found.", 404);
      }
      if (result.error === "LEAD_ALREADY_CONVERTED") {
        return errorResponse("LEAD_ALREADY_CONVERTED", "Lead has already been converted.", 409);
      }
      if (result.error === "DUPLICATE_EMAIL") {
        return errorResponse("DUPLICATE_EMAIL", "A user with this email already exists.", 409);
      }
      return errorResponse("SERVER_ERROR", "Unable to convert lead.", 500);
    }

    return successResponse({
      user: {
        id: result.data.user.id,
        firstName: result.data.user.firstName,
        lastName: result.data.user.lastName,
        email: result.data.user.email,
        phone: result.data.user.phone,
        role: result.data.user.role,
        status: result.data.user.status,
        createdAt: result.data.user.createdAt,
        lastLoginAt: result.data.user.lastLoginAt,
      },
      lead: result.data.updatedLead,
    });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to convert lead.", 500);
  }
}
