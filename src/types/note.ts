export type NoteVisibility = "PRIVATE" | "SHARED_WITH_CLIENT";
export type NoteType = "GENERAL" | "FOLLOW_UP" | "CLINICAL" | "INTERNAL";

export type NoteListItem = {
  id: string;
  clientId: string;
  authorId: string;
  title: string | null;
  content: string;
  visibility: NoteVisibility;
  noteType: NoteType;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
};
