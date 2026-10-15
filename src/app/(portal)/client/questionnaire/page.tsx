import { ClientQuestionnaireChat } from "@/components/client/ClientQuestionnaireChat";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function ClientQuestionnairePage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.CLIENT);

  return <ClientQuestionnaireChat />;
}
