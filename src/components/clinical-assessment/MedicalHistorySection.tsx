import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ClinicalAssessmentSectionProps } from "@/components/clinical-assessment/ClinicalAssessmentSections";

export function MedicalHistorySection({
  values,
  onChange,
  readOnly,
}: ClinicalAssessmentSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-900">Medical History</h3>
      <div className="space-y-1">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea id="allergies" value={values.allergies ?? ""} onChange={(event) => onChange("allergies", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="medicalHistory">Medical history</Label>
        <Textarea id="medicalHistory" value={values.medicalHistory ?? ""} onChange={(event) => onChange("medicalHistory", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="familyHistory">Family history</Label>
        <Textarea id="familyHistory" value={values.familyHistory ?? ""} onChange={(event) => onChange("familyHistory", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="digestiveIssues">Digestive issues</Label>
        <Textarea id="digestiveIssues" value={values.digestiveIssues ?? ""} onChange={(event) => onChange("digestiveIssues", event.target.value)} disabled={readOnly} />
      </div>
    </section>
  );
}
