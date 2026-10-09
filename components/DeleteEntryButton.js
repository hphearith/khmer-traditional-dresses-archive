"use client";

import { useEffect, useRef, useState } from "react";
import { useDeleteEntry } from "../lib/useDeleteEntry.js";

// Delete asks first. Cancel is focused, so Enter on the question never deletes,
// and focus returns to Delete when the question is dismissed.
export default function DeleteEntryButton({ entryId, title }) {
  const [confirming, setConfirming] = useState(false);
  const { pending, error, deleteEntry, clearError } = useDeleteEntry(entryId);
  const deleteButton = useRef(null);
  const cancelButton = useRef(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (confirming) cancelButton.current?.focus();
    else if (wasConfirming.current) deleteButton.current?.focus();
    wasConfirming.current = confirming;
  }, [confirming]);

  function cancel() {
    clearError();
    setConfirming(false);
  }

  if (!confirming) {
    return (
      <button ref={deleteButton} type="button" className="button secondary"
        aria-label={`Delete: ${title}`} onClick={() => setConfirming(true)}>
        Delete
      </button>
    );
  }

  return (
    <div className="entry-confirm" role="group" aria-label={`Confirm deleting: ${title}`}>
      <p>Delete this entry for good? This cannot be undone.</p>
      <div className="entry-confirm-actions">
        <button type="button" className="button" onClick={deleteEntry} disabled={pending}>
          {pending ? "Deleting…" : "Delete for good"}
        </button>
        <button ref={cancelButton} type="button" className="button secondary" onClick={cancel} disabled={pending}>
          Cancel
        </button>
      </div>
      {error && <p role="alert" className="entry-confirm-error">{error}</p>}
    </div>
  );
}
