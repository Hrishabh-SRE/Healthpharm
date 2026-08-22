import { ClientDashboard } from "@/components/client/ClientDashboard";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function ClientDashboardPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.CLIENT);

  return <ClientDashboard />;
}
