"use client";

import { useEffect, useState } from "react";

import { NoteTypeBadge } from "@/components/dietician/NoteTypeBadge";
import { NoteVisibilityBadge } from "@/components/dietician/NoteVisibilityBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NoteListItem } from "@/types/note";

type ClientNotesPayload = {
  success: boolean;
  data?: { notes: NoteListItem[] };
  error?: { message: string };
};

export function ClientNotesView(): React.JSX.Element {
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);
      setError("");
      const response = await fetch("/api/client/notes", { cache: "no-store" });
      const payload = (await response.json()) as ClientNotesPayload;
      if (!response.ok || !payload.success || !payload.data) {
        setError(payload.error?.message ?? "Unable to load notes.");
        setLoading(false);
        return;
      }

      setNotes(payload.data.notes);
      setLoading(false);
    };

    void load();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <EmptyState title="Unable to load shared notes" description={error} />;
  }

  if (notes.length === 0) {
    return <EmptyState title="No shared notes yet." description="Your dietician has not shared any notes yet." />;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold text-slate-900">Shared Notes</h1>
      <div className="grid gap-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle className="text-base">{note.title ?? "Untitled Note"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="whitespace-pre-wrap text-sm text-slate-700">{note.content}</p>
              <div className="flex flex-wrap items-center gap-2">
                <NoteVisibilityBadge visibility={note.visibility} />
                <NoteTypeBadge noteType={note.noteType} />
              </div>
              <p className="text-xs text-slate-500">
                Author: {note.author ? `${note.author.firstName} ${note.author.lastName}` : "-"}
              </p>
              <p className="text-xs text-slate-500">Created: {new Date(note.createdAt).toLocaleString()}</p>
              <p className="text-xs text-slate-500">Updated: {new Date(note.updatedAt).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
