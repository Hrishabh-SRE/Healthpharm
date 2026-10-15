"use client";

import { useCallback, useEffect, useState } from "react";

import { ClientQuestionnaireSummary } from "@/components/client/ClientQuestionnaireSummary";
import { MessageComposer } from "@/components/questionnaire/MessageComposer";
import { MessageThread } from "@/components/questionnaire/MessageThread";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import type { QuestionnaireMessage } from "@/types/questionnaire";

type QuestionnairePayload = {
  success: boolean;
  data?: {
    thread: {
      id: string;
      clientId: string;
    };
    assignedDietician: {
      id: string;
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

export function ClientQuestionnaireChat(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [thread, setThread] = useState<QuestionnairePayload["data"]>();
  const [sendError, setSendError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/client/questionnaire", { cache: "no-store" });
    const payload = (await response.json()) as QuestionnairePayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to load questionnaire thread.");
      setLoading(false);
      return;
    }

    setThread(payload.data);
    setLoading(false);

    await fetch("/api/client/questionnaire/mark-read", { method: "POST" });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSend = async (messageBody: string) => {
    setSendError("");
    const response = await fetch("/api/client/questionnaire/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageBody }),
    });
    const payload = (await response.json()) as QuestionnairePayload;
    if (!response.ok || !payload.success) {
      setSendError(payload.error?.message ?? "Unable to send message.");
      return;
    }
    await load();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    if (error.includes("No active dietician assignment")) {
      return (
        <EmptyState
          title="Questionnaire unavailable"
          description="You do not have an assigned dietician yet. Please contact support."
        />
      );
    }

    return <EmptyState title="Unable to load questionnaire" description={error} />;
  }

  if (!thread) {
    return <EmptyState title="Questionnaire unavailable" description="Unable to load questionnaire thread." />;
  }

  return (
    <div className="space-y-4">
      <ClientQuestionnaireSummary
        assignedDieticianName={`${thread.assignedDietician.firstName} ${thread.assignedDietician.lastName}`}
        unreadCount={thread.unreadCount}
      />
      <MessageThread
        messages={thread.messages}
        currentUserId={thread.thread.clientId}
        emptyTitle="No questions yet."
        emptyDescription="Ask your dietician a question."
      />
      <MessageComposer label="Ask your dietician" onSend={handleSend} />
      {sendError ? <p className="text-sm text-red-600">{sendError}</p> : null}
    </div>
  );
}
