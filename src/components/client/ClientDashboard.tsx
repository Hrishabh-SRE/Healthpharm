"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLIENT_ROUTES } from "@/lib/utils/routes";

type DashboardPayload = {
  success: boolean;
  data?: {
    user: { firstName: string; lastName: string };
    profileCompletionPercent: number;
    assignedDietician?: { firstName: string; lastName: string } | null;
    unreadQuestionnaireCount: number;
    clinicalAssessmentStatus: "DRAFT" | "SUBMITTED" | "REVIEWED" | "FINALIZED" | null;
  };
  error?: { message: string };
};

const comingSoonCards = [
  "Diet Recall",
  "24 Hour Diet",
  "QC Table",
  "Diet Plan",
];

type ClinicalStatus = "DRAFT" | "SUBMITTED" | "REVIEWED" | "FINALIZED" | null;

function getClinicalAssessmentText(status: ClinicalStatus) {
  if (!status) return "Not started";
  if (status === "DRAFT") return "Draft in progress";
  if (status === "SUBMITTED") return "Submitted for review";
  if (status === "REVIEWED") return "Reviewed";
  return "Finalized";
}

export function ClientDashboard(): React.JSX.Element {
  const [data, setData] = useState<DashboardPayload["data"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async (): Promise<void> => {
      const response = await fetch("/api/client/dashboard", { cache: "no-store" });
      const payload = (await response.json()) as DashboardPayload;
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
  if (error || !data) return <EmptyState title="Unable to load dashboard" description={error || "No dashboard data."} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {data.user.firstName} {data.user.lastName}
        </h1>
        <p className="mt-2 text-slate-600">Profile completion: {data.profileCompletionPercent}%</p>
        <p className="text-slate-600">
          Assigned dietician: {data.assignedDietician ? `${data.assignedDietician.firstName} ${data.assignedDietician.lastName}` : "Not assigned yet"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={CLIENT_ROUTES.NOTES} className="text-sm font-semibold text-primary hover:text-primary-dark">
              Open Notes
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-slate-600">
              Status: {getClinicalAssessmentText(data.clinicalAssessmentStatus)}
            </p>
            <Link href={CLIENT_ROUTES.CLINICAL_ASSESSMENT} className="text-sm font-semibold text-primary hover:text-primary-dark">
              Open Clinical Assessment
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questionnaire / Doubts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-slate-600">Unread replies: {data.unreadQuestionnaireCount}</p>
            <Link href={CLIENT_ROUTES.QUESTIONNAIRE} className="text-sm font-semibold text-primary hover:text-primary-dark">
              Open Questionnaire
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={CLIENT_ROUTES.PROFILE} className="text-sm font-semibold text-primary hover:text-primary-dark">
              Open Profile
            </Link>
          </CardContent>
        </Card>

        {comingSoonCards.map((card) => (
          <Card key={card}>
            <CardHeader>
              <CardTitle>{card}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-500">Coming in a later phase.</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
