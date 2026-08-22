import "dotenv/config";

import { AssignmentStatus, PrismaClient, UserRole, UserStatus, LeadStatus, AuditAction } from "@prisma/client";

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
      email: "dietician2@example.com",
      role: UserRole.DIETICIAN,
      firstName: "Dietician",
      lastName: "Second",
    },
    {
      email: "client@example.com",
      role: UserRole.CLIENT,
      firstName: "Client",
      lastName: "User",
    },
    {
      email: "client2@example.com",
      role: UserRole.CLIENT,
      firstName: "Client",
      lastName: "Second",
    },
  ] as const;

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

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

    if (!existingUser) {
      await prisma.auditLog.create({
        data: {
          userId: createdOrUpdated.id,
          action: AuditAction.USER_CREATED,
          entityType: "User",
          entityId: createdOrUpdated.id,
        },
      });
    }

    if (createdOrUpdated.role === UserRole.CLIENT) {
      await prisma.clientProfile.upsert({
        where: { userId: createdOrUpdated.id },
        create: {
          userId: createdOrUpdated.id,
          gender: "Female",
          primaryContact: "9990001111",
          primaryGoal: "General wellness",
          activityState: "Moderately active",
          clientMedicalCondition: "None",
          height: "165",
          weight: "68",
          profileCompletionPercent: 70,
        },
        update: {
          gender: "Female",
          primaryContact: "9990001111",
          primaryGoal: "General wellness",
          activityState: "Moderately active",
          clientMedicalCondition: "None",
          height: "165",
          weight: "68",
        },
      });

      if (!existingUser) {
        await prisma.auditLog.create({
          data: {
            userId: createdOrUpdated.id,
            action: AuditAction.CLIENT_PROFILE_CREATED,
            entityType: "ClientProfile",
            entityId: createdOrUpdated.id,
          },
        });
      }
    }

    if (createdOrUpdated.role === UserRole.DIETICIAN) {
      await prisma.dieticianProfile.upsert({
        where: { userId: createdOrUpdated.id },
        create: {
          userId: createdOrUpdated.id,
          qualification: "MSc Nutrition",
          specialization: "Clinical Nutrition",
        },
        update: {},
      });

      if (!existingUser) {
        await prisma.auditLog.create({
          data: {
            userId: createdOrUpdated.id,
            action: AuditAction.DIETICIAN_PROFILE_CREATED,
            entityType: "DieticianProfile",
            entityId: createdOrUpdated.id,
          },
        });
      }
    }
  }
}

async function seedLeads(): Promise<void> {
  const sampleLeads = [
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
    {
      fullName: "Kabir Rao",
      email: "kabir.lead@example.com",
      phone: "9965544332",
      interestedService: "Diet Plans",
      healthGoal: "Need sustainable routine-oriented meal planning.",
      preferredDate: new Date(Date.now() + 259200000),
      preferredTime: "12:30",
      message: "Prefer weekday consultations.",
      consentAccepted: true,
      status: LeadStatus.CLOSED,
    },
  ] as const;

  for (const lead of sampleLeads) {
    const existing = await prisma.lead.findFirst({
      where: {
        email: lead.email,
        phone: lead.phone,
      },
    });

    if (!existing) {
      await prisma.lead.create({ data: lead });
    }
  }
}

async function seedAssignment(): Promise<void> {
  const client = await prisma.user.findUnique({ where: { email: "client@example.com" } });
  const clientTwo = await prisma.user.findUnique({ where: { email: "client2@example.com" } });
  const dietician = await prisma.user.findUnique({ where: { email: "dietician@example.com" } });
  const dieticianTwo = await prisma.user.findUnique({ where: { email: "dietician2@example.com" } });

  if (!client || !dietician) {
    return;
  }

  const existing = await prisma.clientDieticianAssignment.findFirst({
    where: {
      clientId: client.id,
      dieticianId: dietician.id,
      status: AssignmentStatus.ACTIVE,
    },
  });

  if (!existing) {
    const assignment = await prisma.clientDieticianAssignment.create({
      data: {
        clientId: client.id,
        dieticianId: dietician.id,
        status: AssignmentStatus.ACTIVE,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: AuditAction.CLIENT_ASSIGNED,
        entityType: "ClientDieticianAssignment",
        entityId: assignment.id,
      },
    });
  }

  if (clientTwo && dieticianTwo) {
    const secondExisting = await prisma.clientDieticianAssignment.findFirst({
      where: {
        clientId: clientTwo.id,
        status: AssignmentStatus.ACTIVE,
      },
    });
    if (!secondExisting) {
      const assignment = await prisma.clientDieticianAssignment.create({
        data: {
          clientId: clientTwo.id,
          dieticianId: dieticianTwo.id,
          status: AssignmentStatus.ACTIVE,
        },
      });
      await prisma.auditLog.create({
        data: {
          action: AuditAction.CLIENT_ASSIGNED,
          entityType: "ClientDieticianAssignment",
          entityId: assignment.id,
        },
      });
    }
  }
}

async function main(): Promise<void> {
  await seedUsers();
  await seedLeads();
  await seedAssignment();

  console.log("Local development credentials only:");
  console.log("");
  console.log("Admin:");
  console.log("admin@example.com / password123");
  console.log("");
  console.log("Dietician:");
  console.log("dietician@example.com / password123");
  console.log("dietician2@example.com / password123");
  console.log("");
  console.log("Client:");
  console.log("client@example.com / password123");
  console.log("client2@example.com / password123");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
