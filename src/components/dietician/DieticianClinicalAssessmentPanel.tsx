"use client";

import { useCallback, useEffect, useState } from "react";

import { ClinicalAssessmentForm } from "@/components/clinical-assessment/ClinicalAssessmentForm";
import { ClinicalAssessmentStatusBadge } from "@/components/dietician/ClinicalAssessmentStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import type {
  ClinicalAssessment,
  ClinicalAssessmentDieticianUpdateInput,
} from "@/types/clinical-assessment";

type DieticianClinicalPayload = {
  success: boolean;
  data?: {
    assessment: ClinicalAssessment | null;
  };
  error?: {
    code: string;
    message: string;
  };
};

type DieticianClinicalAssessmentPanelProps = {
  clientId: string;
};

export function DieticianClinicalAssessmentPanel({
  clientId,
}: DieticianClinicalAssessmentPanelProps): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<ClinicalAssessment | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/dietician/clients/${clientId}/clinical-assessment`, {
      cache: "no-store",
    });
    const payload = (await response.json()) as DieticianClinicalPayload;
    if (!response.ok || !payload.success || payload.data === undefined) {
      setError(payload.error?.message ?? "Unable to load clinical assessment.");
      setLoading(false);
      return;
    }

    setAssessment(payload.data.assessment);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = async (values: ClinicalAssessmentDieticianUpdateInput) => {
    setError("");
    setMessage("");
    const response = await fetch(`/api/dietician/clients/${clientId}/clinical-assessment`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as DieticianClinicalPayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to save assessment.");
      return;
    }

    setAssessment(payload.data.assessment);
    setMessage("Assessment saved.");
  };

  const onReview = async () => {
    setError("");
    setMessage("");
    const response = await fetch(`/api/dietician/clients/${clientId}/clinical-assessment/review`, {
      method: "POST",
    });
    const payload = (await response.json()) as DieticianClinicalPayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to mark assessment as reviewed.");
      return;
    }

    setAssessment(payload.data.assessment);
    setMessage("Assessment marked as reviewed.");
  };

  const onFinalize = async () => {
    const confirmed = window.confirm("Finalize this assessment? This action locks it for this phase.");
    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    const response = await fetch(`/api/dietician/clients/${clientId}/clinical-assessment/finalize`, {
      method: "POST",
    });
    const payload = (await response.json()) as DieticianClinicalPayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to finalize assessment.");
      return;
    }

    setAssessment(payload.data.assessment);
    setMessage("Assessment finalized.");
  };

  if (loading) return <LoadingState />;
  if (error && !assessment) return <EmptyState title="Unable to load clinical assessment" description={error} />;

  const status = assessment?.status ?? "DRAFT";
  const canReview = status === "DRAFT" || status === "SUBMITTED";
  const canFinalize = status === "REVIEWED";
  const isFinalized = status === "FINALIZED";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Clinical Assessment</h2>
          <ClinicalAssessmentStatusBadge status={status} />
        </div>
        {assessment ? <p className="mt-2 text-sm text-slate-600">Last updated: {new Date(assessment.updatedAt).toLocaleString()}</p> : <p className="mt-2 text-sm text-slate-600">No assessment exists yet. Save to create one.</p>}
        {assessment?.submittedAt ? <p className="text-sm text-slate-600">Submitted: {new Date(assessment.submittedAt).toLocaleString()}</p> : null}
        {assessment?.reviewedAt ? <p className="text-sm text-slate-600">Reviewed: {new Date(assessment.reviewedAt).toLocaleString()}</p> : null}
        {assessment?.finalizedAt ? <p className="text-sm text-slate-600">Finalized: {new Date(assessment.finalizedAt).toLocaleString()}</p> : null}
      </div>

      <ClinicalAssessmentForm
        assessment={assessment}
        readOnly={isFinalized}
        showDieticianSection={true}
        onSave={isFinalized ? undefined : onSave}
        saveLabel="Save Assessment"
        actionsSlot={
          <div className="flex flex-wrap gap-2">
            {canReview ? (
              <Button type="button" variant="outline" onClick={() => void onReview()}>
                Mark Reviewed
              </Button>
            ) : null}
            {canFinalize ? (
              <Button type="button" variant="outline" onClick={() => void onFinalize()}>
                Finalize Assessment
              </Button>
            ) : null}
          </div>
        }
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
