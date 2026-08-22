# Healthcare Dietician Portal

Healthcare Dietician Portal is a modular monolithic Next.js application for a healthcare/nutrition company.

## Phase 3 Scope

Phase 3 adds the **admin foundation** on top of completed Phase 2:

- Admin dashboard overview cards + recent activity
- Admin lead management (`/admin/leads`)
- Lead conversion into CLIENT user
- Admin users management (`/admin/users`)
- Client/Dietician profile creation on user creation
- Admin assignment management (`/admin/assignments`)
- Admin-only APIs under `/api/admin/*`
- Audit logs for major admin actions

## What Changed From Phase 2

- Prisma schema extended with:
  - `ClientProfile`
  - `DieticianProfile`
  - `ClientDieticianAssignment`
  - expanded `AuditAction` and new `AssignmentStatus`
- Seed script updated with additional users/profiles/leads/assignment
- New admin service layer methods for leads/users/assignments
- New validation schemas for admin workflows
- New admin UI components and pages

## New Database Models

- `ClientProfile` (1:1 with `User` where role = CLIENT)
- `DieticianProfile` (1:1 with `User` where role = DIETICIAN)
- `ClientDieticianAssignment` (client <-> dietician assignment with `ACTIVE/INACTIVE`)

Key business rule implemented:
- A client can have only one `ACTIVE` assignment at a time.

## Tech Stack

- Next.js App Router
- TypeScript strict mode
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- shadcn-style UI primitives
- React Hook Form + Zod
- bcryptjs hashing

## Environment Variables

Create `.env` from `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/healthcare_dietician_portal?schema=public"
SESSION_COOKIE_NAME="hdp_session"
SESSION_MAX_AGE_DAYS="7"
```

## Local Setup

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:generate
npm run db:migrate -- --name phase3_admin_foundation
npm run db:seed
npm run dev
```

If you use Podman:

```bash
podman machine start
podman run -d \
  --name healthcare-dietician-postgres \
  -e POSTGRES_DB=healthcare_dietician_portal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  docker.io/library/postgres:16
```

Then run the same `npm run db:*` commands.

## Seeded Local Credentials

Local development credentials only:

- Admin: `admin@example.com` / `password123`
- Dietician 1: `dietician@example.com` / `password123`
- Dietician 2: `dietician2@example.com` / `password123`
- Client 1: `client@example.com` / `password123`
- Client 2: `client2@example.com` / `password123`

## Admin Lead Management

- Route: `/admin/leads`
- APIs:
  - `GET /api/admin/leads`
  - `GET/PATCH /api/admin/leads/[leadId]`
  - `POST /api/admin/leads/[leadId]/convert-to-client`
- Supports search, status filtering, status update, and conversion.

## Lead Conversion Flow

Convert lead -> client performs:

1. Create CLIENT `User` with hashed temporary password
2. Create `ClientProfile`
3. Update lead to `CONVERTED`
4. Set `Lead.convertedClientId`
5. Write audit logs:
   - `USER_CREATED`
   - `CLIENT_PROFILE_CREATED`
   - `LEAD_CONVERTED_TO_CLIENT`

Conversion is blocked if lead already converted or email already exists.

## User Creation / Management

- Route: `/admin/users`
- APIs:
  - `GET /api/admin/users`
  - `POST /api/admin/users`
  - `GET/PATCH /api/admin/users/[userId]`
- Creating CLIENT auto-creates `ClientProfile`
- Creating DIETICIAN auto-creates `DieticianProfile`
- Deactivation sets user status to `INACTIVE` and revokes active sessions

## Assignment Management

- Route: `/admin/assignments`
- APIs:
  - `GET /api/admin/assignments`
  - `POST /api/admin/assignments`
  - `PATCH /api/admin/assignments/[assignmentId]`
  - `GET /api/admin/clients`
  - `GET /api/admin/dieticians`

Rules:
- Client must be active CLIENT
- Dietician must be active DIETICIAN
- Reject if client already has active assignment (`CLIENT_ALREADY_ASSIGNED`)
- Deactivation sets status `INACTIVE` and `unassignedAt`
- Audit logs:
  - `CLIENT_ASSIGNED`
  - `CLIENT_UNASSIGNED`

## Testing Checklist

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run lint
npm run build
```

Manual checks:

- Admin pages: `/admin/dashboard`, `/admin/leads`, `/admin/users`, `/admin/assignments`
- Non-admin blocked from admin pages and `/api/admin/*`
- Lead status updates and conversion
- Converted leads cannot be converted twice
- User creation for CLIENT/DIETICIAN creates corresponding profiles
- Assignment creation and deactivation rules
- Public website and role-based login still work

## Intentionally Not Built Yet

- Full client dashboard modules
- Full dietician workspace modules
- Notes, assessments, questionnaire/chat, diet recall, 24-hour diet, QC table
- Diet plan builder
- Uploads, notifications, payments, analytics-heavy modules

## Next Phase Recommendation (Phase 4)

- Client dashboard profile read/write flows
- Dietician dashboard assigned-client list and basic client view
