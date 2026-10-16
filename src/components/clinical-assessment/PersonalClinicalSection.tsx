import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ClinicalAssessmentSectionProps } from "@/components/clinical-assessment/ClinicalAssessmentSections";

export function PersonalClinicalSection({
  values,
  onChange,
  readOnly,
}: ClinicalAssessmentSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-900">Medical Concerns and Symptoms</h3>
      <div className="space-y-1">
        <Label htmlFor="chiefConcern">Chief concern</Label>
        <Textarea id="chiefConcern" value={values.chiefConcern ?? ""} onChange={(event) => onChange("chiefConcern", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="currentSymptoms">Current symptoms</Label>
        <Textarea id="currentSymptoms" value={values.currentSymptoms ?? ""} onChange={(event) => onChange("currentSymptoms", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="currentMedications">Current medications</Label>
        <Textarea id="currentMedications" value={values.currentMedications ?? ""} onChange={(event) => onChange("currentMedications", event.target.value)} disabled={readOnly} />
      </div>
    </section>
  );
}
