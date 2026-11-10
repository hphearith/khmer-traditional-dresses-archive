"use client";

import { isPair } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";

// Shows one piece of interface text in the reader's Interface language, English
// or Khmer (docs/adr/0005). This is the only place that decides how interface
// text appears; every { en, km } pair still needs both languages, so switching
// never finds a half-written text.
//   stacked (default): on a line of its own.
//   inline: within the line, for buttons, nav links and tab names.
// note is a small muted pair such as (required), added to the end of the text.
// noteHidden keeps it from screen readers, which already announce "required"
// from aria-required on the control.
export default function Bilingual({ text, inline = false, note = null, noteHidden = false }) {
  const language = useLanguage();
  if (!isPair(text)) throw new Error("Bilingual needs a { en, km } text with both languages.");
  if (note && !isPair(note)) throw new Error("A Bilingual note needs both languages too.");

  return (
    // One element, so a flex parent (a button) keeps the text and its note together.
    // lang marks the Khmer for the Khmer font rules in app/globals.css.
    <span lang={language} style={inline ? undefined : { display: "block" }}>
      {text[language]}
      {note && (
        <span aria-hidden={noteHidden || undefined} style={{ fontWeight: 400, color: "var(--muted)" }}> ({note[language]})</span>
      )}
    </span>
  );
}
