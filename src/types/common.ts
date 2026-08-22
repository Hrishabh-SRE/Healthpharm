export type NavItem = {
  label: string;
  href: string;
};

export type ApiErrorCode =
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR";
