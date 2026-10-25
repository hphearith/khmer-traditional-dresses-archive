import assert from "node:assert/strict";
import test from "node:test";
import { isPair } from "../lib/bilingual.js";
import { ENTRY_STATUSES } from "../lib/entry.js";
import { TEXT } from "../lib/uiText.js";

test("a new entry's confirmation keeps the curator's English word for word", () => {
  assert.equal(
    TEXT.review.submitted.en,
    "Your post has been submitted for review. You will be notified when your post goes live.",
  );
});

test("every status an entry can have is named in both languages, and nothing else is", () => {
  assert.deepEqual(Object.keys(TEXT.review.status).sort(), [...ENTRY_STATUSES].sort());
  for (const status of ENTRY_STATUSES) assert.equal(isPair(TEXT.review.status[status]), true, status);
});

test("the entry form no longer promises an entry or an edit goes public at once", () => {
  assert.doesNotMatch(TEXT.page.writeIntro.en, /public as soon as/);
  assert.doesNotMatch(TEXT.page.editIntro.en, /go live only when/);
});
