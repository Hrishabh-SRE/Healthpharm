import { NextResponse, type NextRequest } from "next/server";

/**
 * Mirrors the default in src/lib/auth/session.ts. It is redeclared rather than
 * imported because that module pulls in next/headers and node:crypto, and
 * src/env.ts calls process.exit — none of which exist on the edge runtime.
 */
const DEFAULT_SESSION_COOKIE_NAME = "hdp_session";

const LOGIN_PATH = "/login";

/**
 * Defence in depth only. The edge runtime cannot reach Prisma, so this proves
 * nothing about the session beyond the cookie being present; every protected
 * page and route still performs the real check through requireAuth/requireRole.
 */
export function middleware(request: NextRequest): NextResponse {
  const cookieName = process.env.SESSION_COOKIE_NAME ?? DEFAULT_SESSION_COOKIE_NAME;

  if (request.cookies.get(cookieName)?.value) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

export const config = {
  matcher: ["/client/:path*", "/dietician/:path*", "/admin/:path*"],
};
