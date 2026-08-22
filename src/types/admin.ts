import type { LeadStatus } from "@/types/lead";
import type { UserRole, UserStatus } from "@/types/auth";

export type AdminDashboardStats = {
  totalUsers: number;
  activeClients: number;
  activeDieticians: number;
  newLeads: number;
  convertedLeads: number;
  activeAssignments: number;
};

export type AdminLeadListItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  interestedService: string;
  healthGoal: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string | null;
  status: LeadStatus;
  convertedClientId: string | null;
  createdAt: string;
};

export type AdminUserFilter = {
  q?: string;
  role?: UserRole | "ALL";
  status?: UserStatus | "ALL";
};
