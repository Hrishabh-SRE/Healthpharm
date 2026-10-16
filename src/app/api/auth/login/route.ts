import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { loginSchema } from "@/lib/validation/auth.schema";
import { setSessionCookie } from "@/lib/auth/session";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { getDashboardRouteForRole, loginWithCredentials } from "@/lib/auth/auth";
import { RATE_LIMITS, getClientIp, rateLimit, resetRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  const rateLimitKey = `login:${getClientIp(request)}`;
  const limitResult = rateLimit(
    rateLimitKey,
    RATE_LIMITS.LOGIN.limit,
    RATE_LIMITS.LOGIN.windowMs,
  );

  if (!limitResult.allowed) {
    return errorResponse("TOO_MANY_REQUESTS", "Too many requests. Please try again later.", 429, {
      "Retry-After": String(limitResult.retryAfterSeconds),
    });
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password.", 401);
    }

    const result = await loginWithCredentials(parsed.data, {
      ipAddress: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    });

    if (!result) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid email or password.", 401);
    }

    const cookieStore = await cookies();
    setSessionCookie(cookieStore, result.sessionToken);
    resetRateLimit(rateLimitKey);

    return successResponse(
      {
        user: result.user,
        redirectTo: getDashboardRouteForRole(result.user.role),
      },
      200,
    );
  } catch {
    return errorResponse("SERVER_ERROR", "Unable to process login request.", 500);
  }
}
