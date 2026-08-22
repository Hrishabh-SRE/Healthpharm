import type { AuthUser } from "@/types/auth";

export type ClientDashboardSummary = {
  user: AuthUser;
  profileCompletionPercent: number;
  assignedDietician: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};
