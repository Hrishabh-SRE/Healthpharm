"use client";

import { useCallback, useEffect, useState } from "react";

import { NoteForm } from "@/components/dietician/NoteForm";
import { NotesTable } from "@/components/dietician/NotesTable";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import type { NoteListItem } from "@/types/note";

type NotesPayload = {
  success: boolean;
  data?: { notes: NoteListItem[]; note?: NoteListItem };
  error?: { message: string };
};

type NoteFormOutput = {
  title?: string | null;
  content: string;
  visibility: "PRIVATE" | "SHARED_WITH_CLIENT";
  noteType: "GENERAL" | "FOLLOW_UP" | "CLINICAL" | "INTERNAL";
};

type DieticianNotesPanelProps = {
  clientId: string;
};

export function DieticianNotesPanel({ clientId }: DieticianNotesPanelProps): React.JSX.Element {
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteListItem | null>(null);
  const [visibilityFilter, setVisibilityFilter] = useState<"ALL" | "PRIVATE" | "SHARED_WITH_CLIENT">("ALL");
  const [noteTypeFilter, setNoteTypeFilter] = useState<"ALL" | "GENERAL" | "FOLLOW_UP" | "CLINICAL" | "INTERNAL">("ALL");

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (visibilityFilter !== "ALL") {
      params.set("visibility", visibilityFilter);
    }
    if (noteTypeFilter !== "ALL") {
      params.set("noteType", noteTypeFilter);
    }

    const response = await fetch(`/api/dietician/clients/${clientId}/notes?${params.toString()}`, {
      cache: "no-store",
    });
    const payload = (await response.json()) as NotesPayload;
    if (!response.ok || !payload.success || !payload.data) {
      setError(payload.error?.message ?? "Unable to load notes.");
      setLoading(false);
      return;
    }

    setNotes(payload.data.notes);
    setLoading(false);
  }, [clientId, noteTypeFilter, visibilityFilter]);

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  const handleCreate = async (values: NoteFormOutput): Promise<void> => {
    setError("");
    setSuccessMessage("");

    const response = await fetch(`/api/dietician/clients/${clientId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as NotesPayload;
    if (!response.ok || !payload.success) {
      setError(payload.error?.message ?? "Unable to create note.");
      return;
    }

    setShowCreateForm(false);
    setSuccessMessage("Note created.");
    await loadNotes();
  };

  const handleUpdate = async (values: NoteFormOutput): Promise<void> => {
    if (!editingNote) return;
    setError("");
    setSuccessMessage("");

    const response = await fetch(`/api/dietician/clients/${clientId}/notes/${editingNote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json()) as NotesPayload;
    if (!response.ok || !payload.success) {
      setError(payload.error?.message ?? "Unable to update note.");
      return;
    }

    setEditingNote(null);
    setSuccessMessage("Note updated.");
    await loadNotes();
  };

  const handleDelete = async (note: NoteListItem): Promise<void> => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");
    const response = await fetch(`/api/dietician/clients/${clientId}/notes/${note.id}`, {
      method: "DELETE",
    });
    const payload = (await response.json()) as NotesPayload;
    if (!response.ok || !payload.success) {
      setError(payload.error?.message ?? "Unable to delete note.");
      return;
    }

    setSuccessMessage("Note deleted.");
    await loadNotes();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => setShowCreateForm((value) => !value)}>
          {showCreateForm ? "Close Create Form" : "Create Note"}
        </Button>
        <select
          value={visibilityFilter}
          onChange={(event) => setVisibilityFilter(event.target.value as typeof visibilityFilter)}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="ALL">All visibility</option>
          <option value="PRIVATE">Private</option>
          <option value="SHARED_WITH_CLIENT">Shared</option>
        </select>
        <select
          value={noteTypeFilter}
          onChange={(event) => setNoteTypeFilter(event.target.value as typeof noteTypeFilter)}
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
        >
          <option value="ALL">All note types</option>
          <option value="GENERAL">General</option>
          <option value="FOLLOW_UP">Follow-up</option>
          <option value="CLINICAL">Clinical</option>
          <option value="INTERNAL">Internal</option>
        </select>
      </div>

      {showCreateForm ? <NoteForm submitLabel="Save Note" onSubmit={handleCreate} onCancel={() => setShowCreateForm(false)} /> : null}
      {editingNote ? (
        <NoteForm
          initialValues={{
            title: editingNote.title,
            content: editingNote.content,
            visibility: editingNote.visibility,
            noteType: editingNote.noteType,
          }}
          submitLabel="Update Note"
          onSubmit={handleUpdate}
          onCancel={() => setEditingNote(null)}
        />
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

      <NotesTable notes={notes} onEdit={(note) => setEditingNote(note)} onDelete={handleDelete} />
    </div>
  );
}
