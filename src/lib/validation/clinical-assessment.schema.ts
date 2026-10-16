import { z } from "zod";

function optionalText(max: number) {
  return z
    .union([z.string(), z.null(), z.undefined()])
    .transform((value) => {
      if (value === null || value === undefined) return undefined;
      const trimmed = value.trim();
      return trimmed.length === 0 ? null : trimmed;
    })
    .refine((value) => value === undefined || value === null || value.length <= max, {
      message: `Text must be at most ${max} characters.`,
    });
}

const nullableNumber = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "string") {
    return Number(value);
  }
  return value;
}, z.number().finite().nullable().optional());

const nullableInt = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "string") {
    return Number(value);
  }
  return value;
}, z.number().int().finite().nullable().optional());

const clientFields = {
  chiefConcern: optionalText(5000),
  currentSymptoms: optionalText(5000),
  currentMedications: optionalText(5000),
  allergies: optionalText(5000),
  medicalHistory: optionalText(5000),
  familyHistory: optionalText(5000),
  digestiveIssues: optionalText(5000),
  sleepPattern: optionalText(255),
  stressLevel: optionalText(255),
  activityLevel: optionalText(255),
  menstrualHistory: optionalText(5000),
  pregnancyOrLactation: optionalText(5000),
  smokingAlcoholHistory: optionalText(5000),
  foodIntolerances: optionalText(5000),
  previousDietHistory: optionalText(5000),
  height: nullableNumber,
  weight: nullableNumber,
  bmi: nullableNumber,
  waistCircumference: nullableNumber,
  hipCircumference: nullableNumber,
  bloodPressure: optionalText(255),
  systolicBp: nullableInt,
  diastolicBp: nullableInt,
  restingHeartRate: nullableInt,
  fastingBloodSugar: nullableNumber,
  postMealBloodSugar: nullableNumber,
  hba1c: nullableNumber,
  totalCholesterol: nullableNumber,
  hdl: nullableNumber,
  ldl: nullableNumber,
  triglycerides: nullableNumber,
  thyroidTsh: nullableNumber,
  vitaminD: nullableNumber,
  vitaminB12: nullableNumber,
  hemoglobin: nullableNumber,
  creatinine: nullableNumber,
  sgpt: nullableNumber,
  sgot: nullableNumber,
};

const dieticianFields = {
  clinicalObservations: optionalText(5000),
  assessmentSummary: optionalText(5000),
  nutritionDiagnosis: optionalText(5000),
  riskFlags: optionalText(5000),
  dieticianRecommendations: optionalText(5000),
  followUpRecommendations: optionalText(5000),
  internalRemarks: optionalText(5000),
};

export const clientClinicalAssessmentUpdateSchema = z.object(clientFields).strict().partial();

export const dieticianClinicalAssessmentUpdateSchema = z
  .object({
    ...clientFields,
    ...dieticianFields,
  })
  .strict()
  .partial();
