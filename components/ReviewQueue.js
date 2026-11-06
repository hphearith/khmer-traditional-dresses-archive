"use client";

import { useState } from "react";
import { TEXT, decisionDoneText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import ReviewQueueCard from "./ReviewQueueCard.js";

// The Review queue's cards. An entry leaves only when the database confirmed
// the decision (ReviewDecisionButtons calls onDecided then). The live line sits
// outside the cards, so it survives the card it talks about; the next success
// replaces it. Each entry in entries carries its "Submitted <date>" pair,
// worked out on the server (submittedText), so the browser never disagrees.
export default function ReviewQueue({ entries }) {
  const [decidedIds, setDecidedIds] = useState([]);
  const [done, setDone] = useState(null);
  const waiting = entries.filter((entry) => !decidedIds.includes(entry.id));

  function onDecided(entry, decision) {
    setDecidedIds((ids) => [...ids, entry.id]);
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
