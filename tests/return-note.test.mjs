import assert from "node:assert/strict";
import test from "node:test";
import { checkReturnNote } from "../lib/returnNote.js";

test("an empty note, or one made only of spaces, tabs and line breaks, is refused", () => {
  for (const text of ["", " ", "\t", "\n", "\r\n", "  \n\t \r\n  "]) {
    assert.equal(checkReturnNote(text).ok, false, JSON.stringify(text));
  }
});

test("a short note is accepted and handed back as the note to send", () => {
  assert.deepEqual(checkReturnNote("Please add the year."), { ok: true, note: "Please add the year.", count: 20 });
});

test("a note of exactly 500 characters is accepted, and 501 is refused", () => {
  assert.equal(checkReturnNote("a".repeat(500)).ok, true);
  assert.equal(checkReturnNote("a".repeat(501)).ok, false);
});

test("characters are counted as code points, like the database: 500 emoji fit and 501 do not", () => {
  // Each emoji is one code point but two UTF-16 units, so .length would say 1000.
  const accepted = checkReturnNote("🧵".repeat(500));
  assert.equal(accepted.ok, true);
  assert.equal(accepted.count, 500);
  assert.equal(checkReturnNote("🧵".repeat(501)).ok, false);
});

test("spaces, tabs and line breaks at the ends are trimmed before counting", () => {
  const body = "a".repeat(500);
  const result = checkReturnNote(` \t\r\n${body}\r\n \n`);
  assert.deepEqual(result, { ok: true, note: body, count: 500 });
});

test("a browser's carriage returns at the ends are trimmed", () => {
  assert.equal(checkReturnNote("\r\nAdd the maker.\r\n").note, "Add the maker.");
});

test("line breaks and spaces inside the note are kept exactly", () => {
  const text = "First, add the year.\r\n\r\nSecond:  name   the tailor.\n\tThanks";
  assert.equal(checkReturnNote(text).note, text);
});

test("a non-breaking space at the ends is kept, as review_entry keeps it", () => {
  assert.equal(checkReturnNote("\u00a0Add the year.\u00a0").note, "\u00a0Add the year.\u00a0");
  // Only non-breaking spaces: both the screen and the database accept it, on purpose.
  assert.deepEqual(checkReturnNote("\u00a0\u00a0"), { ok: true, note: "\u00a0\u00a0", count: 2 });
  // So is an ideographic space, which String.prototype.trim() would strip.
  assert.equal(checkReturnNote("\u3000x").note, "\u3000x");
});

test("Khmer is handed back character for character, never changed", () => {
  // Includes a zero-width space and a coeng cluster, which "fixing" tools like to touch.
  const khmer = "សូមបន្ថែម\u200bឆ្នាំដែល\u200bដេរ ហើយ\u200bប្រាប់ឈ្មោះជាងស្ត្រី។";
  const result = checkReturnNote(`  ${khmer}\n`);
  assert.equal(result.ok, true);
  assert.equal(result.note, khmer);
});

test("500 Khmer characters fit, and 501 do not", () => {
  assert.equal(checkReturnNote("ក".repeat(500)).ok, true);
  assert.equal(checkReturnNote("ក".repeat(501)).ok, false);
});
