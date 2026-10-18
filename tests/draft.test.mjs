import assert from "node:assert/strict";
import test from "node:test";
import { EMPTY_FORM, draftKey, flagDraftKept, hasUnsavedWork, openDraftStore, takeDraftKeptFlag } from "../lib/draft.js";

const ENTRY_A = "11111111-1111-4111-8111-111111111111";
const ENTRY_B = "22222222-2222-4222-8222-222222222222";

test("a new entry and each edited entry have separate draft keys", () => {
  const keys = [
    draftKey({ userId: "user-1" }),
    draftKey({ userId: "user-1", entryId: ENTRY_A }),
    draftKey({ userId: "user-1", entryId: ENTRY_B }),
  ];
  assert.equal(new Set(keys).size, 3);
});

test("two accounts on one device never share a draft key", () => {
  assert.notEqual(draftKey({ userId: "user-1" }), draftKey({ userId: "user-2" }));
  assert.notEqual(
    draftKey({ userId: "user-1", entryId: ENTRY_A }),
    draftKey({ userId: "user-2", entryId: ENTRY_A }),
  );
});

// The part of the browser's Storage that drafts use, held in memory.
function fakeStorage() {
  const items = new Map();
  return {
    items,
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };
}

const KEY = draftKey({ userId: "user-1" });

test("a saved draft comes back exactly as it was written, Khmer included", () => {
  const storage = fakeStorage();
  const values = {
    title: "សំពត់ហូលរបស់ម្ដាយ  ",
    // A zero-width space between words, a tab, a new line and trailing spaces
    // must all survive: nothing in a draft is trimmed or normalised.
    story: "ម្ដាយបានកុម្ម៉ង់សំពត់នេះ\u200Bនៅភ្នំពេញ\tឆ្នាំ ២០២៤\n\nអរគុណ។  ",
    year: "2024",
  };
  openDraftStore(() => storage, KEY).save(values);
  assert.deepEqual(openDraftStore(() => storage, KEY).load(), values);
});

test("nothing is loaded when nothing was saved", () => {
  assert.equal(openDraftStore(() => fakeStorage(), KEY).load(), null);
});

test("clearing a draft removes it, and only that draft", () => {
  const storage = fakeStorage();
  const newKey = draftKey({ userId: "user-1" });
  const editKey = draftKey({ userId: "user-1", entryId: ENTRY_A });
  openDraftStore(() => storage, newKey).save({ title: "New dress" });
  openDraftStore(() => storage, editKey).save({ title: "Edited dress" });

  openDraftStore(() => storage, editKey).clear();

  assert.equal(openDraftStore(() => storage, editKey).load(), null);
  assert.deepEqual(openDraftStore(() => storage, newKey).load(), { title: "New dress" });
});

test("data that is not a draft loads as no draft instead of failing", () => {
  for (const raw of ["not json {", "null", "42", '"text"', "[1,2]", '{"title": 5}', "{}"]) {
    const storage = fakeStorage();
    storage.setItem(KEY, raw);
    assert.equal(openDraftStore(() => storage, KEY).load(), null, raw);
  }
});

test("a loaded draft keeps only the entry's text fields, as text", () => {
  const storage = fakeStorage();
  storage.setItem(KEY, JSON.stringify({
    title: "Sampot", year: "2024", photo: "C:/fake/path.jpg", consent: "on", owner: "someone-else", story: 7,
  }));
  assert.deepEqual(openDraftStore(() => storage, KEY).load(), { title: "Sampot", year: "2024" });
});

test("save says whether the draft was kept", () => {
  assert.equal(openDraftStore(() => fakeStorage(), KEY).save({ title: "Sampot" }), true);
});

test("blocked storage never throws: nothing is saved and nothing is loaded", () => {
  const blocked = () => { throw new DOMException("The operation is insecure.", "SecurityError"); };
  const store = openDraftStore(blocked, KEY);
  assert.equal(store.save({ title: "Sampot" }), false);
  assert.equal(store.load(), null);
  assert.doesNotThrow(() => store.clear());
});

test("a full or read-only storage never throws either", () => {
  const refuse = () => { throw new DOMException("The quota has been exceeded.", "QuotaExceededError"); };
  const storage = { getItem: refuse, setItem: refuse, removeItem: refuse };
  const store = openDraftStore(() => storage, KEY);
  assert.equal(store.save({ title: "Sampot" }), false);
  assert.equal(store.load(), null);
  assert.doesNotThrow(() => store.clear());
});

test("a new entry form has unsaved work once any field has text", () => {
  assert.equal(hasUnsavedWork(EMPTY_FORM, EMPTY_FORM), false);
  assert.equal(hasUnsavedWork({ ...EMPTY_FORM, place: "ភ្នំពេញ" }, EMPTY_FORM), true);
  assert.equal(hasUnsavedWork({ ...EMPTY_FORM, year: "2024" }, EMPTY_FORM), true);
});

test("an edit has unsaved work only where it differs from the stored entry", () => {
  const stored = { ...EMPTY_FORM, title: "សំពត់ហូល", story: "រឿង", year: "2023" };
  assert.equal(hasUnsavedWork({ ...stored }, stored), false);
  assert.equal(hasUnsavedWork({ ...stored, story: "រឿង " }, stored), true);
  assert.equal(hasUnsavedWork({ ...stored, year: "" }, stored), true);
});

test("a draft kept on one page is announced once, on the next page", () => {
  const storage = fakeStorage();
  flagDraftKept(() => storage, 1_000);
  assert.equal(takeDraftKeptFlag(() => storage, 2_000), true);
  assert.equal(takeDraftKeptFlag(() => storage, 2_001), false);
});

test("nothing is announced when no draft was kept", () => {
  assert.equal(takeDraftKeptFlag(() => fakeStorage(), 2_000), false);
});

test("an old flag is not announced: the Contributor went somewhere else first", () => {
  const storage = fakeStorage();
  flagDraftKept(() => storage, 1_000);
  assert.equal(takeDraftKeptFlag(() => storage, 1_000 + 10_000), true);
  flagDraftKept(() => storage, 1_000);
  assert.equal(takeDraftKeptFlag(() => storage, 1_000 + 10_001), false);
});

test("a flag that is not a time is not announced", () => {
  const storage = fakeStorage();
  for (const raw of ["", "soon", "-5", "99999999999999"]) {
    storage.setItem("draft-kept-at", raw);
    assert.equal(takeDraftKeptFlag(() => storage, 2_000), false, raw);
  }
});

test("blocked session storage never throws", () => {
  const blocked = () => { throw new DOMException("The operation is insecure.", "SecurityError"); };
  assert.doesNotThrow(() => flagDraftKept(blocked));
  assert.equal(takeDraftKeptFlag(blocked), false);
});
