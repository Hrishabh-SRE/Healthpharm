-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'USER_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'USER_DEACTIVATED';
ALTER TYPE "AuditAction" ADD VALUE 'LEAD_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'LEAD_CONVERTED_TO_CLIENT';
ALTER TYPE "AuditAction" ADD VALUE 'CLIENT_PROFILE_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'DIETICIAN_PROFILE_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'CLIENT_ASSIGNED';
ALTER TYPE "AuditAction" ADD VALUE 'CLIENT_UNASSIGNED';

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "address" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "occupation" TEXT,
    "lifestyle" TEXT,
    "primaryGoal" TEXT,
    "height" DECIMAL(65,30),
    "weight" DECIMAL(65,30),
    "allergies" TEXT,
    "foodPreferences" TEXT,
    "foodRestrictions" TEXT,
    "medicalConditions" TEXT,
    "medications" TEXT,
    "profileCompletionPercent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DieticianProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "qualification" TEXT,
    "specialization" TEXT,
    "licenseNumber" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DieticianProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientDieticianAssignment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "dieticianId" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientDieticianAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_userId_key" ON "ClientProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DieticianProfile_userId_key" ON "DieticianProfile"("userId");

-- CreateIndex
CREATE INDEX "ClientDieticianAssignment_clientId_idx" ON "ClientDieticianAssignment"("clientId");

-- CreateIndex
CREATE INDEX "ClientDieticianAssignment_dieticianId_idx" ON "ClientDieticianAssignment"("dieticianId");

-- CreateIndex
CREATE INDEX "ClientDieticianAssignment_status_idx" ON "ClientDieticianAssignment"("status");

-- CreateIndex
CREATE INDEX "ClientDieticianAssignment_assignedAt_idx" ON "ClientDieticianAssignment"("assignedAt");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_convertedClientId_fkey" FOREIGN KEY ("convertedClientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DieticianProfile" ADD CONSTRAINT "DieticianProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDieticianAssignment" ADD CONSTRAINT "ClientDieticianAssignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDieticianAssignment" ADD CONSTRAINT "ClientDieticianAssignment_dieticianId_fkey" FOREIGN KEY ("dieticianId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
