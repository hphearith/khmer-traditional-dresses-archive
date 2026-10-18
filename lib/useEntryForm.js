"use client";

import { useState } from "react";
import { changeWasSaved, entryColumns, validateEntry } from "./entry.js";
import { validatePhoto, validatePhotoChange } from "./photo.js";
import { removePhoto, removePhotoWithin, uploadPhoto } from "./photoStorage.js";
import { saveFailure, startSaveDeadline } from "./saveDeadline.js";
import { createClient } from "./supabase/client.js";
import { TEXT, entryMessageText, photoFailureText, photoMessageText, saveFailureText } from "./uiText.js";

// In the order they appear on the form, so focus goes to the first problem.
const FIELDS = ["title", "story", "photo", "consent", "credited_as", "occasion", "year", "maker", "place", "materials"];
// Which fields are about the photo, so their messages come from lib/photo.js.
const PHOTO_FIELDS = ["photo", "consent"];

// Long enough for a slow phone connection, short enough that a dead one is reported.
const SAVE_DEADLINE_MS = 15000;

// With an entryId the form edits that entry; photoPath is the path of the photo
// it holds now, which a replacement removes once the edit is saved. Without an
// entryId it creates a new entry, and its photo is required. onSaved is called
// once the entry is known to be saved, before the browser leaves the form.
export function useEntryForm({ entryId = null, photoPath = null, onSaved = () => {} } = {}) {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setFormError(null);

    // Nothing is sent until every field passes.
    const photo = fields.get("photo");
    const checked = validateEntry(Object.fromEntries(FIELDS.map((field) => [field, fields.get(field)])));
    const photoInput = { file: photo, consent: fields.get("consent") === "on" };
    const photoChecked = entryId ? validatePhotoChange(photoInput) : validatePhoto(photoInput);
    if (!checked.ok || !photoChecked.ok) {
      const reasons = { ...checked.errors, ...photoChecked.errors };
      const invalid = FIELDS.filter((field) => reasons[field]);
      const messageFor = (field) => (PHOTO_FIELDS.includes(field) ? photoMessageText : entryMessageText)(field, reasons[field]);
      setErrors(Object.fromEntries(invalid.map((field) => [field, messageFor(field)])));
      form.elements.namedItem(invalid[0])?.focus();
      return;
    }
    // A new entry always has a photo to upload. An edit has one only when a new
    // file was chosen; otherwise the stored photo is left exactly as it is.
    const replacing = !entryId || photoChecked.replace;
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
        setFormError(TEXT.form.signedOut);
        setPending(false);
        return;
      }

      // The photo goes first, because the entry must hold its path. The upload
      // cannot be cancelled: if the deadline passes first, the file is removed
      // as soon as it lands, since the entry will not be saved.
      if (replacing) {
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
      // only the owner change it (supabase/entries-edit.sql). An edit sends
      // photo_path only with a replacement photo, so it can never be cleared
      // (the column is not null, supabase/photos.sql, and this is the only
      // update that may write it, supabase/photos-replace.sql).
      const columns = entryColumns(checked.entry);
      const request = entryId
        ? supabase.from("entries").update(uploadedPath ? { ...columns, photo_path: uploadedPath } : columns)
            .eq("id", entryId).select("id")
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
        // The database answered, so the entry still holds its old photo and the
        // new file is not used by anything.
        if (uploadedPath) await removePhotoWithin(deadline, supabase, uploadedPath);
        throw saveFailure("not-saved");
      }

      // Saved: the unsaved copy of the text kept in this browser must not come back.
      onSaved();

      // The edit is saved with its new photo, so the old file is no longer used.
      // removePhotoWithin logs a failure (clean up by hand: see
      // agent_docs/removing_account_photos.md). The edit is saved, so that is
      // what the Contributor is told; nothing claims the old file went.
      if (uploadedPath && photoPath) await removePhotoWithin(deadline, supabase, photoPath);

      // Stays pending while the browser leaves, so the entry cannot be sent twice.
      window.location.assign("/?tab=community");
    } catch (error) {
      console.error(uploading ? "Uploading the photo failed:" : "Saving the entry failed:", error);
      setFormError(uploading ? photoFailureText(error) : saveFailureText(error));
      setPending(false);
    } finally {
      deadline.clear();
    }
  }

  return { pending, errors, formError, handleSubmit };
}
