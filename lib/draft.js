import { WRITABLE_COLUMNS } from "./entry.js";

// A Local draft (CONTEXT.md): a Contributor's unsaved work on an entry form, kept
// in this browser only (localStorage). Nothing here talks to the database, and
// a Local draft is not the Draft stage of a saved Contributor entry.

// Where a Local draft is kept. One key per account, and per entry being edited, so a
// new-entry draft and an edit draft never overwrite each other, and a second
// account on the same device never sees the first one's text.
export function draftKey({ userId, entryId = null }) {
  return entryId ? `draft:${userId}:edit:${entryId}` : `draft:${userId}:new`;
}

// The only things a Local draft holds: the entry's text fields and year, as the
// form shows them (the same fields an entry is saved with). Never the photo (a
// file) or the consent box (given again at each save).
export const DRAFT_FIELDS = WRITABLE_COLUMNS;

// The form with nothing typed in it.
export const EMPTY_FORM = Object.fromEntries(DRAFT_FIELDS.map((field) => [field, ""]));

// Whatever is in storage may be old, edited by hand or from another version of
// the site, so only text under a known field name is trusted. null: no draft.
function readDraft(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) return null;
  const values = Object.fromEntries(DRAFT_FIELDS.filter((field) => typeof data[field] === "string").map((field) => [field, data[field]]));
  return Object.keys(values).length > 0 ? values : null;
}

// getStorage returns the browser's Storage (window.localStorage). It is a
// function because merely reading localStorage can throw when it is blocked.
// Storage can also be full or refuse writes. None of that may break the form,
// so nothing here throws: load gives no draft, clear does nothing, and save
// answers false, which is how the form knows not to say "Local draft saved".
export function openDraftStore(getStorage, key) {
  function attempt(action, fallback) {
    try {
      return action(getStorage());
    } catch {
      return fallback;
    }
  }

  return {
    load() {
      const raw = attempt((storage) => storage.getItem(key), null);
      return raw === null ? null : readDraft(raw);
    },
    save(values) {
      return attempt((storage) => {
        storage.setItem(key, JSON.stringify(values));
        return true;
      }, false);
    },
    clear() {
      attempt((storage) => storage.removeItem(key), undefined);
    },
  };
}

// Whether the form holds anything the Contributor would lose. baseline is what
// the form starts with: empty for a new entry, the stored values for an edit.
// An untouched form, or an edit changed back to what is stored, needs no draft.
// Text is compared exactly as typed; a field missing from values counts as empty.
export function hasUnsavedWork(values, baseline) {
  return DRAFT_FIELDS.some((field) => (values[field] ?? "") !== (baseline[field] ?? ""));
}
