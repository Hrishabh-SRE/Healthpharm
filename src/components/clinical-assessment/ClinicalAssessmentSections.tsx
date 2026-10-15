import type { ClinicalAssessmentDieticianUpdateInput } from "@/types/clinical-assessment";

export type ClinicalAssessmentFormValues = ClinicalAssessmentDieticianUpdateInput;

type ClinicalAssessmentSectionProps = {
  values: ClinicalAssessmentFormValues;
  onChange: (field: keyof ClinicalAssessmentFormValues, value: string) => void;
  readOnly: boolean;
};

export type { ClinicalAssessmentSectionProps };
