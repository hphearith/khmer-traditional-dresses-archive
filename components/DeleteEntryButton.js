"use client";

import { useEffect, useRef, useState } from "react";
import { combined } from "../lib/bilingual.js";
import { TEXT } from "../lib/uiText.js";
import { useDeleteEntry } from "../lib/useDeleteEntry.js";
import Bilingual from "./Bilingual.js";

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
        aria-label={`${combined(TEXT.card.delete)}: ${title}`} onClick={() => setConfirming(true)}>
        <Bilingual text={TEXT.card.delete} inline />
      </button>
    );
  }

  return (
    <div className="entry-confirm" role="group" aria-label={`${combined(TEXT.card.confirmGroup)}: ${title}`}>
      <p><Bilingual text={TEXT.card.confirmQuestion} /></p>
      <div className="entry-confirm-actions">
        <button type="button" className="button" onClick={deleteEntry} disabled={pending}>
          <Bilingual text={pending ? TEXT.card.deleting : TEXT.card.deleteForGood} inline />
        </button>
        <button ref={cancelButton} type="button" className="button secondary" onClick={cancel} disabled={pending}>
          <Bilingual text={TEXT.card.cancel} inline />
        </button>
      </div>
      {error && <p role="alert" className="entry-confirm-error"><Bilingual text={error} /></p>}
    </div>
  );
}
