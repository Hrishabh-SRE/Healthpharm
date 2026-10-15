import { cn } from "@/lib/utils/cn";

type NoteType = "GENERAL" | "FOLLOW_UP" | "CLINICAL" | "INTERNAL";

type NoteTypeBadgeProps = {
  noteType: NoteType;
};

const noteTypeLabelMap: Record<NoteType, string> = {
  GENERAL: "General",
  FOLLOW_UP: "Follow-up",
  CLINICAL: "Clinical",
  INTERNAL: "Internal",
};

const noteTypeClassMap: Record<NoteType, string> = {
  GENERAL: "bg-primary-light text-primary-dark",
  FOLLOW_UP: "bg-amber-100 text-amber-700",
  CLINICAL: "bg-blue-100 text-blue-700",
  INTERNAL: "bg-slate-200 text-slate-700",
};

export function NoteTypeBadge({ noteType }: NoteTypeBadgeProps): React.JSX.Element {
  return <span className={cn("inline-flex rounded-full px-2 py-1 text-xs font-medium", noteTypeClassMap[noteType])}>{noteTypeLabelMap[noteType]}</span>;
}
