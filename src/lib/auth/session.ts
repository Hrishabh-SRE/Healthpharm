import { randomUUID } from "crypto";
import { cookies } from "next/headers";

import type { AuthUser } from "@/types/auth";

const SESSION_COOKIE_NAME = "healthcare_portal_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const inMemorySessionStore = new Map<string, AuthUser>();

export async function createSession(user: AuthUser): Promise<string> {
  const sessionToken = randomUUID();
  inMemorySessionStore.set(sessionToken, user);
  return sessionToken;
}

export async function readCurrentSession(): Promise<{ token: string; user: AuthUser } | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const user = inMemorySessionStore.get(sessionToken);
  if (!user) {
    return null;
  }

  return { token: sessionToken, user };
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function getSessionMaxAgeSeconds(): number {
  return SESSION_MAX_AGE_SECONDS;
}

export function destroySession(token: string): void {
  inMemorySessionStore.delete(token);
}
