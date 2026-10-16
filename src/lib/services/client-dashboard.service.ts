import { getClientProfileBundle } from "@/lib/services/client-profile.service";
import { getClinicalAssessmentStatusForClient } from "@/lib/services/clinical-assessment.service";
import { getUnreadQuestionnaireCountForClient } from "@/lib/services/questionnaire.service";

export async function getClientDashboardSummary(clientUserId: string) {
  const profile = await getClientProfileBundle(clientUserId);
  if (!profile) {
    return null;
  }

  const [unreadQuestionnaireCount, clinicalAssessmentStatus] = await Promise.all([
    getUnreadQuestionnaireCountForClient(clientUserId),
    getClinicalAssessmentStatusForClient(clientUserId),
  ]);

  return {
    user: profile.user,
    clientProfile: profile.clientProfile,
    assignedDietician: profile.assignedDietician,
    profileCompletionPercent: profile.clientProfile?.profileCompletionPercent ?? 0,
    unreadQuestionnaireCount,
    clinicalAssessmentStatus: clinicalAssessmentStatus?.status ?? null,
  };
}
