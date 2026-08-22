import { cn } from "@/lib/utils/cn";
import type { LeadStatus } from "@/types/lead";

const styles: Record<LeadStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  CONVERTED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-200 text-slate-700",
};

type LeadStatusBadgeProps = {
  status: LeadStatus;
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps): React.JSX.Element {
  return <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", styles[status])}>{status}</span>;
}
