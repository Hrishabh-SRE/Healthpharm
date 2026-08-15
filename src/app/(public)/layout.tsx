import type { ReactNode } from "react";

import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";

type PublicLayoutProps = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps): Promise<React.JSX.Element> {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
