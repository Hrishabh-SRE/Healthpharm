type ClientWorkspaceHeaderProps = {
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    clientProfile: {
      gender: string | null;
      dateOfBirth: Date | string | null;
      profileCompletionPercent: number;
    } | null;
  };
  assignment: {
    status: string;
    assignedAt: Date | string;
  };
};

export function ClientWorkspaceHeader({ client, assignment }: ClientWorkspaceHeaderProps): React.JSX.Element {
  const age = client.clientProfile?.dateOfBirth
    ? Math.floor((Date.now() - new Date(client.clientProfile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h1 className="text-2xl font-bold text-slate-900">
        {client.firstName} {client.lastName}
      </h1>
      <p className="text-sm text-slate-600">{client.email}</p>
      <p className="text-sm text-slate-600">{client.phone ?? "-"}</p>
      <p className="text-sm text-slate-600">
        Gender: {client.clientProfile?.gender ?? "-"} | Age: {age ?? "-"}
      </p>
      <p className="text-sm text-slate-600">
        Profile completion: {client.clientProfile?.profileCompletionPercent ?? 0}% | Assignment: {assignment.status}
      </p>
      <p className="text-xs text-slate-500">Assigned at: {new Date(assignment.assignedAt).toLocaleString()}</p>
    </div>
  );
}
