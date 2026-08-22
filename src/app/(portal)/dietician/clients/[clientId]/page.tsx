import { EmptyState } from "@/components/shared/EmptyState";
import { ClientWorkspace } from "@/components/dietician/ClientWorkspace";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { getAssignedClientDetail } from "@/lib/services/dietician-client.service";

type Params = {
  params: Promise<{ clientId: string }>;
};

export default async function DieticianClientWorkspacePage({ params }: Params): Promise<React.JSX.Element> {
  const dietician = await requireRole(ROLES.DIETICIAN);
  const { clientId } = await params;

  const detail = await getAssignedClientDetail(dietician.id, clientId);
  if (!detail) {
    return <EmptyState title="Access denied" description="This client is not assigned to you." />;
  }

  return <ClientWorkspace clientId={clientId} client={detail.client} assignment={detail.assignment} />;
}
