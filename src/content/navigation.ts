import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/utils/routes";
import type { NavItem } from "@/types/common";

export const publicNavigation: NavItem[] = [
  { label: "Services", href: PUBLIC_ROUTES.SERVICES },
  { label: "Doctors", href: PUBLIC_ROUTES.DOCTORS },
  { label: "Expertise", href: PUBLIC_ROUTES.EXPERTISE },
  { label: "About", href: PUBLIC_ROUTES.ABOUT },
  { label: "Contact", href: PUBLIC_ROUTES.CONTACT },
  { label: "Book Consultation", href: PUBLIC_ROUTES.BOOK_CONSULTATION },
];

export const loginNavItem: NavItem = {
  label: "Login",
  href: AUTH_ROUTES.LOGIN,
};
