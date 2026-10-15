"use client";

import { useEffect, useState } from "react";

import {
  type ClinicalAssessmentFormValues,
} from "@/components/clinical-assessment/ClinicalAssessmentSections";
import { DieticianAssessmentSection } from "@/components/clinical-assessment/DieticianAssessmentSection";
import { LabValuesSection } from "@/components/clinical-assessment/LabValuesSection";
import { LifestyleClinicalSection } from "@/components/clinical-assessment/LifestyleClinicalSection";
import { MedicalHistorySection } from "@/components/clinical-assessment/MedicalHistorySection";
import { PersonalClinicalSection } from "@/components/clinical-assessment/PersonalClinicalSection";
import { VitalsAndMetricsSection } from "@/components/clinical-assessment/VitalsAndMetricsSection";
import { Button } from "@/components/ui/button";
import type {
  ClinicalAssessment,
  ClinicalAssessmentDieticianUpdateInput,
} from "@/types/clinical-assessment";

type ClinicalAssessmentFormProps = {
  assessment: ClinicalAssessment | null;
  readOnly: boolean;
  showDieticianSection: boolean;
  onSave?: (values: ClinicalAssessmentDieticianUpdateInput) => Promise<void>;
  saveLabel?: string;
  actionsSlot?: React.JSX.Element;
};

function toValue(input: string | number | null | undefined): string {
  return input === null || input === undefined ? "" : String(input);
}

function buildInitialValues(assessment: ClinicalAssessment | null): ClinicalAssessmentFormValues {
  return {
    chiefConcern: assessment?.chiefConcern ?? "",
    currentSymptoms: assessment?.currentSymptoms ?? "",
    currentMedications: assessment?.currentMedications ?? "",
    allergies: assessment?.allergies ?? "",
    medicalHistory: assessment?.medicalHistory ?? "",
    familyHistory: assessment?.familyHistory ?? "",
    digestiveIssues: assessment?.digestiveIssues ?? "",
    sleepPattern: assessment?.sleepPattern ?? "",
    stressLevel: assessment?.stressLevel ?? "",
    activityLevel: assessment?.activityLevel ?? "",
    menstrualHistory: assessment?.menstrualHistory ?? "",
    pregnancyOrLactation: assessment?.pregnancyOrLactation ?? "",
    smokingAlcoholHistory: assessment?.smokingAlcoholHistory ?? "",
    foodIntolerances: assessment?.foodIntolerances ?? "",
    previousDietHistory: assessment?.previousDietHistory ?? "",
    height: toValue(assessment?.height),
    weight: toValue(assessment?.weight),
    bmi: toValue(assessment?.bmi),
    waistCircumference: toValue(assessment?.waistCircumference),
    hipCircumference: toValue(assessment?.hipCircumference),
    bloodPressure: assessment?.bloodPressure ?? "",
    systolicBp: toValue(assessment?.systolicBp),
    diastolicBp: toValue(assessment?.diastolicBp),
    restingHeartRate: toValue(assessment?.restingHeartRate),
    fastingBloodSugar: toValue(assessment?.fastingBloodSugar),
    postMealBloodSugar: toValue(assessment?.postMealBloodSugar),
    hba1c: toValue(assessment?.hba1c),
    totalCholesterol: toValue(assessment?.totalCholesterol),
    hdl: toValue(assessment?.hdl),
    ldl: toValue(assessment?.ldl),
    triglycerides: toValue(assessment?.triglycerides),
    thyroidTsh: toValue(assessment?.thyroidTsh),
    vitaminD: toValue(assessment?.vitaminD),
    vitaminB12: toValue(assessment?.vitaminB12),
    hemoglobin: toValue(assessment?.hemoglobin),
    creatinine: toValue(assessment?.creatinine),
    sgpt: toValue(assessment?.sgpt),
    sgot: toValue(assessment?.sgot),
    clinicalObservations: assessment?.clinicalObservations ?? "",
    assessmentSummary: assessment?.assessmentSummary ?? "",
    nutritionDiagnosis: assessment?.nutritionDiagnosis ?? "",
    riskFlags: assessment?.riskFlags ?? "",
    dieticianRecommendations: assessment?.dieticianRecommendations ?? "",
    followUpRecommendations: assessment?.followUpRecommendations ?? "",
    internalRemarks: assessment?.internalRemarks ?? "",
  };
}

export function ClinicalAssessmentForm({
  assessment,
  readOnly,
  showDieticianSection,
  onSave,
  saveLabel = "Save",
  actionsSlot,
}: ClinicalAssessmentFormProps): React.JSX.Element {
  const [values, setValues] = useState<ClinicalAssessmentFormValues>(() => buildInitialValues(assessment));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(buildInitialValues(assessment));
  }, [assessment]);

  const onChange = (field: keyof ClinicalAssessmentFormValues, value: string) => {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    try {
      setSaving(true);
      await onSave(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <PersonalClinicalSection values={values} onChange={onChange} readOnly={readOnly} />
      <MedicalHistorySection values={values} onChange={onChange} readOnly={readOnly} />
      <LifestyleClinicalSection values={values} onChange={onChange} readOnly={readOnly} />
      <VitalsAndMetricsSection values={values} onChange={onChange} readOnly={readOnly} />
      <LabValuesSection values={values} onChange={onChange} readOnly={readOnly} />
      {showDieticianSection ? (
        <DieticianAssessmentSection values={values} onChange={onChange} readOnly={readOnly} />
      ) : null}

      {!readOnly && onSave ? (
        <Button type="button" onClick={() => void handleSave()} disabled={saving}>
          {saving ? "Saving..." : saveLabel}
        </Button>
      ) : null}

      {actionsSlot}
    </div>
  );
}
