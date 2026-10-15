import { createHash, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

import { env } from "@/env";
import { prisma } from "@/lib/db/prisma";
import { errorResponse, successResponse } from "@/lib/utils/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AUDIT_LOG_RETENTION_DAYS = 90;
const BEARER_PREFIX = "Bearer ";

/**
 * Both sides are digested first so timingSafeEqual always receives equal-length
 * buffers; comparing the raw strings would throw on a length mismatch and leak
 * the secret's length through that difference in behaviour.
 */
function isAuthorizedCronRequest(request: NextRequest): boolean {
  const header = request.headers.get("authorization");

  if (!header?.startsWith(BEARER_PREFIX)) {
    return false;
  }

  const provided = createHash("sha256").update(header.slice(BEARER_PREFIX.length)).digest();
  const expected = createHash("sha256").update(env.CRON_SECRET).digest();

  return timingSafeEqual(provided, expected);
}

export async function POST(request: NextRequest): Promise<Response> {
  if (!isAuthorizedCronRequest(request)) {
    return errorResponse("UNAUTHORIZED", "Invalid or missing cron credentials.", 401);
  }

  try {
    const now = new Date();
    const auditLogCutoff = new Date(
      now.getTime() - AUDIT_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    );

    const [expiredSessions, staleAuditLogs] = await Promise.all([
      prisma.session.deleteMany({ where: { expiresAt: { lt: now } } }),
      prisma.auditLog.deleteMany({ where: { createdAt: { lt: auditLogCutoff } } }),
    ]);

    console.log(
      `[cron:prune-data] deleted sessions=${expiredSessions.count} auditLogs=${staleAuditLogs.count}`,
    );

    return successResponse({
      deletedSessions: expiredSessions.count,
      deletedAuditLogs: staleAuditLogs.count,
      auditLogCutoff: auditLogCutoff.toISOString(),
      completedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("[cron:prune-data] failed:", error);

    return errorResponse("SERVER_ERROR", "Data pruning failed.", 500);
  }
}
