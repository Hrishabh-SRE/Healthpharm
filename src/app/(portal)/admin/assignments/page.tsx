import { AssignmentsTable } from "@/components/admin/AssignmentsTable";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function AdminAssignmentsPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.ADMIN);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Assignments</h1>
        <p className="mt-2 text-slate-600">Create and deactivate client-dietician assignments with role and status validation.</p>
      </div>
      <AssignmentsTable />
    </div>
  );
}
