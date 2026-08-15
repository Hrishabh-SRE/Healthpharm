import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function DieticianDashboardPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.DIETICIAN);

  return (
    <DashboardPlaceholder
      title="Dietician Dashboard"
      description="Search assigned clients, review client information, answer questions, and create diet plans. Full dietician tools will be added in later phases."
    />
  );
}
