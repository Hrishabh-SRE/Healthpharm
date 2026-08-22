# Healthcare Dietician Portal

Healthcare Dietician Portal is a modular monolithic Next.js app for a healthcare/nutrition company.

## Phase 4 Scope

Phase 4 adds the first real client and dietician portal workflows on top of completed Phase 3:

- Client dashboard with real profile completion and assignment summary
- Client profile page with editable sections and persistence
- Dietician dashboard with assigned-client overview + search/filter
- Dietician assigned-client workspace shell with full tab structure
- Assignment-based authorization for dietician access to client data
- `PROFILE_UPDATED` audit logging for profile updates

## What Changed From Phase 3

- `ClientProfile` schema expanded with practical personal/basic/body/medical/other fields
- `AuditAction` expanded with `PROFILE_UPDATED`
- New client and dietician APIs under `/api/client/*` and `/api/dietician/*`
- New profile validation (`Zod`) and service-layer profile update flows
- New client and dietician portal components/pages replacing placeholders
- Sidebar navigation updated for CLIENT and DIETICIAN roles

## Database Updates (Phase 4)

### Updated Enum

- `AuditAction` now includes:
  - `PROFILE_UPDATED`

### Updated `ClientProfile` fields

Added/used profile fields include:

- Personal: `dateOfBirth`, `gender`, `maritalStatus`, `bloodGroup`, `isChildAccount`, `primaryContact`, `alternateContact`, `profession`, `familyMemberOnboarded`
- Basic: `height`, `weight`
- Body: `fatPercentage`, `visceralFat`, `restingMetabolismKcal`, `bodyAge`, `fatMassKg`, `totalSubcutaneousFatPercentage`, `subcutaneousFatTrunkPercentage`, `subcutaneousFatArmsPercentage`, `subcutaneousFatLegsPercentage`, `totalSkeletalMusclePercentage`, `skeletalMuscleTrunkPercentage`, `skeletalMuscleArmsPercentage`, `skeletalMuscleLegsPercentage`, `bmi`, `fatFreeMassKg`, `waistInch`, `hipInch`, `waterContentPercentage`, `boneWeightKg`
- Medical: `primaryGoal`, `otherGoal`, `clientMedicalCondition`, `parentMedicalConditionAndSymptoms`, `otherMedicalConditions`, `clientMedicalSymptoms`
- Other: `activityState`, `intensity`, `coldFrequency`, `bloodPressure`, `systolicBp`, `diastolicBp`, `healthRating`, `fitnessRating`, `remarks`
- Metadata: `profileCompletionPercent`, `createdAt`, `updatedAt`

Most fields remain nullable for gradual profile completion.

## Client Profile Behavior

Routes:

- `/client/dashboard`
- `/client/profile`

APIs:

- `GET /api/client/dashboard`
- `GET /api/client/profile`
- `PATCH /api/client/profile`

Behavior:

- Client can view and update only their own profile
- Profile uses RHF + Zod validation
- Profile completion is recalculated on every update
- `PROFILE_UPDATED` audit log is created on successful updates
- Dashboard shows completion %, assigned dietician, and phase-gated cards

## Dietician Assigned-Client Behavior

Routes:

- `/dietician/dashboard`
- `/dietician/clients`
- `/dietician/clients/[clientId]`

APIs:

- `GET /api/dietician/dashboard`
- `GET /api/dietician/clients`
- `GET /api/dietician/clients/[clientId]`
- `GET /api/dietician/clients/[clientId]/profile`
- `PATCH /api/dietician/clients/[clientId]/profile`

Behavior:

- Dietician sees only actively assigned clients
- Search supports first name, last name, email, phone
- Optional filter for incomplete profiles
- Workspace shows tabs:
  - Profile (functional)
  - Notes (placeholder)
  - Clinical Assessment (placeholder)
  - Questionnaire (placeholder)
  - Diet Recall (placeholder)
  - 24 Hour Diet (placeholder)
  - QC Table (placeholder)
  - Make Diet (placeholder)

## Assignment Authorization Rule

- `assertDieticianCanAccessClient(dieticianUserId, clientUserId)` checks active assignment before dietician can access/update a client profile.
- `assertClientCanAccessOwnData(loggedInUserId, targetClientId)` enforces self-access for client profile ownership checks.
- Dietician client APIs rely on centralized assignment checks in the service layer.

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
npm run db:migrate -- --name phase4_client_dietician_portal
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

Seed includes active assignments for local testing.

## How To Test (Phase 4)

Run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run lint
npm run build
```

Manual checks:

- Client:
  - Login as `client@example.com`
  - Verify redirect to `/client/dashboard`
  - Open `/client/profile`, update fields, verify persistence and completion changes
- Dietician:
  - Login as `dietician@example.com`
  - Verify `/dietician/dashboard` shows assigned clients only
  - Search assigned clients and open `/dietician/clients/[clientId]`
  - Verify only Profile tab is functional and other tabs are placeholders
  - Update assigned client profile and verify update persists
- Authorization:
  - Dietician cannot fetch/update profile of unassigned client via API
  - Client cannot access another client profile via client APIs
- Regression:
  - Admin pages still work
  - Public website and login/role redirects still work

## Intentionally Not Built Yet

- Notes functionality
- Clinical Assessment functionality
- Questionnaire/chat
- Diet Recall
- 24 Hour Diet
- QC Table
- Make Diet / Diet Plan Builder
- File uploads
- Notifications
- Analytics
- Payments

## Next Phase Recommendation (Phase 5)

- Notes tab implementation
- Shared and private notes model
- Dietician note create/read/update flows
- Client visibility rules for shared notes
