import Link from "next/link";
import { LeadStatus } from "@prisma/client";

import { AdminDashboardCards } from "@/components/admin/AdminDashboardCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { getActiveAssignmentsCount } from "@/lib/services/assignment.service";
import { listRecentAuditLogs } from "@/lib/services/audit-log.service";
import { getLeadCountByStatus, listAdminLeads } from "@/lib/services/lead.service";
import { getActiveClientsCount, getActiveDieticiansCount, getTotalUsersCount } from "@/lib/services/user.service";

export default async function AdminDashboardPage(): Promise<React.JSX.Element> {
  await requireRole(ROLES.ADMIN);

  const [totalUsers, activeClients, activeDieticians, newLeads, convertedLeads, activeAssignments, recentLeads, recentAuditLogs] =
    await Promise.all([
      getTotalUsersCount(),
      getActiveClientsCount(),
      getActiveDieticiansCount(),
      getLeadCountByStatus(LeadStatus.NEW),
      getLeadCountByStatus(LeadStatus.CONVERTED),
      getActiveAssignmentsCount(),
      listAdminLeads({ status: "ALL" }),
      listRecentAuditLogs(8),
    ]);

  const stats = {
    totalUsers,
    activeClients,
    activeDieticians,
    newLeads,
    convertedLeads,
    activeAssignments,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">Operational overview for leads, users, and assignments.</p>
      </div>

      <AdminDashboardCards stats={stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="rounded-md border border-slate-200 p-3">
                <p className="font-semibold text-slate-900">{lead.fullName}</p>
                <p className="text-xs text-slate-600">
                  {lead.email} - {lead.status}
                </p>
              </div>
            ))}
            <Link href="/admin/leads" className="text-sm font-medium text-primary hover:text-primary-dark">
              View all leads
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Audit Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="rounded-md border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                <p className="text-xs text-slate-600">
                  {log.entityType} - {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
