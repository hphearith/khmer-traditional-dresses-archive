"use client";

import { useEffect, useState } from "react";
import { DRAFT_KEPT_EVENT } from "../lib/draft.js";

const SHOWN_MS = 2500;
const FADE_MS = 600;

// A small "Draft saved" popup that fades away. It lives in the root layout, which
// stays on the page when the Contributor leaves an entry form for another page of
// the site, so it can appear after the form is gone. The form announces itself
// with DRAFT_KEPT_EVENT (lib/useEntryDraft.js).
export default function DraftToast() {
  // "off" (nothing on the page), "in" (visible), "out" (fading; the text stays until it is gone).
  const [phase, setPhase] = useState("off");

  useEffect(() => {
    let timers = [];
    function show() {
      timers.forEach(clearTimeout);
      setPhase("in");
      timers = [setTimeout(() => setPhase("out"), SHOWN_MS), setTimeout(() => setPhase("off"), SHOWN_MS + FADE_MS)];
    }
    window.addEventListener(DRAFT_KEPT_EVENT, show);
    return () => {
      window.removeEventListener(DRAFT_KEPT_EVENT, show);
      timers.forEach(clearTimeout);
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
