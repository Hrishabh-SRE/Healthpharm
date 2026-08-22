import { AssignedClientsTable } from "@/components/dietician/AssignedClientsTable";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function DieticianClientsPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.DIETICIAN);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Assigned Clients</h1>
      <p className="text-slate-600">Search and open only clients actively assigned to you.</p>
      <AssignedClientsTable />
    </div>
  );
}
