import { DieticianDashboard } from "@/components/dietician/DieticianDashboard";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function DieticianDashboardPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.DIETICIAN);

  return <DieticianDashboard />;
}
