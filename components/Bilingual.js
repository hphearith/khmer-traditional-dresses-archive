import { isPair } from "../lib/bilingual.js";

// Shows one piece of interface text in English and Khmer. This is the only place
// that decides how the two languages appear, so a language switcher later
// changes this file and nothing else (docs/adr/0003).
//   stacked (default): English, then the Khmer on its own line beneath it.
//   inline: both on one line, for buttons, nav links and tab names.
export default function Bilingual({ text, inline = false }) {
  if (!isPair(text)) throw new Error("Bilingual needs a { en, km } text with both languages.");

  if (inline) {
    return (
      <>
        {text.en}
        <span aria-hidden="true"> · </span>
        <span lang="km">{text.km}</span>
      </>
    );
  }
  return (
    <>
      <span style={{ display: "block" }}>{text.en}</span>
      <span lang="km" style={{ display: "block" }}>{text.km}</span>
    </>
  );
}
