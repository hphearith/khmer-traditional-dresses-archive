"use client";

import { useState } from "react";
import { changeWasSaved, entryColumns, getEntryMessage, getSaveFailureMessage, validateEntry } from "./entry.js";
import { saveFailure, startSaveDeadline } from "./saveDeadline.js";
import { createClient } from "./supabase/client.js";

// In the order they appear on the form, so focus goes to the first problem.
const FIELDS = ["title", "story", "credited_as", "occasion", "year", "maker", "place", "materials"];

// Long enough for a slow phone connection, short enough that a dead one is reported.
const SAVE_DEADLINE_MS = 15000;

const SIGNED_OUT = "You are no longer logged in. Copy your text somewhere safe, log in again, then try once more.";

// With an entryId the form edits that entry; without one it creates a new entry.
export function useEntryForm({ entryId = null } = {}) {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setFormError("");

    // Nothing is sent until every field passes.
    const checked = validateEntry(Object.fromEntries(FIELDS.map((field) => [field, fields.get(field)])));
    if (!checked.ok) {
      const invalid = FIELDS.filter((field) => checked.errors[field]);
      setErrors(Object.fromEntries(invalid.map((field) => [field, getEntryMessage(field, checked.errors[field])])));
      form.elements.namedItem(invalid[0])?.focus();
      return;
    }
    setErrors({});
    setPending(true);

    const deadline = startSaveDeadline(SAVE_DEADLINE_MS);
    try {
      // Offline: say so at once instead of waiting for requests that cannot work.
      if (navigator.onLine === false) throw saveFailure("offline");
      const supabase = createClient();
      // The owner comes from the signed-in session, never from the form. The
      // database checks it again (owner must equal auth.uid()), so a forged
      // id is refused even if this code is bypassed.
      const { data: { session } } = await deadline.race(supabase.auth.getSession());
      if (!session) {
        setFormError(SIGNED_OUT);
        setPending(false);
        return;
      }

      // Every column is named by entryColumns(), so nothing else from the form
      // reaches the table. A new entry takes its owner from the session. An edit
      // names the entry by id alone and never sends an owner: the database lets
      // only the owner change it (supabase/entries-edit.sql).
      const columns = entryColumns(checked.entry);
      const request = entryId
        ? supabase.from("entries").update(columns).eq("id", entryId).select("id")
        : supabase.from("entries").insert({ owner: session.user.id, ...columns });
      const { data: rows, error } = await request.abortSignal(deadline.signal);
      // An aborted request comes back as an ordinary error; report it as what it is.
      if (error) throw deadline.signal.aborted ? saveFailure("timeout") : error;
      // A refused edit is not an error: it comes back with no row. Never say "saved" for it.
      if (entryId && !changeWasSaved(rows)) {
        console.error(`The update of entry ${entryId} changed no row`);
        throw saveFailure("not-saved");
      }

      // Stays pending while the browser leaves, so the entry cannot be sent twice.
      window.location.assign("/?tab=community");
    } catch (error) {
      console.error("Saving the entry failed:", error);
      setFormError(getSaveFailureMessage(error));
      setPending(false);
    } finally {
      deadline.clear();
    }
  }

  return { pending, errors, formError, handleSubmit };
}
