import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ClinicalAssessmentSectionProps } from "@/components/clinical-assessment/ClinicalAssessmentSections";

export function DieticianAssessmentSection({ values, onChange, readOnly }: ClinicalAssessmentSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-900">Dietician Professional Assessment</h3>
      <div className="space-y-1"><Label htmlFor="clinicalObservations">Clinical observations</Label><Textarea id="clinicalObservations" value={values.clinicalObservations ?? ""} onChange={(event) => onChange("clinicalObservations", event.target.value)} disabled={readOnly} /></div>
      <div className="space-y-1"><Label htmlFor="assessmentSummary">Assessment summary</Label><Textarea id="assessmentSummary" value={values.assessmentSummary ?? ""} onChange={(event) => onChange("assessmentSummary", event.target.value)} disabled={readOnly} /></div>
      <div className="space-y-1"><Label htmlFor="nutritionDiagnosis">Nutrition diagnosis</Label><Textarea id="nutritionDiagnosis" value={values.nutritionDiagnosis ?? ""} onChange={(event) => onChange("nutritionDiagnosis", event.target.value)} disabled={readOnly} /></div>
      <div className="space-y-1"><Label htmlFor="riskFlags">Risk flags</Label><Textarea id="riskFlags" value={values.riskFlags ?? ""} onChange={(event) => onChange("riskFlags", event.target.value)} disabled={readOnly} /></div>
      <div className="space-y-1"><Label htmlFor="dieticianRecommendations">Dietician recommendations</Label><Textarea id="dieticianRecommendations" value={values.dieticianRecommendations ?? ""} onChange={(event) => onChange("dieticianRecommendations", event.target.value)} disabled={readOnly} /></div>
      <div className="space-y-1"><Label htmlFor="followUpRecommendations">Follow-up recommendations</Label><Textarea id="followUpRecommendations" value={values.followUpRecommendations ?? ""} onChange={(event) => onChange("followUpRecommendations", event.target.value)} disabled={readOnly} /></div>
      <div className="space-y-1"><Label htmlFor="internalRemarks">Internal remarks</Label><Textarea id="internalRemarks" value={values.internalRemarks ?? ""} onChange={(event) => onChange("internalRemarks", event.target.value)} disabled={readOnly} /></div>
    </section>
  );
}
