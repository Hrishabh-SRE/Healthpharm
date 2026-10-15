import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ClinicalAssessmentSectionProps } from "@/components/clinical-assessment/ClinicalAssessmentSections";

export function VitalsAndMetricsSection({
  values,
  onChange,
  readOnly,
}: ClinicalAssessmentSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-900">Vitals and Measurements</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1"><Label htmlFor="height">Height</Label><Input id="height" value={String(values.height ?? "")} onChange={(event) => onChange("height", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="weight">Weight</Label><Input id="weight" value={String(values.weight ?? "")} onChange={(event) => onChange("weight", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="bmi">BMI</Label><Input id="bmi" value={String(values.bmi ?? "")} onChange={(event) => onChange("bmi", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="waistCircumference">Waist circumference</Label><Input id="waistCircumference" value={String(values.waistCircumference ?? "")} onChange={(event) => onChange("waistCircumference", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="hipCircumference">Hip circumference</Label><Input id="hipCircumference" value={String(values.hipCircumference ?? "")} onChange={(event) => onChange("hipCircumference", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="bloodPressure">Blood pressure</Label><Input id="bloodPressure" value={values.bloodPressure ?? ""} onChange={(event) => onChange("bloodPressure", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="systolicBp">Systolic BP</Label><Input id="systolicBp" value={String(values.systolicBp ?? "")} onChange={(event) => onChange("systolicBp", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="diastolicBp">Diastolic BP</Label><Input id="diastolicBp" value={String(values.diastolicBp ?? "")} onChange={(event) => onChange("diastolicBp", event.target.value)} disabled={readOnly} /></div>
        <div className="space-y-1"><Label htmlFor="restingHeartRate">Resting heart rate</Label><Input id="restingHeartRate" value={String(values.restingHeartRate ?? "")} onChange={(event) => onChange("restingHeartRate", event.target.value)} disabled={readOnly} /></div>
      </div>
    </section>
  );
}
