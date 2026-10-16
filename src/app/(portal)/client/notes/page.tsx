import { ClientNotesView } from "@/components/client/ClientNotesView";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function ClientNotesPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.CLIENT);

  return <ClientNotesView />;
}
