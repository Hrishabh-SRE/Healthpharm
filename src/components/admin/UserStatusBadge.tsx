import { cn } from "@/lib/utils/cn";
import type { UserStatus } from "@/types/auth";

const styles: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-slate-200 text-slate-700",
  INVITED: "bg-blue-100 text-blue-700",
  SUSPENDED: "bg-rose-100 text-rose-700",
};

type UserStatusBadgeProps = {
  status: UserStatus;
};

export function UserStatusBadge({ status }: UserStatusBadgeProps): React.JSX.Element {
  return <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", styles[status])}>{status}</span>;
}
