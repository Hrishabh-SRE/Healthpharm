type ClientProfileSummaryProps = {
  profileCompletionPercent: number;
  assignedDieticianName: string | null;
  updatedAt?: string | null;
};

export function ClientProfileSummary({
  profileCompletionPercent,
  assignedDieticianName,
  updatedAt,
}: ClientProfileSummaryProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Profile Summary</h3>
      <p className="mt-2 text-sm text-slate-600">Profile completion: {profileCompletionPercent}%</p>
      <p className="text-sm text-slate-600">Assigned dietician: {assignedDieticianName ?? "Not assigned yet"}</p>
      <p className="text-xs text-slate-500">{updatedAt ? `Last updated: ${new Date(updatedAt).toLocaleString()}` : ""}</p>
    </div>
  );
}
