"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DRAFT_FIELDS, draftKey, hasUnsavedWork, openDraftStore } from "./draft.js";

const EMPTY_FORM = Object.fromEntries(DRAFT_FIELDS.map((field) => [field, ""]));

// Keeps the entry form's text in this browser as the Contributor types, and
// brings it back when the same form is opened again (rules: lib/draft.js).
// initial is what the form starts with (empty on a new entry, the stored values
// on an edit). Returns:
//   values      what the text fields should start from: initial, or a restored draft
//   restoreKey  changes when a draft is restored, so the fields start over from values
//   status      null, "restored" or "saved"; null too when storage is blocked
//   handleChange  goes on the form's onChange
//   clear       call once the entry is saved, so the draft never comes back
export function useEntryDraft({ userId, entryId = null, initial = {} }) {
  const key = draftKey({ userId, entryId });
  // window is read only when a method runs, in the browser, never while rendering.
  const store = useMemo(() => openDraftStore(() => window.localStorage, key), [key]);
  const baseline = { ...EMPTY_FORM, ...initial };
  const [restored, setRestored] = useState(null);
  const [status, setStatus] = useState(null);
  const finished = useRef(false);

  // After mount, because storage does not exist on the server.
  useEffect(() => {
    const draft = store.load();
    if (!draft) return;
    const values = { ...baseline, ...draft };
    // A draft that matches the form already is leftover: drop it.
    if (!hasUnsavedWork(values, baseline)) return store.clear();
    setRestored(values);
    setStatus("restored");
  }, [store]);

  function handleChange(event) {
    const form = event.currentTarget;
    // useLimitedText may refuse this edit, and it puts the old text back only
    // after the event. Read the form once the page has settled, so a refused
    // paste is never saved.
    setTimeout(() => {
      if (finished.current) return;
      const fields = new FormData(form);
      const values = Object.fromEntries(DRAFT_FIELDS.map((field) => [field, fields.get(field) ?? ""]));
      if (!hasUnsavedWork(values, baseline)) {
        store.clear();
        setStatus(null);
      } else {
        setStatus(store.save(values) ? "saved" : null);
      }
    }, 0);
  }

  function clear() {
    finished.current = true;
    store.clear();
  }

  return { values: restored ?? baseline, restoreKey: restored ? "restored" : "stored", status, handleChange, clear };
}
