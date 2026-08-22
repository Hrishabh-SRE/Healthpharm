import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { logout } from "@/lib/auth/auth";
import { clearSessionCookie } from "@/lib/auth/session";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const cookieStore = await cookies();
    await logout({
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    });
    clearSessionCookie(cookieStore);

    return successResponse({ loggedOut: true });
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to process logout request.", 500);
  }
}
