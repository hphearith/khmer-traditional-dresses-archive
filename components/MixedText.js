import { scriptRuns } from "../lib/scriptRuns.js";

// Stored text that mixes English with a Khmer gloss, such as a material:
// "Chong Kiet Tie-Dyed Silk (សូត្រចងគាត)". The whole is English, and each
// Khmer run inside it gets lang="km" (DESIGN.md, Khmer-Is-Content Rule).
// Not a single character of the text is changed.
export default function MixedText({ text }) {
  return (
    <span lang="en">
      {scriptRuns(text).map((run, index) => (run.lang === "km" ? <span key={index} lang="km">{run.text}</span> : run.text))}
    </span>
  );
}
