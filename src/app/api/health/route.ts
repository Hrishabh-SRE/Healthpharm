import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATABASE_TIMEOUT_MS = 3000;

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

/**
 * Bounded so an unresponsive database fails the probe instead of hanging it.
 * Prisma applies no timeout of its own to a raw query.
 */
async function assertDatabaseReachable(): Promise<void> {
  let timeoutHandle: NodeJS.Timeout | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`Database did not respond within ${DATABASE_TIMEOUT_MS}ms.`));
    }, DATABASE_TIMEOUT_MS);
  });

  try {
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
  } finally {
    clearTimeout(timeoutHandle);
  }
}

export async function GET(): Promise<Response> {
  try {
    await assertDatabaseReachable();

    return NextResponse.json(
      { status: "healthy", timestamp: new Date().toISOString() },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("[health] database check failed:", error);

    return NextResponse.json({ status: "unhealthy" }, { status: 503, headers: NO_STORE_HEADERS });
  }
}
