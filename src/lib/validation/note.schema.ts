import { z } from "zod";

const noteVisibilitySchema = z.enum(["PRIVATE", "SHARED_WITH_CLIENT"]);
const noteTypeSchema = z.enum(["GENERAL", "FOLLOW_UP", "CLINICAL", "INTERNAL"]);

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .max(120, "Title must be at most 120 characters.")
    .optional()
    .transform((value) => (value === "" ? null : value)),
  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(5000, "Content must be at most 5000 characters."),
  visibility: noteVisibilitySchema,
  noteType: noteTypeSchema,
});

export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .trim()
      .max(120, "Title must be at most 120 characters.")
      .optional()
      .transform((value) => (value === "" ? null : value)),
    content: z
      .string()
      .trim()
      .min(1, "Content cannot be empty.")
      .max(5000, "Content must be at most 5000 characters.")
      .optional(),
    visibility: noteVisibilitySchema.optional(),
    noteType: noteTypeSchema.optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: "At least one field is required to update a note.",
  });

export const noteFilterSchema = z.object({
  visibility: noteVisibilitySchema.optional(),
  noteType: noteTypeSchema.optional(),
});
