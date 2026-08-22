import "dotenv/config";

import { PrismaClient, UserRole, UserStatus, LeadStatus, AuditAction } from "@prisma/client";

import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function seedUsers(): Promise<void> {
  const defaultPasswordHash = await hashPassword("password123");

  const users = [
    {
      email: "admin@example.com",
      role: UserRole.ADMIN,
      firstName: "Platform",
      lastName: "Admin",
    },
    {
      email: "dietician@example.com",
      role: UserRole.DIETICIAN,
      firstName: "Dietician",
      lastName: "User",
    },
    {
      email: "client@example.com",
      role: UserRole.CLIENT,
      firstName: "Client",
      lastName: "User",
    },
  ] as const;

  for (const user of users) {
    const createdOrUpdated = await prisma.user.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        passwordHash: defaultPasswordHash,
        role: user.role,
        status: UserStatus.ACTIVE,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      update: {
        passwordHash: defaultPasswordHash,
        role: user.role,
        status: UserStatus.ACTIVE,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: createdOrUpdated.id,
        action: AuditAction.USER_CREATED,
        entityType: "User",
        entityId: createdOrUpdated.id,
      },
    });
  }
}

async function seedLeads(): Promise<void> {
  const existingLeadCount = await prisma.lead.count();
  if (existingLeadCount > 0) {
    return;
  }

  await prisma.lead.createMany({
    data: [
      {
        fullName: "Neha Sharma",
        email: "neha.lead@example.com",
        phone: "9991112233",
        interestedService: "Fat Loss Program",
        healthGoal: "Improve body composition and energy levels.",
        preferredDate: new Date(),
        preferredTime: "10:00",
        message: "Looking for structured guidance with weekly follow-up.",
        consentAccepted: true,
        status: LeadStatus.NEW,
      },
      {
        fullName: "Arjun Nair",
        email: "arjun.lead@example.com",
        phone: "9988877766",
        interestedService: "Clinical Nutrition",
        healthGoal: "Need personalized nutrition for metabolic health support.",
        preferredDate: new Date(Date.now() + 86400000),
        preferredTime: "16:30",
        message: "Would like to discuss practical meal planning.",
        consentAccepted: true,
        status: LeadStatus.CONTACTED,
      },
      {
        fullName: "Riya Malhotra",
        email: "riya.lead@example.com",
        phone: "9976655443",
        interestedService: "Muscle Gain Diet",
        healthGoal: "Build lean muscle with better meal structure.",
        preferredDate: new Date(Date.now() + 172800000),
        preferredTime: "18:00",
        message: "Need support with training-aligned nutrition.",
        consentAccepted: true,
        status: LeadStatus.NEW,
      },
    ],
  });
}

async function main(): Promise<void> {
  await seedUsers();
  await seedLeads();

  console.log("Local development credentials only:");
  console.log("");
  console.log("Admin:");
  console.log("admin@example.com / password123");
  console.log("");
  console.log("Dietician:");
  console.log("dietician@example.com / password123");
  console.log("");
  console.log("Client:");
  console.log("client@example.com / password123");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
