import { prisma } from "@/lib/db/prisma";
import { generateSessionToken, getSessionExpiryDate, hashSessionToken } from "@/lib/auth/session";

type SessionMetadata = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function createUserSession(userId: string, metadata?: SessionMetadata): Promise<string> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt: getSessionExpiryDate(),
      ipAddress: metadata?.ipAddress ?? null,
      userAgent: metadata?.userAgent ?? null,
    },
  });

  return token;
}

export async function findValidSessionByToken(token: string) {
  const tokenHash = hashSessionToken(token);

  return prisma.session.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
}

export async function revokeSessionByToken(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  await prisma.session.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}
