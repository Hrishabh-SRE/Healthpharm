import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

const DEFAULT_SESSION_COOKIE_NAME = "hdp_session";
const DEFAULT_SESSION_MAX_AGE_DAYS = 7;

export function getSessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME ?? DEFAULT_SESSION_COOKIE_NAME;
}

export function getSessionMaxAgeDays(): number {
  const fromEnv = Number(process.env.SESSION_MAX_AGE_DAYS);
  if (Number.isFinite(fromEnv) && fromEnv > 0) {
    return fromEnv;
  }

  return DEFAULT_SESSION_MAX_AGE_DAYS;
}

export function getSessionMaxAgeSeconds(): number {
  return getSessionMaxAgeDays() * 24 * 60 * 60;
}

export function getSessionExpiryDate(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + getSessionMaxAgeDays());
  return expiresAt;
}

export function generateSessionToken(): string {
  return randomBytes(48).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function readSessionTokenFromCookieStore(cookieStore: CookieStore): string | null {
  return cookieStore.get(getSessionCookieName())?.value ?? null;
}

export function setSessionCookie(cookieStore: CookieStore, token: string): void {
  cookieStore.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: getSessionExpiryDate(),
  });
}

export function clearSessionCookie(cookieStore: CookieStore): void {
  cookieStore.delete(getSessionCookieName());
}
