import type { ReactNode } from "react";

import { PortalShell } from "@/components/layout/PortalShell";
import { requireAuth } from "@/lib/auth/auth";

type PortalLayoutProps = {
  children: ReactNode;
};

export default async function PortalLayout({ children }: PortalLayoutProps): Promise<React.JSX.Element> {
  const user = await requireAuth();
  return <PortalShell user={user}>{children}</PortalShell>;
}
