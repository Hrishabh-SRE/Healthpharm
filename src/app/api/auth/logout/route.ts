import { cookies } from "next/headers";

import { logout } from "@/lib/auth/auth";
import { getSessionCookieName } from "@/lib/auth/session";
import { successResponse } from "@/lib/utils/api-response";

export async function POST(): Promise<Response> {
  const cookieStore = await cookies();
  await logout();
  cookieStore.delete(getSessionCookieName());

  return successResponse({ loggedOut: true });
}
