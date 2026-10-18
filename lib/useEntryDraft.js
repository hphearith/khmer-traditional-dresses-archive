"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DRAFT_FIELDS, DRAFT_KEPT_EVENT, EMPTY_FORM, draftKey, flagDraftKept, hasUnsavedWork, openDraftStore } from "./draft.js";

// Keeps the entry form's text in this browser as a Local draft while the Contributor types, and
// brings it back when the same form is opened again (rules: lib/draft.js).
// initial is what the form starts with (empty on a new entry, the stored values
// on an edit). Returns:
//   values      what the text fields should start from: initial, or a restored draft
//   restoreKey  changes when a draft is restored, so the fields start over from values
//   restored    true when a Local draft was brought back into the form
//   handleChange  goes on the form's onChange and onCompositionEnd: the second one
//               catches a Khmer syllable that useLimitedText takes back at its end,
//               which fires no change, so the text over the limit is never kept
//   onSaved     call once the entry is saved, so the Local draft never comes back
export function useEntryDraft({ userId, entryId = null, initial = {} }) {
  const key = draftKey({ userId, entryId });
  // window is read only when a method runs, in the browser, never while rendering.
  const store = useMemo(() => openDraftStore(() => window.localStorage, key), [key]);
  const baseline = { ...EMPTY_FORM, ...initial };
  const [restored, setRestored] = useState(null);
  // Whether a Local draft is on this device because of this form (never when storage is blocked).
  const kept = useRef(false);
  const saved = useRef(false);

  // Leaving the form with a Local draft kept: the site says "Draft saved"
  // (components/DraftToast.js). Not after a save, which clears the draft.
  // Most ways out load a new page (the links to the forms are plain links, and
  // so are the browser's Back button and a reload): pagehide leaves a note for
  // the next page to pick up. Leaving by a link inside Next.js closes this
  // component without unloading the page: the cleanup tells the popup directly.
  useEffect(() => {
    const leaving = () => kept.current && !saved.current;
    const handlePageHide = () => leaving() && flagDraftKept(() => window.sessionStorage);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      if (leaving()) window.dispatchEvent(new Event(DRAFT_KEPT_EVENT));
    };
  }, []);

  // After mount, because storage does not exist on the server.
  useEffect(() => {
    const draft = store.load();
    if (!draft) return;
    const values = { ...baseline, ...draft };
    // A draft that matches the form already is leftover: drop it.
    if (!hasUnsavedWork(values, baseline)) return store.clear();
    setRestored(values);
    kept.current = true;
  }, [store]);

  function handleChange(event) {
    const form = event.currentTarget;
    // useLimitedText may refuse this edit, and it puts the old text back only
    // after the event. Read the form once the page has settled, so a refused
    // paste is never saved.
    setTimeout(() => {
      if (saved.current) return;
      const fields = new FormData(form);
      const values = Object.fromEntries(DRAFT_FIELDS.map((field) => [field, fields.get(field) ?? ""]));
      if (!hasUnsavedWork(values, baseline)) {
        store.clear();
        kept.current = false;
      } else {
        kept.current = store.save(values);
      }
    }, 0);
  }

  function onSaved() {
    saved.current = true;
    kept.current = false;
    store.clear();
  }

  return { values: restored ?? baseline, restoreKey: restored ? "restored" : "stored", restored: restored !== null, handleChange, onSaved };
}
