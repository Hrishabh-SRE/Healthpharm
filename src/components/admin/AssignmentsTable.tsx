"use client";

import { useCallback, useEffect, useState } from "react";

import { AssignmentForm } from "@/components/admin/AssignmentForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import type { AssignmentListItem } from "@/types/assignment";

type AssignmentRow = AssignmentListItem & {
  client: { firstName: string; lastName: string; email: string };
  dietician: { firstName: string; lastName: string; email: string };
};

type AssignmentResponse = {
  success: boolean;
  data?: { assignments: AssignmentRow[] };
  error?: { message: string };
};

export function AssignmentsTable(): React.JSX.Element {
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/assignments", { cache: "no-store" });
    const payload = (await response.json()) as AssignmentResponse;
    if (!response.ok || !payload.success) {
      setError(payload.error?.message ?? "Unable to fetch assignments.");
      setLoading(false);
      return;
    }

    setAssignments(payload.data?.assignments ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const deactivate = async (assignmentId: string): Promise<void> => {
    await fetch(`/api/admin/assignments/${assignmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "INACTIVE" }),
    });
    await loadAssignments();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <AssignmentForm onSuccess={() => void loadAssignments()} />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {!assignments || assignments.length === 0 ? (
        <EmptyState title="No assignments found" description="Create your first client-dietician assignment." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Dietician</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Assigned</th>
                <th className="px-3 py-2">Unassigned</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    <p className="font-semibold">{assignment.client.firstName} {assignment.client.lastName}</p>
                    <p>{assignment.client.email}</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="font-semibold">{assignment.dietician.firstName} {assignment.dietician.lastName}</p>
                    <p>{assignment.dietician.email}</p>
                  </td>
                  <td className="px-3 py-2">{assignment.status}</td>
                  <td className="px-3 py-2">{new Date(assignment.assignedAt).toLocaleString()}</td>
                  <td className="px-3 py-2">{assignment.unassignedAt ? new Date(assignment.unassignedAt).toLocaleString() : "-"}</td>
                  <td className="px-3 py-2">
                    {assignment.status === "ACTIVE" ? (
                      <Button type="button" size="sm" variant="outline" onClick={() => void deactivate(assignment.id)}>
                        Deactivate
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-500">Inactive</span>
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
