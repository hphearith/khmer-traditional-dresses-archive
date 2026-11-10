"use client";

import { useEffect, useRef, useState } from "react";
import { pick } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";
import { RETURN_NOTE_LIMIT, checkReturnNote } from "../lib/returnNote.js";
import { TEXT, characterCountText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// The box a Reviewer writes a Return note in, on one Pending card. Only
// checkReturnNote decides whether Send back is offered, so the screen judges a
// note the way review_entry does. There is deliberately no maxLength: the
// browser counts UTF-16 units and the spaces that get trimmed off, so it would
// refuse notes the database accepts. The counter counts as checkReturnNote does.
// The typed text lives only in this box: Cancel closes it and the text is gone
// (it is not a Local draft). onSend(note) gets the trimmed note.
// While sending, the text is read-only and both buttons are disabled; after a
// failure the box stays open with the text as typed.
export default function ReturnNoteForm({ entry, sending, onSend, onCancel }) {
  const language = useLanguage();
  const [text, setText] = useState("");
  const box = useRef(null);
  const check = checkReturnNote(text);
  const id = `return-note-${entry.id}`;

  useEffect(() => { box.current?.focus(); }, []);

  function send(event) {
    event.preventDefault();
    if (check.ok && !sending) onSend(check.note);
  }

  return (
    <form className="entry-confirm return-note-form" onSubmit={send}
      aria-label={`${pick(TEXT.review.note.name, language)}: ${entry.title}`}>
      <label htmlFor={id} className="return-note-heading"><Bilingual text={TEXT.review.note.name} /></label>
      <textarea ref={box} id={id} rows={5} value={text} readOnly={sending}
        onChange={(event) => setText(event.target.value)} aria-describedby={`${id}-hint ${id}-count`} />
      <p id={`${id}-hint`} className="return-note-hint"><Bilingual text={TEXT.review.note.hint} /></p>
      <p id={`${id}-count`} className="return-note-hint">
        <Bilingual text={characterCountText(check.count, RETURN_NOTE_LIMIT)} />
      </p>
      <div className="entry-confirm-actions">
        <button type="submit" className="button" disabled={sending || !check.ok}
          aria-label={`${pick(TEXT.review.note.sendBack, language)}: ${entry.title}`}>
          <Bilingual text={TEXT.review.note.sendBack} inline />
        </button>
        <button type="button" className="button secondary" onClick={onCancel} disabled={sending}>
          <Bilingual text={TEXT.card.cancel} inline />
        </button>
      </div>
    </form>
  );
}
