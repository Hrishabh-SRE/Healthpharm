import { ClientClinicalAssessmentForm } from "@/components/client/ClientClinicalAssessmentForm";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function ClientClinicalAssessmentPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.CLIENT);

  return <ClientClinicalAssessmentForm />;
}
