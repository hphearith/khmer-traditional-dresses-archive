"use client";

import { useEffect, useRef, useState } from "react";
import { DRAFT_KEPT_EVENT, takeDraftKeptFlag } from "../lib/draft.js";

const SHOWN_MS = 2500;
const FADE_MS = 600;

// A small "Draft saved" popup that fades away. It lives in the root layout, so it
// can appear after the entry form is gone. The form tells it in one of two ways
// (lib/useEntryDraft.js): DRAFT_KEPT_EVENT when the Contributor leaves by a link
// inside Next.js, or a note in session storage for the next page, which is read
// when this page loads or comes back from the browser's back/forward cache.
export default function DraftToast() {
  // "off" (nothing on the page), "in" (visible), "out" (fading; the text stays until it is gone).
  const [phase, setPhase] = useState("off");

  // The timers are not cleared when the effect is cleaned up: in development
  // React runs every effect twice, and the second run finds the note already taken.
  const timers = useRef([]);

  useEffect(() => {
    function show() {
      timers.current.forEach(clearTimeout);
      setPhase("in");
      timers.current = [setTimeout(() => setPhase("out"), SHOWN_MS), setTimeout(() => setPhase("off"), SHOWN_MS + FADE_MS)];
    }
    const showIfNoted = () => takeDraftKeptFlag(() => window.sessionStorage) && show();
    const showIfRestored = (event) => event.persisted && showIfNoted();
    showIfNoted();
    window.addEventListener(DRAFT_KEPT_EVENT, show);
    window.addEventListener("pageshow", showIfRestored);
    return () => {
      window.removeEventListener(DRAFT_KEPT_EVENT, show);
      window.removeEventListener("pageshow", showIfRestored);
    };
  }, []);

  return (
    <p role="status" style={{
      position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", margin: 0,
      padding: "12px 24px", borderRadius: 4, background: "var(--ink)", color: "var(--paper)",
      opacity: phase === "in" ? 1 : 0, transition: `opacity ${FADE_MS}ms ease`, pointerEvents: "none",
    }}>
      {phase !== "off" && "Draft saved"}
    </p>
  );
}
