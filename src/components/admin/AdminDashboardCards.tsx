import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_ROUTES } from "@/lib/utils/routes";
import type { AdminDashboardStats } from "@/types/admin";

type AdminDashboardCardsProps = {
  stats: AdminDashboardStats;
};

export function AdminDashboardCards({ stats }: AdminDashboardCardsProps): React.JSX.Element {
  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Active Clients", value: stats.activeClients },
    { label: "Active Dieticians", value: stats.activeDieticians },
    { label: "New Leads", value: stats.newLeads },
    { label: "Converted Leads", value: stats.convertedLeads },
    { label: "Active Assignments", value: stats.activeAssignments },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle className="text-base">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link className="text-sm font-medium text-primary hover:text-primary-dark" href="/admin/leads">
            Manage Leads
          </Link>
          <Link className="text-sm font-medium text-primary hover:text-primary-dark" href="/admin/users">
            Manage Users
          </Link>
          <Link className="text-sm font-medium text-primary hover:text-primary-dark" href="/admin/assignments">
            Manage Assignments
          </Link>
          <Link className="text-sm font-medium text-primary hover:text-primary-dark" href={DASHBOARD_ROUTES.ADMIN}>
            Refresh Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
