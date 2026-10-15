"use client";

import { useCallback, useEffect, useState } from "react";

import { MessageComposer } from "@/components/questionnaire/MessageComposer";
import { MessageThread } from "@/components/questionnaire/MessageThread";
import { UnreadBadge } from "@/components/questionnaire/UnreadBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import type { QuestionnaireMessage } from "@/types/questionnaire";

type DieticianQuestionnairePayload = {
  success: boolean;
  data?: {
    thread: {
      id: string;
      clientId: string;
      dieticianId: string;
    };
    client: {
      firstName: string;
      lastName: string;
    };
    messages: QuestionnaireMessage[];
    unreadCount: number;
  };
  error?: {
    code: string;
    message: string;
  };
};

type DieticianQuestionnairePanelProps = {
  clientId: string;
};

export function DieticianQuestionnairePanel({
  clientId,
}: DieticianQuestionnairePanelProps): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");
  const [bundle, setBundle] = useState<DieticianQuestionnairePayload["data"]>();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch(`/api/dietician/clients/${clientId}/questionnaire`, {
      cache: "no-store",
    });
    const payload = (await response.json()) as DieticianQuestionnairePayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to load questionnaire.");
      setLoading(false);
      return;
    }

    setBundle(payload.data);
    setLoading(false);

    await fetch(`/api/dietician/clients/${clientId}/questionnaire/mark-read`, {
      method: "POST",
    });
  }, [clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSend = async (messageBody: string) => {
    setSendError("");
    const response = await fetch(`/api/dietician/clients/${clientId}/questionnaire/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageBody }),
    });
    const payload = (await response.json()) as DieticianQuestionnairePayload;
    if (!response.ok || !payload.success) {
      setSendError(payload.error?.message ?? "Unable to send reply.");
      return;
    }

    await load();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <EmptyState title="Unable to load questionnaire" description={error} />;
  }

  if (!bundle) {
    return <EmptyState title="No questionnaire data" description="Questionnaire thread could not be loaded." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Questionnaire - {bundle.client.firstName} {bundle.client.lastName}
        </h2>
        <div className="mt-2">
          <UnreadBadge count={bundle.unreadCount} />
        </div>
      </div>
      <MessageThread
        messages={bundle.messages}
        currentUserId={bundle.thread.dieticianId}
        emptyTitle="No questions from this client yet."
        emptyDescription="This thread will appear when the client sends a message."
      />
      <MessageComposer label="Reply to client" onSend={handleSend} />
      {sendError ? <p className="text-sm text-red-600">{sendError}</p> : null}
    </div>
  );
}
