"use client";

import { useEffect, useRef, useState } from "react";
import { combined } from "../lib/bilingual.js";
import { TEXT } from "../lib/uiText.js";
import { useReviewDecision } from "../lib/useReviewDecision.js";
import Bilingual from "./Bilingual.js";
import ReturnNoteForm from "./ReturnNoteForm.js";

// Publish and Return for one Pending entry. Publish sends at once, with no note.
// Return opens the Return note box instead, and Publish and Return are not
// offered while it is open; Send back in the box makes the Return. Every button
// is disabled while a decision is on its way. If the database did not make it,
// the entry stays and says so, and an open box keeps its text.
export default function ReviewDecisionButtons({ entry, onDecided }) {
  const { sending, failed, decide } = useReviewDecision(entry, onDecided);
  const [writing, setWriting] = useState(false);
  const returnButton = useRef(null);
  const wasWriting = useRef(false);

  // Focus goes back to Return when the box is cancelled.
  useEffect(() => {
    if (!writing && wasWriting.current) returnButton.current?.focus();
    wasWriting.current = writing;
  }, [writing]);

  return (
    <>
      {writing ? (
        <ReturnNoteForm entry={entry} sending={sending}
          onSend={(note) => decide("returned", note)} onCancel={() => setWriting(false)} />
      ) : (
        <div className="entry-actions">
          <button type="button" className="button" disabled={sending} onClick={() => decide("published")}
            aria-label={`${combined(TEXT.review.queue.publish)}: ${entry.title}`}>
            <Bilingual text={TEXT.review.queue.publish} inline />
          </button>
          <button ref={returnButton} type="button" className="button secondary" disabled={sending} onClick={() => setWriting(true)}
            aria-label={`${combined(TEXT.review.queue.return)}: ${entry.title}`}>
            <Bilingual text={TEXT.review.queue.return} inline />
          </button>
        </div>
      )}
      {failed && <p role="alert" className="entry-confirm-error"><Bilingual text={TEXT.review.queue.decisionFailed} /></p>}
    </>
  );
}
