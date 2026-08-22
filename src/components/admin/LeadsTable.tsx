"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ConvertLeadDialog } from "@/components/admin/ConvertLeadDialog";
import { LeadFilters } from "@/components/admin/LeadFilters";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import type { AdminLeadListItem } from "@/types/admin";

type ApiResponse = {
  success: boolean;
  data?: { leads: AdminLeadListItem[] };
  error?: { message: string };
};

export function LeadsTable(): React.JSX.Element {
  const [leads, setLeads] = useState<AdminLeadListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status && status !== "ALL") params.set("status", status);

    const response = await fetch(`/api/admin/leads?${params.toString()}`, { cache: "no-store" });
    const payload = (await response.json()) as ApiResponse;
    if (!response.ok || !payload.success) {
      setError(payload.error?.message ?? "Unable to fetch leads.");
      setLoading(false);
      return;
    }

    setLeads(payload.data?.leads ?? []);
    setLoading(false);
  }, [query, status]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const leadRows = useMemo(() => leads, [leads]);

  const updateLeadStatus = async (leadId: string, nextStatus: string): Promise<void> => {
    const response = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (response.ok) {
      await loadLeads();
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <LeadFilters defaultQuery={query} defaultStatus={status} onApply={({ q, status: s }) => {
        setQuery(q);
        setStatus(s);
      }} />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {leadRows.length === 0 ? (
        <EmptyState title="No leads found" description="Try adjusting your filters or wait for new enquiries." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Service</th>
                <th className="px-3 py-2">Goal</th>
                <th className="px-3 py-2">Preferred Slot</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leadRows.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2">
                    <p className="font-semibold text-slate-900">{lead.fullName}</p>
                    <p>{lead.email}</p>
                    <p>{lead.phone}</p>
                  </td>
                  <td className="px-3 py-2">{lead.interestedService}</td>
                  <td className="px-3 py-2">{lead.healthGoal ?? "-"}</td>
                  <td className="px-3 py-2">
                    {lead.preferredDate ? new Date(lead.preferredDate).toLocaleDateString() : "-"} {lead.preferredTime ?? ""}
                  </td>
                  <td className="px-3 py-2">{lead.message ?? "-"}</td>
                  <td className="px-3 py-2">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-3 py-2">{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        className="h-9 rounded-md border border-slate-300 px-2 text-sm"
                        defaultValue={lead.status}
                        onChange={(event) => void updateLeadStatus(lead.id, event.target.value)}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                      <Button type="button" size="sm" variant="outline" onClick={() => void loadLeads()}>
                        Refresh
                      </Button>
                    </div>
                    {lead.status !== "CONVERTED" ? (
                      <ConvertLeadDialog
                        leadId={lead.id}
                        defaultEmail={lead.email}
                        defaultPhone={lead.phone}
                        defaultFullName={lead.fullName}
                        onSuccess={() => void loadLeads()}
                      />
                    ) : (
                      <p className="text-xs text-emerald-700">Already converted</p>
                    )}
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
