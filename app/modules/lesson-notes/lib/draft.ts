export type NoteDraft = {
  length: number;
  tooLong: boolean;
  empty: boolean;
  unchanged: boolean;
  canSave: boolean;
};

export function describeDraft(
  draft: string,
  savedBody: string | null,
  maxLength: number
): NoteDraft {
  const length = draft.length;
  const tooLong = length > maxLength;
  const empty = draft.trim().length === 0;
  // The server trims before it stores, so compare trimmed text: adding a
  // trailing newline to a saved note is not an edit worth a save.
  const unchanged = draft.trim() === (savedBody ?? "").trim();

  return {
    length,
    tooLong,
    empty,
    unchanged,
    canSave: !tooLong && !empty && !unchanged,
  };
}
