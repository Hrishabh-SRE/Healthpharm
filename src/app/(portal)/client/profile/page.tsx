import { ClientProfileForm } from "@/components/client/ClientProfileForm";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function ClientProfilePage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.CLIENT);

  return (
    <ClientProfileForm
      title="My Profile"
      fetchUrl="/api/client/profile"
      patchUrl="/api/client/profile"
    />
  );
}
