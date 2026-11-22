"use client";

import { useEffect, useRef, useState } from "react";
import { pick } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT, namedEntryText } from "../lib/uiText.js";
import { useDeleteEntry } from "../lib/useDeleteEntry.js";
import Bilingual from "./Bilingual.js";

// Delete asks first. The question floats over the card's own Edit and Delete
// row (delete-confirm in globals.css), so opening it never moves the cards
// around it. Cancel is focused, so Enter on the question never deletes.
// Escape or a click outside the question also cancels, and focus returns to Delete.
export default function DeleteEntryButton({ entryId, title }) {
  const language = useLanguage();
  const [confirming, setConfirming] = useState(false);
  const { pending, error, deleteEntry, clearError } = useDeleteEntry(entryId);
  const deleteButton = useRef(null);
  const cancelButton = useRef(null);
  const panel = useRef(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (confirming) cancelButton.current?.focus();
    else if (wasConfirming.current) deleteButton.current?.focus();
    wasConfirming.current = confirming;
  }, [confirming]);

  function cancel() {
    if (pending) return;
    clearError();
    setConfirming(false);
  }

  // A click anywhere outside the question cancels it.
  useEffect(() => {
    if (!confirming) return undefined;
    function onPointerDown(event) {
      if (!panel.current?.contains(event.target)) cancel();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  return (
    <>
      <button ref={deleteButton} type="button" className="button secondary" aria-expanded={confirming}
        aria-label={pick(namedEntryText(TEXT.card.delete, title), language)} onClick={() => setConfirming(true)}>
        <Bilingual text={TEXT.card.delete} inline />
      </button>
      {confirming && (
        <div ref={panel} className="entry-confirm delete-confirm" role="group"
          aria-label={pick(namedEntryText(TEXT.card.confirmGroup, title), language)}
          onKeyDown={(event) => event.key === "Escape" && cancel()}>
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
      )}
    </>
  );
}
