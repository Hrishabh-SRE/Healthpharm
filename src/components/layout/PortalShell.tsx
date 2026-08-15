import type { ReactNode } from "react";

import type { AuthUser } from "@/types/auth";
import { PortalSidebar } from "@/components/layout/PortalSidebar";
import { PortalTopbar } from "@/components/layout/PortalTopbar";

type PortalShellProps = {
  user: AuthUser;
  children: ReactNode;
};

export function PortalShell({ user, children }: PortalShellProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <PortalSidebar user={user} />
        <div className="flex flex-1 flex-col">
          <PortalTopbar user={user} />
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
