"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changeWasSaved, getDeleteFailureMessage } from "./entry.js";
import { saveFailure, startSaveDeadline } from "./saveDeadline.js";
import { createClient } from "./supabase/client.js";

// Same deadline as a save: a dead connection is reported, not waited on.
const DELETE_DEADLINE_MS = 15000;

const SIGNED_OUT = "You are no longer logged in. Log in again, then try once more.";

// Deletes one entry by id. The entry is reported gone only when the database
// handed back the deleted row: a refused delete is not an error, it just
// matches no row (see changeWasSaved in lib/entry.js).
export function useDeleteEntry(entryId) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [error, setError] = useState("");
  const pending = deleting || refreshing;

  async function deleteEntry() {
    if (pending) return;
    setError("");
    setDeleting(true);

    const deadline = startSaveDeadline(DELETE_DEADLINE_MS);
    try {
      if (navigator.onLine === false) throw saveFailure("offline");
      const supabase = createClient();
      const { data: { session } } = await deadline.race(supabase.auth.getSession());
      if (!session) {
        setError(SIGNED_OUT);
        setDeleting(false);
        return;
      }

      // The id alone names the entry. The database lets only the owner delete
      // it (supabase/entries-delete.sql), whatever this code sends.
      const { data: rows, error: deleteError } = await supabase
        .from("entries")
        .delete()
        .eq("id", entryId)
        .select("id")
        .abortSignal(deadline.signal);
      if (deleteError) throw deadline.signal.aborted ? saveFailure("timeout") : deleteError;
      if (!changeWasSaved(rows)) {
        console.error(`The delete of entry ${entryId} removed no row`);
        throw saveFailure("not-saved");
      }

      // Read the Community tab again so the entry leaves it and My entries.
      // The transition keeps the buttons disabled until the fresh list has
      // arrived; if this card is still there after that, it is usable again.
      startRefresh(() => router.refresh());
      setDeleting(false);
    } catch (failure) {
      console.error("Deleting the entry failed:", failure);
      setError(getDeleteFailureMessage(failure));
      setDeleting(false);
    } finally {
      deadline.clear();
    }
  }

  return { pending, error, deleteEntry, clearError: () => setError("") };
}
