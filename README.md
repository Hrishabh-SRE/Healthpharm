# Healthcare Dietician Portal

Healthcare Dietician Portal is a modular monolithic Next.js application for a healthcare/nutrition company.  
Phase 1 focuses on the public marketing website, login flow, and role-based dashboard foundation.

## Phase 1 Scope

- Public marketing website with route-group based structure
- Public pages: Home, Services, service detail pages, Doctors, Expertise, About, Contact, Book Consultation, Login
- Contact form UI with React Hook Form + Zod validation
- Book Consultation form UI with API submission to a clean lead endpoint
- Mock authentication abstraction in `src/lib/auth`
- Role-based routing and protected placeholder dashboards
- Session-style mock auth using secure HTTP-only cookie + in-memory session store

## Intentionally Not Built Yet

- Real PostgreSQL/Prisma persistence
- Real user management flows
- Admin lead management
- Client profile and complete client workflow
- Notes, clinical assessment, questionnaire chat, diet recall, 24-hour diet review
- QC table and diet plan builder
- File uploads, payments, notifications

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
    public/
    utils/
    validation/
  types/
```

## Tech Stack

- Next.js (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- shadcn-style UI primitives (Button, Input, Card, etc.)
- React Hook Form
- Zod
- ESLint + Prettier
- bcryptjs for password hash comparison

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Open:
   - Public site: `http://localhost:3000`
   - Login: `http://localhost:3000/login`

## Mock Login Credentials

- Admin: `admin@example.com` / `password123`
- Dietician: `dietician@example.com` / `password123`
- Client: `client@example.com` / `password123`

## Auth Behavior in This Phase

- Login submits to `POST /api/auth/login`
- Credentials are validated through centralized auth abstraction in `src/lib/auth/auth.ts`
- A session token is generated and stored in an HTTP-only cookie
- Session data is stored in-memory for now
- Role-based redirect after login:
  - ADMIN -> `/admin/dashboard`
  - DIETICIAN -> `/dietician/dashboard`
  - CLIENT -> `/client/dashboard`

## Next Phases (Planned)

- Replace mock auth/session with DB-backed session authentication (PostgreSQL + Prisma)
- Lead lifecycle management and admin conversion flows
- Client, dietician, and admin functional modules
- Clinical and nutrition workflows with richer domain data models
