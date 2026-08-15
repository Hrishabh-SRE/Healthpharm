import { cn } from "@/lib/utils/cn";

type StatusBadgeProps = {
  label: string;
  variant?: "default" | "success";
};

export function StatusBadge({ label, variant = "default" }: StatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        variant === "success" ? "bg-emerald-100 text-emerald-700" : "bg-primary-light text-primary-dark",
      )}
    >
      {label}
    </span>
  );
}
