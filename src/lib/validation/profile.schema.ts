import { z } from "zod";

const nullableText = z.string().trim().optional().transform((value) => (value === "" ? null : value));

const nullableNumber = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const numeric = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  })
  .optional();

const nullableDate = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (value ? new Date(value) : null))
  .optional();

export const clientProfileUpdateSchema = z
  .object({
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    phone: z.string().trim().optional().transform((value) => (value === "" ? null : value)),
    dateOfBirth: nullableDate,
    gender: nullableText,
    maritalStatus: nullableText,
    bloodGroup: nullableText,
    isChildAccount: z.boolean().optional(),
    primaryContact: nullableText,
    alternateContact: nullableText,
    profession: nullableText,
    familyMemberOnboarded: z.boolean().optional(),
    address: nullableText,
    emergencyContactName: nullableText,
    emergencyContactPhone: nullableText,
    occupation: nullableText,
    lifestyle: nullableText,
    primaryGoal: nullableText,
    otherGoal: nullableText,
    height: nullableNumber,
    weight: nullableNumber,
    fatPercentage: nullableNumber,
    visceralFat: nullableNumber,
    restingMetabolismKcal: nullableNumber,
    bodyAge: nullableNumber,
    fatMassKg: nullableNumber,
    totalSubcutaneousFatPercentage: nullableNumber,
    subcutaneousFatTrunkPercentage: nullableNumber,
    subcutaneousFatArmsPercentage: nullableNumber,
    subcutaneousFatLegsPercentage: nullableNumber,
    totalSkeletalMusclePercentage: nullableNumber,
    skeletalMuscleTrunkPercentage: nullableNumber,
    skeletalMuscleArmsPercentage: nullableNumber,
    skeletalMuscleLegsPercentage: nullableNumber,
    bmi: nullableNumber,
    fatFreeMassKg: nullableNumber,
    waistInch: nullableNumber,
    hipInch: nullableNumber,
    waterContentPercentage: nullableNumber,
    boneWeightKg: nullableNumber,
    clientMedicalCondition: nullableText,
    parentMedicalConditionAndSymptoms: nullableText,
    otherMedicalConditions: nullableText,
    clientMedicalSymptoms: nullableText,
    activityState: nullableText,
    intensity: nullableText,
    coldFrequency: nullableText,
    bloodPressure: nullableText,
    systolicBp: nullableNumber,
    diastolicBp: nullableNumber,
    healthRating: nullableText,
    fitnessRating: nullableText,
    remarks: nullableText,
    allergies: nullableText,
    foodPreferences: nullableText,
    foodRestrictions: nullableText,
    medicalConditions: nullableText,
    medications: nullableText,
  })
  .strict();

export const dieticianClientsQuerySchema = z.object({
  q: z.string().trim().optional(),
  incompleteOnly: z
    .union([z.string(), z.boolean(), z.undefined()])
    .transform((value) => value === true || value === "true"),
});
