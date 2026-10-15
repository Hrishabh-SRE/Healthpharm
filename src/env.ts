import { z } from "zod";

const DEFAULT_SESSION_MAX_AGE_DAYS = 7;

const envSchema = z.object({
  DATABASE_URL: z
    .string({ error: "DATABASE_URL is required." })
    .min(1, "DATABASE_URL is required.")
    .refine(
      (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must be a PostgreSQL connection string.",
    ),
  SESSION_COOKIE_NAME: z
    .string({ error: "SESSION_COOKIE_NAME is required." })
    .trim()
    .min(1, "SESSION_COOKIE_NAME is required."),
  SESSION_MAX_AGE_DAYS: z.coerce
    .number({ error: "SESSION_MAX_AGE_DAYS must be a number of days." })
    .int("SESSION_MAX_AGE_DAYS must be a whole number of days.")
    .positive("SESSION_MAX_AGE_DAYS must be greater than zero.")
    .default(DEFAULT_SESSION_MAX_AGE_DAYS),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (parsed.success) {
    return parsed.data;
  }

  console.error("Invalid environment configuration. The application cannot start.");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".") || "env"}: ${issue.message}`);
  }
  console.error("See .env.example for the expected variables.");

  process.exit(1);
}

export const env = parseEnv();
