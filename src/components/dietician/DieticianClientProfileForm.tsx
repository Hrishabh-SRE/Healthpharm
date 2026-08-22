import { ClientProfileForm } from "@/components/client/ClientProfileForm";

type DieticianClientProfileFormProps = {
  clientId: string;
};

export function DieticianClientProfileForm({ clientId }: DieticianClientProfileFormProps): React.JSX.Element {
  return (
    <ClientProfileForm
      title="Client Profile (Dietician View)"
      fetchUrl={`/api/dietician/clients/${clientId}/profile`}
      patchUrl={`/api/dietician/clients/${clientId}/profile`}
    />
  );
}
