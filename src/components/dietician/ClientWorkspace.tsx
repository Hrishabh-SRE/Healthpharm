import { ClientWorkspaceHeader } from "@/components/dietician/ClientWorkspaceHeader";
import { DieticianClinicalAssessmentPanel } from "@/components/dietician/DieticianClinicalAssessmentPanel";
import { DieticianNotesPanel } from "@/components/dietician/DieticianNotesPanel";
import { DieticianQuestionnairePanel } from "@/components/dietician/DieticianQuestionnairePanel";
import { ClientWorkspaceTabs } from "@/components/dietician/ClientWorkspaceTabs";
import { DieticianClientProfileForm } from "@/components/dietician/DieticianClientProfileForm";

type ClientWorkspaceProps = {
  clientId: string;
  client: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    clientProfile: {
      gender: string | null;
      dateOfBirth: Date | string | null;
      profileCompletionPercent: number;
    } | null;
  };
  assignment: {
    status: string;
    assignedAt: Date | string;
  };
};

export function ClientWorkspace({ clientId, client, assignment }: ClientWorkspaceProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <ClientWorkspaceHeader client={client} assignment={assignment} />
      <ClientWorkspaceTabs
        profileTab={<DieticianClientProfileForm clientId={clientId} />}
        notesTab={<DieticianNotesPanel clientId={clientId} />}
        clinicalAssessmentTab={<DieticianClinicalAssessmentPanel clientId={clientId} />}
        questionnaireTab={<DieticianQuestionnairePanel clientId={clientId} />}
      />
    </div>
  );
}
