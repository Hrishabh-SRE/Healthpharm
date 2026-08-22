import Link from "next/link";

import type { AuthUser } from "@/types/auth";
import { getDashboardRouteForRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

type PortalSidebarProps = {
  user: AuthUser;
};

export function PortalSidebar({ user }: PortalSidebarProps): React.JSX.Element {
  const dashboardHref = getDashboardRouteForRole(user.role);
  const adminLinks =
    user.role === ROLES.ADMIN
      ? [
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Leads", href: "/admin/leads" },
          { label: "Users", href: "/admin/users" },
          { label: "Assignments", href: "/admin/assignments" },
        ]
      : [{ label: "Dashboard", href: dashboardHref }];

  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Portal</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{user.role}</p>
      <nav className="mt-6 space-y-2">
        {adminLinks.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-md bg-primary-light px-3 py-2 text-sm font-medium text-primary-dark">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
