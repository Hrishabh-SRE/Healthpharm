import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { loginSchema } from "@/lib/validation/auth.schema";
import { createSession, getSessionCookieName, getSessionMaxAgeSeconds } from "@/lib/auth/session";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { getDashboardRouteForRole, loginWithCredentials } from "@/lib/auth/auth";

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json()) as unknown;
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Invalid email or password.", 401);
  }

  const user = await loginWithCredentials(parsed.data);
  if (!user) {
    return errorResponse("Invalid email or password.", 401);
  }

  const sessionToken = await createSession(user);
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionMaxAgeSeconds(),
  });

  return successResponse(
    {
      user,
      redirectTo: getDashboardRouteForRole(user.role),
    },
    200,
  );
}
