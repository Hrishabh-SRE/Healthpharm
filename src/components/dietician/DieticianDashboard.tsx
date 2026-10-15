"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AssignedClientsTable } from "@/components/dietician/AssignedClientsTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Payload = {
  success: boolean;
  data?: {
    totalAssigned: number;
    activeAssigned: number;
    incompleteProfiles: number;
    pendingQuestionsCount: number;
    pendingClinicalAssessmentsCount: number;
    recentAssignedClients: Array<{ client: { firstName: string; lastName: string; email: string } }>;
  };
  error?: { message: string };
};

export function DieticianDashboard(): React.JSX.Element {
  const [data, setData] = useState<Payload["data"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async (): Promise<void> => {
      const response = await fetch("/api/dietician/dashboard", { cache: "no-store" });
      const payload = (await response.json()) as Payload;
      if (!response.ok || !payload.success || !payload.data) {
        setError(payload.error?.message ?? "Unable to load dashboard.");
        setLoading(false);
        return;
      }
      setData(payload.data);
      setLoading(false);
    };
    void load();
  }, []);

  if (loading) return <LoadingState />;
  if (!data) return <EmptyState title="Unable to load dashboard" description={error} />;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Dietician Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Assigned Clients</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{data.totalAssigned}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Assigned Clients</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{data.activeAssigned}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Incomplete Profiles</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{data.incompleteProfiles}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Client Questions</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{data.pendingQuestionsCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submitted Assessments</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{data.pendingClinicalAssessmentsCount}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recently Assigned Clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.recentAssignedClients.slice(0, 5).map((item, index) => (
            <p key={`${item.client.email}-${index}`} className="text-sm text-slate-700">
              {item.client.firstName} {item.client.lastName} ({item.client.email})
            </p>
          ))}
          <Link href="/dietician/clients" className="text-sm font-semibold text-primary hover:text-primary-dark">
            View assigned clients
          </Link>
        </CardContent>
      </Card>

      <AssignedClientsTable />
    </div>
  );
}
