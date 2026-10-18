"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changeWasSaved } from "./entry.js";
import { removePhotoWithin } from "./photoStorage.js";
import { saveFailure, startSaveDeadline } from "./saveDeadline.js";
import { createClient } from "./supabase/client.js";
import { TEXT, deleteFailureText } from "./uiText.js";

// Same deadline as a save: a dead connection is reported, not waited on.
const DELETE_DEADLINE_MS = 15000;

// Deletes one entry by id. The entry is reported gone only when the database
// handed back the deleted row: a refused delete is not an error, it just
// matches no row (see changeWasSaved in lib/entry.js).
export function useDeleteEntry(entryId) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [error, setError] = useState(null);
  const pending = deleting || refreshing;

  async function deleteEntry() {
    if (pending) return;
    setError(null);
    setDeleting(true);

    const deadline = startSaveDeadline(DELETE_DEADLINE_MS);
    try {
      if (navigator.onLine === false) throw saveFailure("offline");
      const supabase = createClient();
      const { data: { session } } = await deadline.race(supabase.auth.getSession());
      if (!session) {
        setError(TEXT.card.signedOut);
        setDeleting(false);
        return;
      }

      // The id alone names the entry. The database lets only the owner delete
      // it (supabase/entries-delete.sql), whatever this code sends. The deleted
      // row comes back with its photo path, which is the file to remove next.
      const { data: rows, error: deleteError } = await supabase
        .from("entries")
        .delete()
        .eq("id", entryId)
        .select("id, photo_path")
        .abortSignal(deadline.signal);
      if (deleteError) throw deadline.signal.aborted ? saveFailure("timeout") : deleteError;
      if (!changeWasSaved(rows)) {
        console.error(`The delete of entry ${entryId} removed no row`);
        throw saveFailure("not-saved");
      }

      // The entry is gone for good, so the file goes too. Done after the row,
      // so a failure here can only leave a stray file, never an entry without
      // its photo. removePhotoWithin logs a failure (clean up by hand: see
      // agent_docs/removing_account_photos.md); the entry itself is deleted, so
      // that is what the Contributor is told, and nothing claims the file went.
      await removePhotoWithin(deadline, supabase, rows[0].photo_path);

      // Read the Community tab again so the entry leaves it and My entries.
      // The transition keeps the buttons disabled until the fresh list has
      // arrived; if this card is still there after that, it is usable again.
      startRefresh(() => router.refresh());
      setDeleting(false);
    } catch (failure) {
      console.error("Deleting the entry failed:", failure);
      setError(deleteFailureText(failure));
      setDeleting(false);
    } finally {
      deadline.clear();
    }
  }

  return { pending, error, deleteEntry, clearError: () => setError(null) };
}
