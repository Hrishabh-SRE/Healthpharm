import Link from "next/link";

import { publicNavigation } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { getCurrentUser, getDashboardRouteForRole } from "@/lib/auth/auth";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/utils/routes";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export async function PublicHeader(): Promise<React.JSX.Element> {
  const user = await getCurrentUser();
  const dashboardLink = user ? getDashboardRouteForRole(user.role) : AUTH_ROUTES.LOGIN;
  const dashboardLabel = user ? "Go to Dashboard" : "Login";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href={PUBLIC_ROUTES.HOME} className="text-base font-semibold text-slate-900 sm:text-lg">
            {siteConfig.name}
          </Link>
          <Button asChild size="sm">
            <Link href={dashboardLink}>{dashboardLabel}</Link>
          </Button>
        </div>
        <nav className="mt-3 flex gap-4 overflow-x-auto pb-1 lg:mt-2 lg:justify-center">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-slate-700 hover:text-primary-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
