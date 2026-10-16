import { NoteTypeBadge } from "@/components/dietician/NoteTypeBadge";
import { NoteVisibilityBadge } from "@/components/dietician/NoteVisibilityBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { NoteListItem } from "@/types/note";

type NotesTableProps = {
  notes: NoteListItem[];
  onEdit: (note: NoteListItem) => void;
  onDelete: (note: NoteListItem) => void;
};

function getPreview(content: string): string {
  if (content.length <= 120) {
    return content;
  }

  return `${content.slice(0, 120)}...`;
}

export function NotesTable({ notes, onEdit, onDelete }: NotesTableProps): React.JSX.Element {
  if (notes.length === 0) {
    return <EmptyState title="No notes found" description="Create the first note for this client." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="px-3 py-2">Title</th>
            <th className="px-3 py-2">Preview</th>
            <th className="px-3 py-2">Visibility</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Author</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2">Updated</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id} className="border-t border-slate-100">
              <td className="px-3 py-2 font-semibold text-slate-900">{note.title ?? "-"}</td>
              <td className="max-w-sm px-3 py-2 text-slate-700">{getPreview(note.content)}</td>
              <td className="px-3 py-2">
                <NoteVisibilityBadge visibility={note.visibility} />
              </td>
              <td className="px-3 py-2">
                <NoteTypeBadge noteType={note.noteType} />
              </td>
              <td className="px-3 py-2 text-slate-700">{note.author ? `${note.author.firstName} ${note.author.lastName}` : "-"}</td>
              <td className="px-3 py-2 text-slate-700">{new Date(note.createdAt).toLocaleString()}</td>
              <td className="px-3 py-2 text-slate-700">{new Date(note.updatedAt).toLocaleString()}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <button type="button" onClick={() => onEdit(note)} className="text-primary hover:text-primary-dark">
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(note)} className="text-red-600 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
