import { describe, it, expect } from "vitest";
import { MAX_NOTE_LENGTH } from "~/lib/notes";
import { describeNoteDraft } from "../index";

describe("describeNoteDraft", () => {
  it("lets a Student save a first note", () => {
    expect(describeNoteDraft("Generics are like parameters", null)).toEqual({
      length: 28,
      tooLong: false,
      empty: false,
      unchanged: false,
      canSave: true,
    });
  });

  it("does not offer Save for an empty draft", () => {
    const draft = describeNoteDraft("   \n ", null);
    expect(draft.empty).toBe(true);
    expect(draft.canSave).toBe(false);
  });

  it("does not offer Save when the draft matches the saved note", () => {
    const draft = describeNoteDraft("Same text", "Same text");
    expect(draft.unchanged).toBe(true);
    expect(draft.canSave).toBe(false);
  });

  it("ignores surrounding whitespace, which the server trims anyway", () => {
    expect(describeNoteDraft("Same text\n", "Same text").unchanged).toBe(true);
  });

  it("treats a blank editor with no saved note as unchanged", () => {
    expect(describeNoteDraft("", null).unchanged).toBe(true);
  });

  it("ignores whitespace around the saved note too", () => {
    expect(describeNoteDraft("Same text", "  Same text\n").unchanged).toBe(
      true
    );
  });

  it("offers Save once the saved note is edited", () => {
    const draft = describeNoteDraft("Same text, more", "Same text");
    expect(draft.unchanged).toBe(false);
    expect(draft.canSave).toBe(true);
  });

  it("allows a draft exactly at the limit", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH), null);
    expect(draft.tooLong).toBe(false);
    expect(draft.canSave).toBe(true);
  });

  it("blocks a draft one character over the limit", () => {
    const draft = describeNoteDraft("a".repeat(MAX_NOTE_LENGTH + 1), null);
    expect(draft).toMatchObject({
      length: MAX_NOTE_LENGTH + 1,
      tooLong: true,
      canSave: false,
    });
  });

  it("does not count surrounding whitespace toward the limit", () => {
    const draft = describeNoteDraft(
      `  ${"a".repeat(MAX_NOTE_LENGTH)}\n\n`,
      null
    );
    expect(draft).toMatchObject({
      length: MAX_NOTE_LENGTH,
      tooLong: false,
      canSave: true,
    });
  });
});
