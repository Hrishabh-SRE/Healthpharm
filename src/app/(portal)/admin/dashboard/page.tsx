import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.ADMIN);

  return (
    <DashboardPlaceholder
      title="Admin Dashboard"
      description="Manage users, clients, dieticians, assignments, and leads. Full admin features will be added in later phases."
    />
  );
}
