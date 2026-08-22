import { LeadsTable } from "@/components/admin/LeadsTable";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function AdminLeadsPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.ADMIN);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Leads</h1>
        <p className="mt-2 text-slate-600">Review enquiries, update lead status, and convert qualified leads to clients.</p>
      </div>
      <LeadsTable />
    </div>
  );
}
