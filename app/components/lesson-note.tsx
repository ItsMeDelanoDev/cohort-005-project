import { useState } from "react";
import { useFetcher } from "react-router";
import { Lock, NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatRelativeTime } from "~/lib/utils";
import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { describeNoteDraft, type NoteDraft } from "~/modules/lesson-notes";

export type LessonNoteData = { body: string; updatedAt: string } | null;

// Same card, header and form footer as CommentThread, so the two sections of
// the lesson page read as one design.
export function LessonNote({ note }: { note: LessonNoteData }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [body, setBody] = useState(note?.body ?? "");
  const isSaving = fetcher.state !== "idle";
  const draft = describeNoteDraft(body, note?.body ?? null);

  return (
    <Card className="mb-8">
      <CardContent className="px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <NotebookPen className="size-5 text-primary" />
          <h2 className="text-xl font-semibold">Your notes</h2>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="size-3" />
            Only you can see these
          </span>
        </div>

        <fetcher.Form method="post" className="space-y-2">
          <input type="hidden" name="intent" value="save-note" />
          <Textarea
            name="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Jot down what you want to remember from this lesson..."
            aria-label="Your notes"
            className="min-h-32 resize-y"
          />

          <NoteFooter
            note={note}
            draft={draft}
            isSaving={isSaving}
            error={fetcher.data?.error}
          />
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}

function NoteFooter({
  note,
  draft,
  isSaving,
  error,
}: {
  note: LessonNoteData;
  draft: NoteDraft;
  isSaving: boolean;
  error: string | undefined;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit" size="sm" disabled={isSaving || !draft.canSave}>
        {isSaving ? "Saving..." : "Save note"}
      </Button>

      {error ? (
        <span className="text-sm text-destructive">{error}</span>
      ) : (
        <NoteStatus note={note} unchanged={draft.unchanged} />
      )}

      <span
        className={cn(
          "ml-auto text-xs",
          draft.tooLong ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {draft.length} / {MAX_NOTE_LENGTH}
      </span>
    </div>
  );
}

function NoteStatus({
  note,
  unchanged,
}: {
  note: LessonNoteData;
  unchanged: boolean;
}) {
  if (!unchanged) {
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  }
  if (!note) return null;
  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      Saved {formatRelativeTime(note.updatedAt)}
    </span>
  );
}
