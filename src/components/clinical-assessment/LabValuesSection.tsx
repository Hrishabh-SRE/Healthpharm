import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ClinicalAssessmentSectionProps } from "@/components/clinical-assessment/ClinicalAssessmentSections";

export function LabValuesSection({ values, onChange, readOnly }: ClinicalAssessmentSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-900">Lab Values</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1"><Label htmlFor="fastingBloodSugar">Fasting blood sugar</Label><Input id="fastingBloodSugar" value={String(values.fastingBloodSugar ?? "")} onChange={(event) => onChange("fastingBloodSugar", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="postMealBloodSugar">Post meal blood sugar</Label><Input id="postMealBloodSugar" value={String(values.postMealBloodSugar ?? "")} onChange={(event) => onChange("postMealBloodSugar", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="hba1c">HbA1c</Label><Input id="hba1c" value={String(values.hba1c ?? "")} onChange={(event) => onChange("hba1c", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="totalCholesterol">Total cholesterol</Label><Input id="totalCholesterol" value={String(values.totalCholesterol ?? "")} onChange={(event) => onChange("totalCholesterol", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="hdl">HDL</Label><Input id="hdl" value={String(values.hdl ?? "")} onChange={(event) => onChange("hdl", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="ldl">LDL</Label><Input id="ldl" value={String(values.ldl ?? "")} onChange={(event) => onChange("ldl", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="triglycerides">Triglycerides</Label><Input id="triglycerides" value={String(values.triglycerides ?? "")} onChange={(event) => onChange("triglycerides", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="thyroidTsh">Thyroid TSH</Label><Input id="thyroidTsh" value={String(values.thyroidTsh ?? "")} onChange={(event) => onChange("thyroidTsh", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="vitaminD">Vitamin D</Label><Input id="vitaminD" value={String(values.vitaminD ?? "")} onChange={(event) => onChange("vitaminD", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="vitaminB12">Vitamin B12</Label><Input id="vitaminB12" value={String(values.vitaminB12 ?? "")} onChange={(event) => onChange("vitaminB12", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="hemoglobin">Hemoglobin</Label><Input id="hemoglobin" value={String(values.hemoglobin ?? "")} onChange={(event) => onChange("hemoglobin", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="creatinine">Creatinine</Label><Input id="creatinine" value={String(values.creatinine ?? "")} onChange={(event) => onChange("creatinine", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="sgpt">SGPT</Label><Input id="sgpt" value={String(values.sgpt ?? "")} onChange={(event) => onChange("sgpt", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="sgot">SGOT</Label><Input id="sgot" value={String(values.sgot ?? "")} onChange={(event) => onChange("sgot", event.target.value)} disabled={readOnly} /></div>
      </div>
    </section>
  );
}
