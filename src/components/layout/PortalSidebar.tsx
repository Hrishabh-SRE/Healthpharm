import Link from "next/link";

import type { AuthUser } from "@/types/auth";
import { getDashboardRouteForRole } from "@/lib/auth/auth";

type PortalSidebarProps = {
  user: AuthUser;
};

export function PortalSidebar({ user }: PortalSidebarProps): React.JSX.Element {
  const dashboardHref = getDashboardRouteForRole(user.role);

  return (
    <aside className="hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Portal</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{user.role}</p>
      <nav className="mt-6 space-y-2">
        <Link href={dashboardHref} className="block rounded-md bg-primary-light px-3 py-2 text-sm font-medium text-primary-dark">
          Dashboard
        </Link>
      </nav>
    </aside>
  );
}
