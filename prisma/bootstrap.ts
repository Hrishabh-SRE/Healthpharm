import "dotenv/config";

import { AuditAction, Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

import { hashPassword } from "../src/lib/auth/password";

const MIN_ADMIN_PASSWORD_LENGTH = 12;

const ALREADY_INITIALIZED_MESSAGE = "Database already initialized. Aborting bootstrap.";

const adminCredentialsSchema = z.object({
  email: z
    .email("INITIAL_ADMIN_EMAIL must be a valid email address.")
    .transform((value) => value.trim().toLowerCase()),
  password: z
    .string()
    .min(
      MIN_ADMIN_PASSWORD_LENGTH,
      `INITIAL_ADMIN_PASSWORD must be at least ${MIN_ADMIN_PASSWORD_LENGTH} characters.`,
    ),
  firstName: z.string().trim().min(1).default("Platform"),
  lastName: z.string().trim().min(1).default("Admin"),
});

const prisma = new PrismaClient();

function readRequiredEnv(): { email: string; password: string } | null {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  const missing: string[] = [];
  if (!email?.trim()) {
    missing.push("INITIAL_ADMIN_EMAIL");
  }
  if (!password) {
    missing.push("INITIAL_ADMIN_PASSWORD");
  }

  if (missing.length > 0 || !email || !password) {
    console.error(`Bootstrap aborted. Missing required environment variables: ${missing.join(", ")}`);
    return null;
  }

  // Trim here rather than in the schema: zod validates the email before any
  // transform runs, so a pasted value with stray whitespace would be rejected.
  // The password is passed through untouched, since whitespace may be deliberate.
  return { email: email.trim(), password };
}

async function main(): Promise<void> {
  // Checked before the credentials so that re-running this in a deploy pipeline
  // stays a clean no-op once INITIAL_ADMIN_* has been removed from the environment.
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log(ALREADY_INITIALIZED_MESSAGE);
    return;
  }

  const rawCredentials = readRequiredEnv();
  if (!rawCredentials) {
    process.exitCode = 1;
    return;
  }

  const parsed = adminCredentialsSchema.safeParse({
    email: rawCredentials.email,
    password: rawCredentials.password,
    firstName: process.env.INITIAL_ADMIN_FIRST_NAME,
    lastName: process.env.INITIAL_ADMIN_LAST_NAME,
  });

  if (!parsed.success) {
    console.error("Bootstrap aborted. Invalid admin credentials:");
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    const admin = await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: AuditAction.USER_CREATED,
        entityType: "User",
        entityId: admin.id,
        metadata: { bootstrap: true },
      },
    });

    console.log(`Bootstrap complete. Initial admin created: ${admin.email}`);
    console.log("Sign in with the configured password, then rotate it and clear it from the environment.");
  } catch (error) {
    // A concurrent bootstrap won the race between the count and the insert.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      console.log(ALREADY_INITIALIZED_MESSAGE);
      return;
    }

    throw error;
  }
}

main()
  .catch((error) => {
    console.error("Bootstrap failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
