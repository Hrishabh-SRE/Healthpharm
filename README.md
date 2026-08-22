# Healthcare Dietician Portal

Healthcare Dietician Portal is a modular monolithic Next.js application for a healthcare/nutrition company.
Phase 2 replaces mock persistence/auth infrastructure with PostgreSQL + Prisma + database-backed sessions while preserving the Phase 1 public website and placeholder dashboards.

## Phase 2 Scope

- PostgreSQL support and Prisma ORM setup
- Initial Prisma schema and seed script
- Database-backed users (replacing hardcoded mock users)
- Database-backed opaque sessions (replacing in-memory sessions)
- Real auth/session handling with secure HTTP-only cookies
- Database-backed lead creation API with audit logging
- Existing public website and placeholder dashboards preserved

## What Changed From Phase 1

- Added `prisma/schema.prisma` with `User`, `Session`, `Lead`, and `AuditLog` models plus enums and indexes.
- Added `prisma/seed.ts` for seeded development users and sample leads.
- Added `src/lib/db/prisma.ts` singleton Prisma client.
- Added service layer under `src/lib/services` (`user`, `session`, `lead`, `audit-log`).
- Replaced mock auth/session internals in `src/lib/auth` with real DB-backed implementation.
- Updated `/api/auth/*` and `/api/public/leads` route handlers to use Zod + service layer + standardized API responses.

## Folder Structure

```text
src/
  app/
    (public)/...
    (portal)/...
    api/
      auth/
      public/leads/
  components/
    auth/
    dashboard/
    forms/
    layout/
    public/
    shared/
    ui/
  content/
  lib/
    auth/
    db/
    services/
    utils/
    validation/
  types/
prisma/
  schema.prisma
  seed.ts
```

## Tech Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn-style UI primitives (Button, Input, Card, etc.)
- PostgreSQL
- Prisma ORM
- React Hook Form
- Zod
- ESLint + Prettier
- bcryptjs for password hashing/verification

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/healthcare_dietician_portal?schema=public"
SESSION_COOKIE_NAME="hdp_session"
SESSION_MAX_AGE_DAYS="7"
```

## Start PostgreSQL Locally

Using Docker Compose:

```bash
docker compose up -d
```

This starts PostgreSQL at `localhost:5432` with:

- DB: `healthcare_dietician_portal`
- User: `postgres`
- Password: `postgres`

## Local Setup (Phase 2)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Start PostgreSQL:
   ```bash
   docker compose up -d
   ```
4. Generate Prisma client:
   ```bash
   npm run db:generate
   ```
5. Run migrations:
   ```bash
   npm run db:migrate -- --name init_phase2
   ```
6. Seed database:
   ```bash
   npm run db:seed
   ```
7. Start app:
   ```bash
   npm run dev
   ```

## Seeded Development Credentials (Local Only)

- Admin: `admin@example.com` / `password123`
- Dietician: `dietician@example.com` / `password123`
- Client: `client@example.com` / `password123`

These credentials are for local development/testing only.

## Auth Behavior (Phase 2)

- Login submits to `POST /api/auth/login`
- Credentials are validated against database users
- Password verification uses hashed passwords (`bcryptjs`)
- On login, app generates a cryptographically secure opaque session token
- Only token hash is stored in `Session` table
- Raw token is set in secure HTTP-only cookie
- Session lookup validates non-revoked and non-expired session records
- Role-based redirect after login:
  - ADMIN -> `/admin/dashboard`
  - DIETICIAN -> `/dietician/dashboard`
  - CLIENT -> `/client/dashboard`

## Role-Based Routing Rules

- Logged-out users visiting `/admin/dashboard`, `/dietician/dashboard`, or `/client/dashboard` are redirected to `/login`.
- Wrong-role access is handled consistently by redirecting users to their own dashboard route.

## Lead API (Phase 2)

- `POST /api/public/leads` validates payload with Zod.
- Lead is stored in PostgreSQL via Prisma.
- `AuditLog` is written with `LEAD_CREATED` action.
- API returns success message:
  - `Thank you. Your consultation request has been submitted. Our team will contact you soon.`

## Verification Commands

```bash
npm run lint
npm run build
```

## Intentionally Not Built Yet

- Full admin user management UI
- Admin lead management UI
- Lead-to-client conversion workflows
- Client profile modules and portal feature tabs
- Dietician client workspace
- Questionnaire/chat, notes, clinical assessment
- Diet recall, 24-hour diet review, QC table
- Diet plan builder
- File uploads, payments, notifications

## Next Phase Recommendation (Phase 3)

- Build admin lead management and lead lifecycle flow (NEW -> CONTACTED -> CONVERTED/CLOSED)
- Introduce user provisioning/conversion workflows
- Start role-specific portal modules on top of this DB-backed foundation
