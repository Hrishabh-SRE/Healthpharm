import { prisma } from "@/lib/db/prisma";

export async function createClientProfileForUser(userId: string, primaryGoal?: string | null) {
  return prisma.clientProfile.create({
    data: {
      userId,
      primaryGoal: primaryGoal || null,
    },
  });
}
