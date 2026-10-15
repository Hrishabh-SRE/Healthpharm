import { LRUCache } from "lru-cache";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
  notified: boolean;
};

export const RATE_LIMITS = {
  LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 },
  PUBLIC_LEAD: { limit: 3, windowMs: 60 * 60 * 1000 },
} as const;

const MAX_TRACKED_KEYS = 10_000;
const LOCAL_FALLBACK_IP = "127.0.0.1";

const globalForRateLimit = globalThis as unknown as {
  rateLimitCache: LRUCache<string, RateLimitEntry> | undefined;
};

const cache =
  globalForRateLimit.rateLimitCache ??
  new LRUCache<string, RateLimitEntry>({ max: MAX_TRACKED_KEYS });

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitCache = cache;
}

export function getClientIp(request: Request): string {
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) {
    return cloudflareIp;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  const firstHop = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (firstHop) {
    return firstHop;
  }

  return LOCAL_FALLBACK_IP;
}

/**
 * Fixed-window counter. `resetAt` is the source of truth for the window because
 * lru-cache refreshes an entry's ttl on every set, which would otherwise push the
 * deadline forward on each increment and never let a caller out of the window.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = cache.get(key);

  if (!existing || existing.resetAt <= now) {
    cache.set(key, { count: 1, resetAt: now + windowMs, notified: false }, { ttl: windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

    // Log once per window, not per blocked request: a flood would otherwise
    // turn the limiter into a log-volume amplifier on a single-disk host.
    if (!existing.notified) {
      existing.notified = true;
      console.warn(`[rate-limit] blocked ${key} for ${retryAfterSeconds}s after ${limit} requests`);
    }

    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  cache.set(key, existing, { ttl: existing.resetAt - now });

  return { allowed: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

/**
 * Clears a counter after the caller proves they are legitimate, so shared-NAT
 * users cannot lock each other out by signing in successfully.
 */
export function resetRateLimit(key: string): void {
  cache.delete(key);
}
