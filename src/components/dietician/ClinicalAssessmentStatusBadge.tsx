import { cn } from "@/lib/utils/cn";
import type { ClinicalAssessmentStatus } from "@/types/clinical-assessment";

type ClinicalAssessmentStatusBadgeProps = {
  status: ClinicalAssessmentStatus;
};

const statusClasses: Record<ClinicalAssessmentStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-amber-100 text-amber-700",
  REVIEWED: "bg-blue-100 text-blue-700",
  FINALIZED: "bg-emerald-100 text-emerald-700",
};

export function ClinicalAssessmentStatusBadge({
  status,
}: ClinicalAssessmentStatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
        statusClasses[status],
      )}
    >
      {status}
    </span>
  );
}
