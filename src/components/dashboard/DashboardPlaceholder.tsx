import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";

type DashboardPlaceholderProps = {
  title: string;
  description: string;
};

export function DashboardPlaceholder({ title, description }: DashboardPlaceholderProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <StatusBadge label="Phase 1 Placeholder" />
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
      </div>
      <EmptyState
        title="Module Under Construction"
        description="This dashboard foundation is ready. Full feature modules will be delivered in upcoming phases."
      />
    </div>
  );
}
