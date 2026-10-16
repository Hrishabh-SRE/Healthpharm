import type { AuthUser } from "@/types/auth";

export type ClientDashboardSummary = {
  user: AuthUser;
  profileCompletionPercent: number;
  unreadQuestionnaireCount: number;
  clinicalAssessmentStatus: "DRAFT" | "SUBMITTED" | "REVIEWED" | "FINALIZED" | null;
  assignedDietician: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};
