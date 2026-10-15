import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ClinicalAssessmentSectionProps } from "@/components/clinical-assessment/ClinicalAssessmentSections";

export function LifestyleClinicalSection({
  values,
  onChange,
  readOnly,
}: ClinicalAssessmentSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-base font-semibold text-slate-900">Lifestyle and Sleep</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="sleepPattern">Sleep pattern</Label>
          <Textarea id="sleepPattern" value={values.sleepPattern ?? ""} onChange={(event) => onChange("sleepPattern", event.target.value)} disabled={readOnly} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="stressLevel">Stress level</Label>
          <Textarea id="stressLevel" value={values.stressLevel ?? ""} onChange={(event) => onChange("stressLevel", event.target.value)} disabled={readOnly} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="activityLevel">Activity level</Label>
        <Textarea id="activityLevel" value={values.activityLevel ?? ""} onChange={(event) => onChange("activityLevel", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="menstrualHistory">Menstrual history</Label>
        <Textarea id="menstrualHistory" value={values.menstrualHistory ?? ""} onChange={(event) => onChange("menstrualHistory", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="pregnancyOrLactation">Pregnancy or lactation</Label>
        <Textarea id="pregnancyOrLactation" value={values.pregnancyOrLactation ?? ""} onChange={(event) => onChange("pregnancyOrLactation", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="smokingAlcoholHistory">Smoking / alcohol history</Label>
        <Textarea id="smokingAlcoholHistory" value={values.smokingAlcoholHistory ?? ""} onChange={(event) => onChange("smokingAlcoholHistory", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="foodIntolerances">Food intolerances</Label>
        <Textarea id="foodIntolerances" value={values.foodIntolerances ?? ""} onChange={(event) => onChange("foodIntolerances", event.target.value)} disabled={readOnly} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="previousDietHistory">Previous diet history</Label>
        <Textarea id="previousDietHistory" value={values.previousDietHistory ?? ""} onChange={(event) => onChange("previousDietHistory", event.target.value)} disabled={readOnly} />
      </div>
    </section>
  );
}
