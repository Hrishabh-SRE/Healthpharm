import "dotenv/config";

import {
  AssignmentStatus,
  ClinicalAssessmentStatus,
  QuestionThreadStatus,
  PrismaClient,
  UserRole,
  UserStatus,
  LeadStatus,
  AuditAction,
  NoteType,
  NoteVisibility,
} from "@prisma/client";

import { hashPassword } from "../src/lib/auth/password";

const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/**
 * This script writes well-known accounts with a shared throwaway password, so it
 * must never touch a real environment. NODE_ENV alone is not enough: running
 * `npm run db:seed` from a shell usually leaves it undefined, so the database
 * host is checked too and anything non-local is refused by default.
 */
function assertSafeSeedEnvironment(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "DANGER: The development seed script cannot be run in production. Use db:bootstrap instead.",
    );
  }

  if (process.env.ALLOW_REMOTE_DB_SEED === "true") {
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DANGER: DATABASE_URL is not set. Refusing to run the development seed script.");
  }

  let host: string;
  try {
    host = new URL(databaseUrl).hostname;
  } catch {
    throw new Error("DANGER: DATABASE_URL could not be parsed. Refusing to run the development seed script.");
  }

  if (!LOCAL_DATABASE_HOSTS.has(host)) {
    throw new Error(
      `DANGER: The development seed script only runs against a local database, but DATABASE_URL points at "${host}". ` +
        "Use db:bootstrap for real environments, or set ALLOW_REMOTE_DB_SEED=true to override deliberately.",
    );
  }
}

assertSafeSeedEnvironment();

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

async function seedNotes(): Promise<void> {
  const client = await prisma.user.findUnique({ where: { email: "client@example.com" } });
  const clientTwo = await prisma.user.findUnique({ where: { email: "client2@example.com" } });
  const dietician = await prisma.user.findUnique({ where: { email: "dietician@example.com" } });
  const dieticianTwo = await prisma.user.findUnique({ where: { email: "dietician2@example.com" } });

  if (!client || !dietician) {
    return;
  }

  const seedNotesInput: Array<{
    clientId: string;
    authorId: string;
    title: string | null;
    content: string;
    visibility: NoteVisibility;
    noteType: NoteType;
  }> = [
    {
      clientId: client.id,
      authorId: dietician.id,
      title: "Private progress tracking",
      content: "Client shows good adherence on weekdays. Recheck meal timing next visit.",
      visibility: NoteVisibility.PRIVATE,
      noteType: NoteType.INTERNAL,
    },
    {
      clientId: client.id,
      authorId: dietician.id,
      title: "Weekly focus",
      content: "Please keep hydration above 2.5L and continue evening walks this week.",
      visibility: NoteVisibility.SHARED_WITH_CLIENT,
      noteType: NoteType.FOLLOW_UP,
    },
  ];

  if (clientTwo && dieticianTwo) {
    seedNotesInput.push({
      clientId: clientTwo.id,
      authorId: dieticianTwo.id,
      title: "Welcome guidance",
      content: "Start with simple breakfast consistency and food log tracking.",
      visibility: NoteVisibility.SHARED_WITH_CLIENT,
      noteType: NoteType.GENERAL,
    });
  }

  for (const noteInput of seedNotesInput) {
    const existing = await prisma.note.findFirst({
      where: {
        clientId: noteInput.clientId,
        authorId: noteInput.authorId,
        title: noteInput.title,
        content: noteInput.content,
        visibility: noteInput.visibility,
        noteType: noteInput.noteType,
        isDeleted: false,
      },
      select: { id: true },
    });

    if (!existing) {
      const created = await prisma.note.create({
        data: noteInput,
      });

      await prisma.auditLog.create({
        data: {
          userId: noteInput.authorId,
          action: AuditAction.NOTE_CREATED,
          entityType: "Note",
          entityId: created.id,
          metadata: {
            clientId: noteInput.clientId,
            seeded: true,
          },
        },
      });
    }
  }
}

