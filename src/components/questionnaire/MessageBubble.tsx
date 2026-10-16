import { cn } from "@/lib/utils/cn";
import type { QuestionnaireMessage } from "@/types/questionnaire";

type MessageBubbleProps = {
  message: QuestionnaireMessage;
  isOwnMessage: boolean;
};

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps): React.JSX.Element {
  return (
    <div className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg border px-3 py-2",
          isOwnMessage
            ? "border-primary bg-primary-light text-primary-dark"
            : "border-slate-200 bg-white text-slate-800",
        )}
      >
        <p className="text-xs font-semibold">
          {message.sender.firstName} {message.sender.lastName} ({message.sender.role})
        </p>
        <p className="mt-1 whitespace-pre-wrap text-sm">{message.messageBody}</p>
        <p className="mt-2 text-[11px] text-slate-500">
          {new Date(message.createdAt).toLocaleString()}
          {!isOwnMessage && !message.readAt ? " • Unread" : ""}
        </p>
      </div>
    </div>
  );
}
