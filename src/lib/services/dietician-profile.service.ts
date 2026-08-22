import { prisma } from "@/lib/db/prisma";

export async function createDieticianProfileForUser(userId: string) {
  return prisma.dieticianProfile.create({
    data: {
      userId,
    },
  });
}
