import assert from "node:assert/strict";
import test from "node:test";
import { entryHref, isEntryId } from "../lib/entryPages.js";

test("an entry's page lives at /entries/<id>", () => {
  assert.equal(entryHref("0b9c7a52-8d34-4b8e-a0b7-6c1f2d9e4a33"), "/entries/0b9c7a52-8d34-4b8e-a0b7-6c1f2d9e4a33");
});

test("an entry id is a uuid, in either case", () => {
  assert.equal(isEntryId("0b9c7a52-8d34-4b8e-a0b7-6c1f2d9e4a33"), true);
  assert.equal(isEntryId("0B9C7A52-8D34-4B8E-A0B7-6C1F2D9E4A33"), true);
});

test("anything else is not an entry id, so the page is not found without asking the database", () => {
  for (const value of ["sampot-hol", "", "0b9c7a52-8d34-4b8e-a0b7", "0b9c7a52-8d34-4b8e-a0b7-6c1f2d9e4a33x", undefined, null, 42]) {
    assert.equal(isEntryId(value), false, String(value));
  }
});
