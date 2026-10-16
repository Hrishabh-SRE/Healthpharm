"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ClinicalAssessmentStatusBadge } from "@/components/dietician/ClinicalAssessmentStatusBadge";
import { ClientSearchFilters } from "@/components/dietician/ClientSearchFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import type { DieticianAssignedClient } from "@/types/dietician";

type Payload = {
  success: boolean;
  data?: { clients: Array<{ client: { id: string; firstName: string; lastName: string; email: string; phone: string | null; clientProfile: { profileCompletionPercent: number; updatedAt: string } | null }; status: string; assignedAt: string; unreadQuestionnaireCount?: number; clinicalAssessmentStatus?: "DRAFT" | "SUBMITTED" | "REVIEWED" | "FINALIZED" | null }> };
  error?: { message: string };
};

export function AssignedClientsTable(): React.JSX.Element {
  const [clients, setClients] = useState<DieticianAssignedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [incompleteOnly, setIncompleteOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (incompleteOnly) params.set("incompleteOnly", "true");

    const response = await fetch(`/api/dietician/clients?${params.toString()}`, { cache: "no-store" });
    const payload = (await response.json()) as Payload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to load assigned clients.");
      setLoading(false);
      return;
    }

    setClients(
      payload.data.clients.map((item) => ({
        id: item.client.id,
        firstName: item.client.firstName,
        lastName: item.client.lastName,
        email: item.client.email,
        phone: item.client.phone,
        profileCompletionPercent: item.client.clientProfile?.profileCompletionPercent ?? 0,
        assignmentStatus: item.status as "ACTIVE" | "INACTIVE",
        unreadQuestionnaireCount: item.unreadQuestionnaireCount ?? 0,
        clinicalAssessmentStatus: item.clinicalAssessmentStatus ?? null,
        assignedAt: item.assignedAt,
        updatedAt: item.client.clientProfile?.updatedAt ?? item.assignedAt,
      })),
    );
    setLoading(false);
  }, [q, incompleteOnly]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <ClientSearchFilters
        defaultQuery={q}
        defaultIncompleteOnly={incompleteOnly}
        onApply={({ q: nextQ, incompleteOnly: nextIncompleteOnly }) => {
          setQ(nextQ);
          setIncompleteOnly(nextIncompleteOnly);
        }}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {clients.length === 0 ? (
        <EmptyState title="No assigned clients" description="No clients match the current filters." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Profile Completion</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Assigned At</th>
                <th className="px-3 py-2">Last Updated</th>
                <th className="px-3 py-2">Unread Questions</th>
                <th className="px-3 py-2">Clinical Assessment</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    <p className="font-semibold">{client.firstName} {client.lastName}</p>
                    <p>{client.email}</p>
                  </td>
                  <td className="px-3 py-2">{client.phone ?? "-"}</td>
                  <td className="px-3 py-2">{client.profileCompletionPercent}%</td>
                  <td className="px-3 py-2">{client.assignmentStatus}</td>
                  <td className="px-3 py-2">{new Date(client.assignedAt).toLocaleString()}</td>
                  <td className="px-3 py-2">{new Date(client.updatedAt).toLocaleString()}</td>
                  <td className="px-3 py-2">{client.unreadQuestionnaireCount}</td>
                  <td className="px-3 py-2">
                    {client.clinicalAssessmentStatus ? (
                      <ClinicalAssessmentStatusBadge status={client.clinicalAssessmentStatus} />
                    ) : (
                      <span className="text-slate-500">Not started</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Link href={`/dietician/clients/${client.id}`} className="text-primary hover:text-primary-dark font-semibold">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
