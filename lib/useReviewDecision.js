"use client";

import { useState } from "react";
import { decideOnEntry } from "./review.js";
import { createClient } from "./supabase/client.js";

// Sends a Reviewer's decision on one entry. onDecided runs only when the
// database confirmed it (decideOnEntry answered true): the caller then takes
// the card away. On any other answer, or a thrown error, the card stays and the
// buttons come back with failed set. While a decision is on its way, sending
// is true, so the card's buttons are disabled and a second press does nothing.
// A Return carries its note, already checked by checkReturnNote.
export function useReviewDecision(entry, onDecided) {
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function decide(decision, note) {
    if (sending) return;
    setFailed(false);
    setSending(true);

    let done = false;
    try {
      done = await decideOnEntry(createClient(), entry.id, decision, note);
    } catch (failure) {
      console.error(`The ${decision} decision on entry ${entry.id} failed:`, failure);
    }

    // After a success the card is gone, so there is no state left to reset.
    if (done) {
      onDecided(entry, decision);
      return;
    }
    setFailed(true);
    setSending(false);
  }

  return { sending, failed, decide };
}
