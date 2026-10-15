import { MessageBubble } from "@/components/questionnaire/MessageBubble";
import { EmptyState } from "@/components/shared/EmptyState";
import type { QuestionnaireMessage } from "@/types/questionnaire";

type MessageThreadProps = {
  messages: QuestionnaireMessage[];
  currentUserId: string;
  emptyTitle: string;
  emptyDescription: string;
};

export function MessageThread({
  messages,
  currentUserId,
  emptyTitle,
  emptyDescription,
}: MessageThreadProps): React.JSX.Element {
  if (messages.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="max-h-[420px] space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} isOwnMessage={message.senderId === currentUserId} />
      ))}
    </div>
  );
}
