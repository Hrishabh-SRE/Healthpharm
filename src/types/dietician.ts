export type DieticianAssignedClient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  profileCompletionPercent: number;
  assignmentStatus: "ACTIVE" | "INACTIVE";
  assignedAt: string;
  updatedAt: string;
};
