import { isPair } from "../lib/bilingual.js";

// Shows one piece of interface text in English and Khmer. This is the only place
// that decides how the two languages appear, so a language switcher later
// changes this file and nothing else (docs/adr/0003).
//   stacked (default): English, then the Khmer on its own line beneath it.
//   inline: both on one line, for buttons, nav links and tab names.
// note is a small muted pair such as (required), added to the end of each
// language's line. noteHidden keeps it from screen readers, which already
// announce "required" from aria-required on the control.
export default function Bilingual({ text, inline = false, note = null, noteHidden = false }) {
  if (!isPair(text)) throw new Error("Bilingual needs a { en, km } text with both languages.");
  if (note && !isPair(note)) throw new Error("A Bilingual note needs both languages too.");

  const marker = (language) => note && (
    <span aria-hidden={noteHidden || undefined} style={{ fontWeight: 400, color: "var(--muted)" }}> ({note[language]})</span>
  );

  if (inline) {
    return (
      <>
        {text.en}
        {marker("en")}
        <span aria-hidden="true"> · </span>
        <span lang="km">{text.km}{marker("km")}</span>
      </>
    );
  }
  return (
    <>
      <span style={{ display: "block" }}>{text.en}{marker("en")}</span>
      <span lang="km" style={{ display: "block" }}>{text.km}{marker("km")}</span>
    </>
  );
}
