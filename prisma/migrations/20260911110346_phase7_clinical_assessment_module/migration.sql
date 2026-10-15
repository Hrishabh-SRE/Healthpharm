-- CreateEnum
CREATE TYPE "ClinicalAssessmentStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'REVIEWED', 'FINALIZED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'CLINICAL_ASSESSMENT_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'CLINICAL_ASSESSMENT_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'CLINICAL_ASSESSMENT_SUBMITTED';
ALTER TYPE "AuditAction" ADD VALUE 'CLINICAL_ASSESSMENT_REVIEWED';
ALTER TYPE "AuditAction" ADD VALUE 'CLINICAL_ASSESSMENT_FINALIZED';

-- CreateTable
CREATE TABLE "ClinicalAssessment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdById" TEXT,
    "updatedById" TEXT,
    "reviewedById" TEXT,
    "finalizedById" TEXT,
    "status" "ClinicalAssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "chiefConcern" TEXT,
    "currentSymptoms" TEXT,
    "currentMedications" TEXT,
    "allergies" TEXT,
    "medicalHistory" TEXT,
    "familyHistory" TEXT,
    "digestiveIssues" TEXT,
    "sleepPattern" TEXT,
    "stressLevel" TEXT,
    "activityLevel" TEXT,
    "menstrualHistory" TEXT,
    "pregnancyOrLactation" TEXT,
    "smokingAlcoholHistory" TEXT,
    "foodIntolerances" TEXT,
    "previousDietHistory" TEXT,
    "height" DECIMAL(65,30),
    "weight" DECIMAL(65,30),
    "bmi" DECIMAL(65,30),
    "waistCircumference" DECIMAL(65,30),
    "hipCircumference" DECIMAL(65,30),
    "bloodPressure" TEXT,
    "systolicBp" INTEGER,
    "diastolicBp" INTEGER,
    "restingHeartRate" INTEGER,
    "fastingBloodSugar" DECIMAL(65,30),
    "postMealBloodSugar" DECIMAL(65,30),
    "hba1c" DECIMAL(65,30),
    "totalCholesterol" DECIMAL(65,30),
    "hdl" DECIMAL(65,30),
    "ldl" DECIMAL(65,30),
    "triglycerides" DECIMAL(65,30),
    "thyroidTsh" DECIMAL(65,30),
    "vitaminD" DECIMAL(65,30),
    "vitaminB12" DECIMAL(65,30),
    "hemoglobin" DECIMAL(65,30),
    "creatinine" DECIMAL(65,30),
    "sgpt" DECIMAL(65,30),
    "sgot" DECIMAL(65,30),
    "clinicalObservations" TEXT,
    "assessmentSummary" TEXT,
    "nutritionDiagnosis" TEXT,
    "riskFlags" TEXT,
    "dieticianRecommendations" TEXT,
    "followUpRecommendations" TEXT,
    "internalRemarks" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalAssessment_clientId_key" ON "ClinicalAssessment"("clientId");

-- CreateIndex
CREATE INDEX "ClinicalAssessment_status_idx" ON "ClinicalAssessment"("status");

-- CreateIndex
CREATE INDEX "ClinicalAssessment_submittedAt_idx" ON "ClinicalAssessment"("submittedAt");

-- CreateIndex
CREATE INDEX "ClinicalAssessment_reviewedAt_idx" ON "ClinicalAssessment"("reviewedAt");

-- CreateIndex
CREATE INDEX "ClinicalAssessment_finalizedAt_idx" ON "ClinicalAssessment"("finalizedAt");

-- CreateIndex
CREATE INDEX "ClinicalAssessment_updatedAt_idx" ON "ClinicalAssessment"("updatedAt");

-- AddForeignKey
ALTER TABLE "ClinicalAssessment" ADD CONSTRAINT "ClinicalAssessment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalAssessment" ADD CONSTRAINT "ClinicalAssessment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalAssessment" ADD CONSTRAINT "ClinicalAssessment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalAssessment" ADD CONSTRAINT "ClinicalAssessment_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalAssessment" ADD CONSTRAINT "ClinicalAssessment_finalizedById_fkey" FOREIGN KEY ("finalizedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