async function seedQuestionnaire(): Promise<void> {
  const client = await prisma.user.findUnique({ where: { email: "client@example.com" } });
  const clientTwo = await prisma.user.findUnique({ where: { email: "client2@example.com" } });
  const dietician = await prisma.user.findUnique({ where: { email: "dietician@example.com" } });
  const dieticianTwo = await prisma.user.findUnique({ where: { email: "dietician2@example.com" } });

  if (!client || !dietician) {
    return;
  }

  const primaryThread = await prisma.questionThread.upsert({
    where: {
      clientId_dieticianId: {
        clientId: client.id,
        dieticianId: dietician.id,
      },
    },
    create: {
      clientId: client.id,
      dieticianId: dietician.id,
      status: QuestionThreadStatus.OPEN,
    },
    update: {
      status: QuestionThreadStatus.OPEN,
    },
  });

  const primaryMessages = [
    {
      senderId: client.id,
      messageBody: "Can I have rice for dinner?",
    },
    {
      senderId: dietician.id,
      messageBody: "Yes, but keep the portion controlled and pair it with protein and vegetables.",
    },
    {
      senderId: client.id,
      messageBody: "Should I prefer brown rice or white rice on workout days?",
    },
  ] as const;

  for (const messageInput of primaryMessages) {
    const existing = await prisma.message.findFirst({
      where: {
        threadId: primaryThread.id,
        senderId: messageInput.senderId,
        messageBody: messageInput.messageBody,
        isDeleted: false,
      },
      select: { id: true },
    });

    if (!existing) {
      const created = await prisma.message.create({
        data: {
          threadId: primaryThread.id,
          senderId: messageInput.senderId,
          messageBody: messageInput.messageBody,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: messageInput.senderId,
          action: AuditAction.MESSAGE_SENT,
          entityType: "Message",
          entityId: created.id,
          metadata: {
            seeded: true,
            threadId: primaryThread.id,
          },
        },
      });
    }
  }

  const latestPrimaryMessage = await prisma.message.findFirst({
    where: { threadId: primaryThread.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  await prisma.questionThread.update({
    where: { id: primaryThread.id },
    data: {
      lastMessageAt: latestPrimaryMessage?.createdAt ?? primaryThread.updatedAt,
    },
  });

  if (clientTwo && dieticianTwo) {
    const secondaryThread = await prisma.questionThread.upsert({
      where: {
        clientId_dieticianId: {
          clientId: clientTwo.id,
          dieticianId: dieticianTwo.id,
        },
      },
      create: {
        clientId: clientTwo.id,
        dieticianId: dieticianTwo.id,
        status: QuestionThreadStatus.OPEN,
      },
      update: {
        status: QuestionThreadStatus.OPEN,
      },
    });

    const existingSecondaryMessage = await prisma.message.findFirst({
      where: {
        threadId: secondaryThread.id,
        senderId: clientTwo.id,
        messageBody: "Can you suggest a simple breakfast plan?",
        isDeleted: false,
      },
      select: { id: true },
    });

    if (!existingSecondaryMessage) {
      const created = await prisma.message.create({
        data: {
          threadId: secondaryThread.id,
          senderId: clientTwo.id,
          messageBody: "Can you suggest a simple breakfast plan?",
        },
      });
      await prisma.auditLog.create({
        data: {
          userId: clientTwo.id,
          action: AuditAction.MESSAGE_SENT,
          entityType: "Message",
          entityId: created.id,
          metadata: {
            seeded: true,
            threadId: secondaryThread.id,
          },
        },
      });
    }

    const latestSecondaryMessage = await prisma.message.findFirst({
      where: { threadId: secondaryThread.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    await prisma.questionThread.update({
      where: { id: secondaryThread.id },
      data: {
        lastMessageAt: latestSecondaryMessage?.createdAt ?? secondaryThread.updatedAt,
      },
    });
  }
}

async function seedClinicalAssessments(): Promise<void> {
  const client = await prisma.user.findUnique({ where: { email: "client@example.com" } });
  const clientTwo = await prisma.user.findUnique({ where: { email: "client2@example.com" } });
  const dietician = await prisma.user.findUnique({ where: { email: "dietician@example.com" } });
  const dieticianTwo = await prisma.user.findUnique({ where: { email: "dietician2@example.com" } });

  if (!client || !dietician) {
    return;
  }

  const clientOneAssessment = await prisma.clinicalAssessment.upsert({
    where: { clientId: client.id },
    create: {
      clientId: client.id,
      createdById: client.id,
      updatedById: dietician.id,
      reviewedById: dietician.id,
      status: ClinicalAssessmentStatus.REVIEWED,
      chiefConcern: "Weight management with better energy.",
      currentSymptoms: "Late evening hunger and bloating after dinner.",
      currentMedications: "No regular medications.",
      medicalHistory: "No major chronic condition reported.",
      allergies: "No known allergies.",
      familyHistory: "Family history of diabetes.",
      sleepPattern: "Sleep duration around 6-7 hours.",
      stressLevel: "Moderate work stress.",
      activityLevel: "Walks 4 days per week.",
      height: 165,
      weight: 67.5,
      bmi: 24.8,
      fastingBloodSugar: 95,
      hba1c: 5.6,
      totalCholesterol: 182,
      clinicalObservations: "Good motivation, moderate adherence required.",
      assessmentSummary: "Needs meal timing consistency and protein balancing.",
      nutritionDiagnosis: "Inconsistent meal structure with high evening hunger.",
      dieticianRecommendations: "Add protein at breakfast and track portions at dinner.",
      followUpRecommendations: "Follow up in 2 weeks with meal log.",
      reviewedAt: new Date(),
    },
    update: {
      updatedById: dietician.id,
      reviewedById: dietician.id,
      status: ClinicalAssessmentStatus.REVIEWED,
      chiefConcern: "Weight management with better energy.",
      currentSymptoms: "Late evening hunger and bloating after dinner.",
      currentMedications: "No regular medications.",
      medicalHistory: "No major chronic condition reported.",
      allergies: "No known allergies.",
      familyHistory: "Family history of diabetes.",
      sleepPattern: "Sleep duration around 6-7 hours.",
      stressLevel: "Moderate work stress.",
      activityLevel: "Walks 4 days per week.",
      height: 165,
      weight: 67.5,
      bmi: 24.8,
      fastingBloodSugar: 95,
      hba1c: 5.6,
      totalCholesterol: 182,
      clinicalObservations: "Good motivation, moderate adherence required.",
      assessmentSummary: "Needs meal timing consistency and protein balancing.",
      nutritionDiagnosis: "Inconsistent meal structure with high evening hunger.",
      dieticianRecommendations: "Add protein at breakfast and track portions at dinner.",
      followUpRecommendations: "Follow up in 2 weeks with meal log.",
      reviewedAt: new Date(),
    },
  });

  const createdAuditExists = await prisma.auditLog.findFirst({
    where: {
      action: AuditAction.CLINICAL_ASSESSMENT_CREATED,
      entityId: clientOneAssessment.id,
      metadata: {
        path: ["seeded"],
        equals: true,
      },
    },
    select: { id: true },
  });
  if (!createdAuditExists) {
    await prisma.auditLog.create({
      data: {
        userId: client.id,
        action: AuditAction.CLINICAL_ASSESSMENT_CREATED,
        entityType: "ClinicalAssessment",
        entityId: clientOneAssessment.id,
        metadata: {
          seeded: true,
          clientId: client.id,
        },
      },
    });
  }

  if (clientTwo && dieticianTwo) {
    const clientTwoAssessment = await prisma.clinicalAssessment.upsert({
      where: { clientId: clientTwo.id },
      create: {
        clientId: clientTwo.id,
        createdById: clientTwo.id,
        updatedById: clientTwo.id,
        status: ClinicalAssessmentStatus.DRAFT,
        chiefConcern: "Improve breakfast routine and morning energy.",
        activityLevel: "Lightly active",
        height: 160,
        weight: 71,
      },
      update: {
        updatedById: clientTwo.id,
        status: ClinicalAssessmentStatus.DRAFT,
        chiefConcern: "Improve breakfast routine and morning energy.",
        activityLevel: "Lightly active",
        height: 160,
        weight: 71,
      },
    });

    const createdAuditExistsTwo = await prisma.auditLog.findFirst({
      where: {
        action: AuditAction.CLINICAL_ASSESSMENT_CREATED,
        entityId: clientTwoAssessment.id,
        metadata: {
          path: ["seeded"],
          equals: true,
        },
      },
      select: { id: true },
    });
    if (!createdAuditExistsTwo) {
      await prisma.auditLog.create({
        data: {
          userId: clientTwo.id,
          action: AuditAction.CLINICAL_ASSESSMENT_CREATED,
          entityType: "ClinicalAssessment",
          entityId: clientTwoAssessment.id,
          metadata: {
            seeded: true,
            clientId: clientTwo.id,
          },
        },
      });
    }
  }
}

async function main(): Promise<void> {
  await seedUsers();
  await seedLeads();
  await seedAssignment();
  await seedNotes();
  await seedQuestionnaire();
  await seedClinicalAssessments();

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
