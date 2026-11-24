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
  // The server trims before it checks the limit and stores, so measure and
  // compare trimmed text: whitespace at the ends is never saved, so it neither
  // counts toward the limit nor makes a saved note an edit worth a save.
  const trimmed = draft.trim();
  const length = trimmed.length;
  const tooLong = length > maxLength;
  const empty = length === 0;
  const unchanged = trimmed === (savedBody ?? "").trim();

  return {
    length,
    tooLong,
    empty,
    unchanged,
    canSave: !tooLong && !empty && !unchanged,
  };
}
