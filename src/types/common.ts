export type NavItem = {
  label: string;
  href: string;
};

export type ApiErrorCode =
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "DUPLICATE_EMAIL"
  | "LEAD_ALREADY_CONVERTED"
  | "USER_NOT_CLIENT"
  | "USER_NOT_DIETICIAN"
  | "CLIENT_ALREADY_ASSIGNED"
  | "SERVER_ERROR";
