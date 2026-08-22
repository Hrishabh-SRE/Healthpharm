import { UserRole, UserStatus } from "@prisma/client";

import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db/prisma";
import type { AdminUserFilter } from "@/types/admin";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function updateUserLastLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}

export function isUserActive(status: UserStatus): boolean {
  return status === UserStatus.ACTIVE;
}

export async function listUsers(filters: AdminUserFilter) {
  const q = filters.q?.trim();

  return prisma.user.findMany({
    where: {
      role: filters.role && filters.role !== "ALL" ? filters.role : undefined,
      status: filters.status && filters.status !== "ALL" ? filters.status : undefined,
      OR: q
        ? [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });
}

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  temporaryPassword: string;
  status: UserStatus;
};

export async function createUserWithRoleProfile(input: CreateUserInput) {
  const passwordHash = await hashPassword(input.temporaryPassword);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.toLowerCase(),
        phone: input.phone || null,
        role: input.role,
        status: input.status,
        passwordHash,
      },
    });

    if (input.role === UserRole.CLIENT) {
      await tx.clientProfile.create({
        data: {
          userId: user.id,
          primaryGoal: null,
        },
      });
    }

    if (input.role === UserRole.DIETICIAN) {
      await tx.dieticianProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    return user;
  });
}

export async function updateUserBasicInfo(
  userId: string,
  input: { firstName?: string; lastName?: string; phone?: string; status?: UserStatus },
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      status: input.status,
    },
  });
}

export async function deactivateUser(userId: string) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: { status: UserStatus.INACTIVE },
    });

    await tx.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return user;
  });
}

export async function listActiveClients() {
  return prisma.user.findMany({
    where: {
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      clientProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listActiveDieticians() {
  return prisma.user.findMany({
    where: {
      role: UserRole.DIETICIAN,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      dieticianProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTotalUsersCount() {
  return prisma.user.count();
}

export async function getActiveClientsCount() {
  return prisma.user.count({
    where: {
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    },
  });
}

export async function getActiveDieticiansCount() {
  return prisma.user.count({
    where: {
      role: UserRole.DIETICIAN,
      status: UserStatus.ACTIVE,
    },
  });
}
