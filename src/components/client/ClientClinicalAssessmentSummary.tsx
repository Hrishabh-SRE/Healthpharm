import { ClinicalAssessmentStatusBadge } from "@/components/dietician/ClinicalAssessmentStatusBadge";
import type { ClinicalAssessmentStatus } from "@/types/clinical-assessment";

type ClientClinicalAssessmentSummaryProps = {
  status: ClinicalAssessmentStatus;
  updatedAt: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  finalizedAt: string | null;
};

export function ClientClinicalAssessmentSummary({
  status,
  updatedAt,
  submittedAt,
  reviewedAt,
  finalizedAt,
}: ClientClinicalAssessmentSummaryProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Clinical Assessment</h2>
        <ClinicalAssessmentStatusBadge status={status} />
      </div>
      <p className="mt-2 text-sm text-slate-600">Last updated: {new Date(updatedAt).toLocaleString()}</p>
      {submittedAt ? <p className="text-sm text-slate-600">Submitted: {new Date(submittedAt).toLocaleString()}</p> : null}
      {reviewedAt ? <p className="text-sm text-slate-600">Reviewed: {new Date(reviewedAt).toLocaleString()}</p> : null}
      {finalizedAt ? <p className="text-sm text-slate-600">Finalized: {new Date(finalizedAt).toLocaleString()}</p> : null}
    </div>
  );
}
