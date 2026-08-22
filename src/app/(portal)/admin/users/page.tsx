import { UsersTable } from "@/components/admin/UsersTable";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function AdminUsersPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.ADMIN);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
        <p className="mt-2 text-slate-600">Create and manage admin, dietician, and client users for portal access.</p>
      </div>
      <UsersTable />
    </div>
  );
}
