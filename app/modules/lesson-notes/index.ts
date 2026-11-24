import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { describeDraft, type NoteDraft } from "./lib/draft";

export type { NoteDraft };

/**
 * What the notes editor shows for the text a Student has typed: the
 * character count, whether it is over the limit, and whether Save does
 * anything. The server rejects empty and over-long notes; this lets the
 * editor say so before the Student presses Save.
 */
export function describeNoteDraft(
  draft: string,
  savedBody: string | null
): NoteDraft {
  return describeDraft(draft, savedBody, MAX_NOTE_LENGTH);
}
