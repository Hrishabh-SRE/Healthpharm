# Healthcare Dietician Portal

Healthcare Dietician Portal is a phased Next.js application for nutrition workflows across public, client, dietician, and admin experiences.

## Phase 7 Scope

Phase 7 adds the **Clinical Assessment** module:

- Client can create/update their own clinical assessment while status is `DRAFT`
- Client can submit assessment for dietician review
- Dietician can view/update assessment for assigned clients
- Dietician can mark assessment as `REVIEWED`
- Dietician can finalize assessment as `FINALIZED`
- Locked behavior enforced after submission/review/finalization for client edits
- Audit logging for create/update/submit/review/finalize

## What Changed From Phase 6

- Added `ClinicalAssessment` database model and `ClinicalAssessmentStatus` lifecycle.
- Added client and dietician clinical assessment APIs.
- Added shared clinical assessment form sections/components for reuse.
- Made Clinical Assessment functional in client dashboard and dietician workspace.
- Added dashboard indicators for clinical assessment state and pending dietician review.

## ClinicalAssessment Model

Core fields:

- identity: `id`, `clientId`, `version`
- ownership: `createdById`, `updatedById`, `reviewedById`, `finalizedById`
- status: `DRAFT`, `SUBMITTED`, `REVIEWED`, `FINALIZED`
- client-reported medical/lifestyle/vitals/lab fields
- dietician professional fields
- timestamps: `submittedAt`, `reviewedAt`, `finalizedAt`, `createdAt`, `updatedAt`

Indexes:

- unique: `clientId`
- indexes: `status`, `submittedAt`, `reviewedAt`, `finalizedAt`, `updatedAt`

## Clinical Assessment Status Lifecycle

Implemented lifecycle:

- `DRAFT -> SUBMITTED` (client submit endpoint)
- `DRAFT or SUBMITTED -> REVIEWED` (dietician review endpoint)
- `REVIEWED -> FINALIZED` (dietician finalize endpoint)

Invalid transitions are rejected with `INVALID_STATUS_TRANSITION`.

## Client Clinical Assessment Behavior

Routes and APIs:

- page: `/client/clinical-assessment`
- `GET /api/client/clinical-assessment`
- `PATCH /api/client/clinical-assessment`
- `POST /api/client/clinical-assessment/submit`

Behavior:

- Client can edit only own assessment.
- Client can update only self-report fields via client schema.
- Client cannot update status directly in `PATCH`.
- Client cannot update dietician-only fields.
- After `SUBMITTED`, `REVIEWED`, or `FINALIZED`, client edits are blocked.
- Client sees dietician summary/recommendations once reviewed/finalized.

## Dietician Clinical Assessment Behavior

Routes and APIs:

- workspace tab: `/dietician/clients/[clientId]` -> Clinical Assessment tab
- `GET /api/dietician/clients/[clientId]/clinical-assessment`
- `PATCH /api/dietician/clients/[clientId]/clinical-assessment`
- `POST /api/dietician/clients/[clientId]/clinical-assessment/review`
- `POST /api/dietician/clients/[clientId]/clinical-assessment/finalize`

Behavior:

- Access allowed only for actively assigned clients.
- Dietician can create if missing and update both client fields + professional fields.
- Dietician can review and finalize with status transition checks.
- Finalized assessments are read-only for edit in this phase.

## Authorization Rules

- Client access is self-scoped (own assessment only).
- Dietician APIs reuse `assertDieticianCanAccessClient`.
- Backend enforces role and assignment checks.
- Wrong-role access returns guarded auth/forbidden errors.

## Audit Actions Added

- `CLINICAL_ASSESSMENT_CREATED`
- `CLINICAL_ASSESSMENT_UPDATED`
- `CLINICAL_ASSESSMENT_SUBMITTED`
- `CLINICAL_ASSESSMENT_REVIEWED`
- `CLINICAL_ASSESSMENT_FINALIZED`

## Local Setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate -- --name phase7_clinical_assessment_module
npm run db:seed
npm run dev
```

## Seeded Credentials

- `admin@example.com / password123`
- `dietician@example.com / password123`
- `dietician2@example.com / password123`
- `client@example.com / password123`
- `client2@example.com / password123`

## Manual Testing (Phase 7)

Run required checks:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run lint
npm run build
```

Then verify:

- Client can open dashboard and clinical assessment page.
- Client can save draft while `DRAFT`.
- Client can submit for review and becomes locked.
- Client cannot edit after `SUBMITTED/REVIEWED/FINALIZED`.
- Client cannot send dietician-only fields through client API.
- Dietician can view/edit assigned client assessment.
- Dietician can mark reviewed and finalize with valid transition.
- Unassigned dietician access is denied.
- Notes/questionnaire/profile/admin/public flows still work.

## Intentionally Not Built Yet

- Diet Recall
- 24 Hour Diet
- QC Table
- Make Diet / Diet Plan Builder
- File uploads/lab report uploads
- Notifications
- Analytics
- Payments
- Realtime collaboration

## Next Phase Recommendation (Phase 8)

After profile, notes, questionnaire, and clinical assessment, the next recommended phase is **Diet Recall**.
