export type DieticianAssignedClient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  profileCompletionPercent: number;
  assignmentStatus: "ACTIVE" | "INACTIVE";
  unreadQuestionnaireCount: number;
  clinicalAssessmentStatus: "DRAFT" | "SUBMITTED" | "REVIEWED" | "FINALIZED" | null;
  assignedAt: string;
  updatedAt: string;
};
