import type { UserRole } from "@/types/auth";
import { ROLES } from "@/lib/auth/roles";

export const PUBLIC_ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  DOCTORS: "/doctors",
  EXPERTISE: "/expertise",
  ABOUT: "/about",
  CONTACT: "/contact",
  BOOK_CONSULTATION: "/book-consultation",
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/login",
  LOGOUT_API: "/api/auth/logout",
} as const;

export const DASHBOARD_ROUTES = {
  ADMIN: "/admin/dashboard",
  DIETICIAN: "/dietician/dashboard",
  CLIENT: "/client/dashboard",
} as const;

export const ADMIN_ROUTES = {
  LEADS: "/admin/leads",
  USERS: "/admin/users",
  ASSIGNMENTS: "/admin/assignments",
} as const;

export const CLIENT_ROUTES = {
  DASHBOARD: "/client/dashboard",
  PROFILE: "/client/profile",
  NOTES: "/client/notes",
  QUESTIONNAIRE: "/client/questionnaire",
  CLINICAL_ASSESSMENT: "/client/clinical-assessment",
} as const;

export const DIETICIAN_ROUTES = {
  DASHBOARD: "/dietician/dashboard",
  CLIENTS: "/dietician/clients",
} as const;

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  [ROLES.ADMIN]: DASHBOARD_ROUTES.ADMIN,
  [ROLES.DIETICIAN]: DASHBOARD_ROUTES.DIETICIAN,
  [ROLES.CLIENT]: DASHBOARD_ROUTES.CLIENT,
};
