import { DashboardPlaceholder } from "@/components/dashboard/DashboardPlaceholder";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function ClientDashboardPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.CLIENT);

  return (
    <DashboardPlaceholder
      title="Client Dashboard"
      description="View your profile, notes, diet recalls, questionnaire, QC table, and diet plans. Full client tools will be added in later phases."
    />
  );
}
