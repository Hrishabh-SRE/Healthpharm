import { cn } from "@/lib/utils/cn";

type NoteVisibilityBadgeProps = {
  visibility: "PRIVATE" | "SHARED_WITH_CLIENT";
};

export function NoteVisibilityBadge({ visibility }: NoteVisibilityBadgeProps): React.JSX.Element {
  const isPrivate = visibility === "PRIVATE";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
        isPrivate ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700",
      )}
    >
      {isPrivate ? "Private" : "Shared"}
    </span>
  );
}
