import { UnreadBadge } from "@/components/questionnaire/UnreadBadge";

type ClientQuestionnaireSummaryProps = {
  assignedDieticianName: string;
  unreadCount: number;
};

export function ClientQuestionnaireSummary({
  assignedDieticianName,
  unreadCount,
}: ClientQuestionnaireSummaryProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">Questionnaire / Doubts</h2>
      <p className="mt-1 text-sm text-slate-600">Assigned dietician: {assignedDieticianName}</p>
      <div className="mt-2">
        <UnreadBadge count={unreadCount} />
      </div>
    </div>
  );
}
