"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendMessageSchema } from "@/lib/validation/questionnaire.schema";

type MessageFormInput = z.input<typeof sendMessageSchema>;

type MessageComposerProps = {
  onSend: (messageBody: string) => Promise<void>;
  label?: string;
};

export function MessageComposer({ onSend, label = "Message" }: MessageComposerProps): React.JSX.Element {
  const form = useForm<MessageFormInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { messageBody: "" },
  });

  const submit = async (values: MessageFormInput) => {
    await onSend(values.messageBody.trim());
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3" noValidate>
      <Label htmlFor="messageBody">{label}</Label>
      <Textarea
        id="messageBody"
        placeholder="Type your message..."
        {...form.register("messageBody")}
        disabled={form.formState.isSubmitting}
      />
      {form.formState.errors.messageBody ? <p className="text-sm text-red-600">{form.formState.errors.messageBody.message}</p> : null}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
