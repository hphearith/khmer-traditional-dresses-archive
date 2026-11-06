"use client";

import { combined } from "../lib/bilingual.js";
import { TEXT } from "../lib/uiText.js";
import { useReviewDecision } from "../lib/useReviewDecision.js";
import Bilingual from "./Bilingual.js";

// Publish and Return for one Pending entry. Both are disabled while a decision
// is on its way. If the database did not make it, the entry stays and says so.
export default function ReviewDecisionButtons({ entry, onDecided }) {
  const { sending, failed, decide } = useReviewDecision(entry, onDecided);

  return (
    <>
      <div className="entry-actions">
        <button type="button" className="button" disabled={sending} onClick={() => decide("published")}
          aria-label={`${combined(TEXT.review.queue.publish)}: ${entry.title}`}>
          <Bilingual text={TEXT.review.queue.publish} inline />
        </button>
        <button type="button" className="button secondary" disabled={sending} onClick={() => decide("returned")}
          aria-label={`${combined(TEXT.review.queue.return)}: ${entry.title}`}>
          <Bilingual text={TEXT.review.queue.return} inline />
        </button>
      </div>
      {failed && <p role="alert" className="entry-confirm-error"><Bilingual text={TEXT.review.queue.decisionFailed} /></p>}
    </>
  );
}
