"use client";

import { useCallback, useEffect, useState } from "react";

import { ClinicalAssessmentForm } from "@/components/clinical-assessment/ClinicalAssessmentForm";
import { ClientClinicalAssessmentSummary } from "@/components/client/ClientClinicalAssessmentSummary";
import { ClinicalAssessmentStatusBadge } from "@/components/dietician/ClinicalAssessmentStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import type {
  ClinicalAssessment,
  ClinicalAssessmentClientUpdateInput,
} from "@/types/clinical-assessment";

type ClinicalAssessmentPayload = {
  success: boolean;
  data?: {
    assessment: ClinicalAssessment | null;
  };
  error?: {
    code: string;
    message: string;
  };
};

export function ClientClinicalAssessmentForm(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<ClinicalAssessment | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/client/clinical-assessment", { cache: "no-store" });
    const payload = (await response.json()) as ClinicalAssessmentPayload;
    if (!response.ok || !payload.success || payload.data === undefined) {
      setError(payload.error?.message ?? "Unable to load clinical assessment.");
      setLoading(false);
      return;
    }

    setAssessment(payload.data.assessment);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onSave = async (values: ClinicalAssessmentClientUpdateInput) => {
    setError("");
    setMessage("");
    const response = await fetch("/api/client/clinical-assessment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as ClinicalAssessmentPayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to save assessment.");
      return;
    }

    setAssessment(payload.data.assessment);
    setMessage("Draft saved.");
  };

  const onSubmit = async () => {
    const confirmed = window.confirm(
      "Once submitted, your assessment will be locked for dietician review. Continue?",
    );
    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    const response = await fetch("/api/client/clinical-assessment/submit", {
      method: "POST",
    });
    const payload = (await response.json()) as ClinicalAssessmentPayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to submit assessment.");
      return;
    }

    setAssessment(payload.data.assessment);
    setMessage("Assessment submitted for review.");
  };

  if (loading) return <LoadingState />;
  if (error && !assessment) return <EmptyState title="Unable to load clinical assessment" description={error} />;

  const status = assessment?.status ?? "DRAFT";
  const readOnly = Boolean(assessment && assessment.status !== "DRAFT");

  return (
    <div className="space-y-4">
      {assessment ? (
        <ClientClinicalAssessmentSummary
          status={assessment.status}
          updatedAt={assessment.updatedAt}
          submittedAt={assessment.submittedAt}
          reviewedAt={assessment.reviewedAt}
          finalizedAt={assessment.finalizedAt}
        />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Clinical Assessment</h2>
            <ClinicalAssessmentStatusBadge status={status} />
          </div>
          <p className="mt-2 text-sm text-slate-600">Start your clinical assessment.</p>
        </div>
      )}

      <p className="text-sm text-slate-600">Once submitted, your assessment will be locked for dietician review.</p>

      <ClinicalAssessmentForm
        assessment={assessment}
        readOnly={readOnly}
        showDieticianSection={false}
        onSave={readOnly ? undefined : onSave}
        saveLabel="Save Draft"
        actionsSlot={
          !readOnly ? (
            <Button type="button" variant="outline" onClick={() => void onSubmit()}>
              Submit for Review
            </Button>
          ) : undefined
        }
      />

      {assessment && (assessment.status === "REVIEWED" || assessment.status === "FINALIZED") ? (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">Dietician Review</h3>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Assessment summary:</span>{" "}
            {assessment.assessmentSummary || "-"}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Recommendations:</span>{" "}
            {assessment.dieticianRecommendations || "-"}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Follow-up recommendations:</span>{" "}
            {assessment.followUpRecommendations || "-"}
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
