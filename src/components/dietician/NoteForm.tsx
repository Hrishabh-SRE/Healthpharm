"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNoteSchema } from "@/lib/validation/note.schema";

type NoteFormInput = z.input<typeof createNoteSchema>;
type NoteFormOutput = z.output<typeof createNoteSchema>;

type NoteFormProps = {
  initialValues?: {
    title: string | null;
    content: string;
    visibility: "PRIVATE" | "SHARED_WITH_CLIENT";
    noteType: "GENERAL" | "FOLLOW_UP" | "CLINICAL" | "INTERNAL";
  };
  submitLabel: string;
  onSubmit: (values: NoteFormOutput) => Promise<void>;
  onCancel?: () => void;
};

export function NoteForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: NoteFormProps): React.JSX.Element {
  const form = useForm<NoteFormInput, unknown, NoteFormOutput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: initialValues?.title ?? "",
      content: initialValues?.content ?? "",
      visibility: initialValues?.visibility ?? "PRIVATE",
      noteType: initialValues?.noteType ?? "GENERAL",
    },
  });

  return (
    <form className="space-y-3 rounded-lg border border-slate-200 bg-white p-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Optional title" {...form.register("title")} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" placeholder="Write your note..." {...form.register("content")} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="visibility">Visibility</Label>
          <select
            id="visibility"
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            {...form.register("visibility")}
          >
            <option value="PRIVATE">Private</option>
            <option value="SHARED_WITH_CLIENT">Shared with client</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="noteType">Note Type</Label>
          <select
            id="noteType"
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            {...form.register("noteType")}
          >
            <option value="GENERAL">General</option>
            <option value="FOLLOW_UP">Follow-up</option>
            <option value="CLINICAL">Clinical</option>
            <option value="INTERNAL">Internal</option>
          </select>
        </div>
      </div>

      {form.formState.errors.content ? <p className="text-sm text-red-600">{form.formState.errors.content.message}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
