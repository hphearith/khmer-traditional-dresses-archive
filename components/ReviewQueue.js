"use client";

import { useState } from "react";
import { waitingEntries } from "../lib/review.js";
import { TEXT, decisionDoneText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import ReviewQueueCard from "./ReviewQueueCard.js";

// The Review queue's cards. An entry leaves only when the database confirmed
// the decision (ReviewDecisionButtons calls onDecided then). The live line sits
// outside the cards, so it survives the card it talks about; the next success
// replaces it. Each entry in entries carries its "Submitted <date>" pair,
// worked out on the server (submittedText), so the browser never disagrees.
// Switching the Interface language refreshes entries without loading the page
// again, so a decided entry is remembered with the updated_at it was decided at
// (waitingEntries): a resubmitted entry comes back, a stale copy does not.
export default function ReviewQueue({ entries }) {
  const [decided, setDecided] = useState([]);
  const [done, setDone] = useState(null);
  const waiting = waitingEntries(entries, decided);

  function onDecided(entry, decision) {
    setDecided((list) => [...list, { id: entry.id, updated_at: entry.updated_at }]);
    // The key makes two decisions with the same title read out twice.
    setDone({ key: entry.id, text: decisionDoneText(decision, entry.title) });
  }

  return (
    <>
      <div role="status" aria-live="polite">
        {done && <p key={done.key} style={{ marginBottom: 24 }}><Bilingual text={done.text} /></p>}
      </div>
      {waiting.length === 0 ? (
        <div className="empty">
          <h2><Bilingual text={TEXT.review.queue.empty} /></h2>
        </div>
      ) : (
        <div className="grid">
          {waiting.map((entry) => (
            <ReviewQueueCard key={entry.id} entry={entry} submitted={entry.submitted} onDecided={onDecided} />
          ))}
        </div>
      )}
    </>
  );
}
