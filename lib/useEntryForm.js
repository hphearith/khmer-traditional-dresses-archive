"use client";

import { useState } from "react";
import { changeWasSaved, entryColumns, getEntryMessage, getSaveFailureMessage, validateEntry } from "./entry.js";
import { getPhotoFailureMessage, getPhotoMessage, validatePhoto } from "./photo.js";
import { removePhoto, uploadPhoto } from "./photoStorage.js";
import { saveFailure, startSaveDeadline } from "./saveDeadline.js";
import { createClient } from "./supabase/client.js";

// In the order they appear on the form, so focus goes to the first problem.
const FIELDS = ["title", "story", "photo", "consent", "credited_as", "occasion", "year", "maker", "place", "materials"];
// Only a new entry has them: replacing a photo is a later ticket.
const PHOTO_FIELDS = ["photo", "consent"];

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
    const photo = fields.get("photo");
    const checked = validateEntry(Object.fromEntries(FIELDS.map((field) => [field, fields.get(field)])));
    const photoChecked = entryId ? { ok: true } : validatePhoto({ file: photo, consent: fields.get("consent") === "on" });
    if (!checked.ok || !photoChecked.ok) {
      const reasons = { ...checked.errors, ...photoChecked.errors };
      const invalid = FIELDS.filter((field) => reasons[field]);
      const messageFor = (field) => (PHOTO_FIELDS.includes(field) ? getPhotoMessage : getEntryMessage)(field, reasons[field]);
      setErrors(Object.fromEntries(invalid.map((field) => [field, messageFor(field)])));
      form.elements.namedItem(invalid[0])?.focus();
      return;
    }
    setErrors({});
    setPending(true);

    const deadline = startSaveDeadline(SAVE_DEADLINE_MS);
    let supabase = null;
    let uploadedPath = null;
    let uploading = false;
    try {
      // Offline: say so at once instead of waiting for requests that cannot work.
      if (navigator.onLine === false) throw saveFailure("offline");
      supabase = createClient();
      // The owner comes from the signed-in session, never from the form. The
      // database checks it again (owner must equal auth.uid()), so a forged
      // id is refused even if this code is bypassed.
      const { data: { session } } = await deadline.race(supabase.auth.getSession());
      if (!session) {
        setFormError(SIGNED_OUT);
        setPending(false);
        return;
      }

      // The photo goes first, because the entry must hold its path. The upload
      // cannot be cancelled: if the deadline passes first, the file is removed
      // as soon as it lands, since the entry will not be saved.
      if (!entryId) {
        uploading = true;
        const upload = uploadPhoto(supabase, session.user.id, photo);
        try {
          uploadedPath = await deadline.race(upload);
        } catch (failure) {
          upload.then((path) => removePhoto(supabase, path), () => {});
          throw failure;
        }
        uploading = false;
      }

      // Every column is named by entryColumns(), so nothing else from the form
      // reaches the table. A new entry takes its owner from the session. An edit
      // names the entry by id alone and never sends an owner: the database lets
      // only the owner change it (supabase/entries-edit.sql).
      const columns = entryColumns(checked.entry);
      const request = entryId
        ? supabase.from("entries").update(columns).eq("id", entryId).select("id")
        : supabase.from("entries").insert({ owner: session.user.id, photo_path: uploadedPath, ...columns });
      const { data: rows, error } = await request.abortSignal(deadline.signal);
      // An aborted request comes back as an ordinary error; report it as what it is.
      if (error) {
        // Only an answer from the database (it has an error code) proves the entry
        // was not saved. After a timeout or a dropped connection it may have been,
        // and a photo removed from a saved entry would leave it broken.
        if (uploadedPath && error.code && !deadline.signal.aborted) await removePhoto(supabase, uploadedPath);
        throw deadline.signal.aborted ? saveFailure("timeout") : error;
      }
      // A refused edit is not an error: it comes back with no row. Never say "saved" for it.
      if (entryId && !changeWasSaved(rows)) {
        console.error(`The update of entry ${entryId} changed no row`);
        throw saveFailure("not-saved");
      }

      // Stays pending while the browser leaves, so the entry cannot be sent twice.
      window.location.assign("/?tab=community");
    } catch (error) {
      console.error(uploading ? "Uploading the photo failed:" : "Saving the entry failed:", error);
      setFormError(uploading ? getPhotoFailureMessage(error) : getSaveFailureMessage(error));
      setPending(false);
    } finally {
      deadline.clear();
    }
  }

  return { pending, errors, formError, handleSubmit };
}
