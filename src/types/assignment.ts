export type AssignmentStatus = "ACTIVE" | "INACTIVE";

export type AssignmentListItem = {
  id: string;
  clientId: string;
  dieticianId: string;
  clientName: string;
  clientEmail: string;
  dieticianName: string;
  dieticianEmail: string;
  status: AssignmentStatus;
  assignedAt: string;
  unassignedAt: string | null;
};
