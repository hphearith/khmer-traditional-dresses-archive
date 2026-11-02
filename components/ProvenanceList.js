import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

const PROVENANCE = [
  ["occasion", TEXT.provenance.occasion],
  ["year", TEXT.provenance.year],
  ["maker", TEXT.card.makerShort],
  ["place", TEXT.provenance.place],
  ["materials", TEXT.provenance.materials],
];

// The Provenance fields a Contributor filled in, as a labelled list; nothing at
// all when none were. Shared by the Contributor entry card and the Review queue
// card, so both show the same fields in the same order. Every value is plain
// text, so Khmer is shown as stored and markup in it is never run.
export default function ProvenanceList({ entry }) {
  const filled = PROVENANCE.filter(([field]) => entry[field] !== null && entry[field] !== undefined);
  if (filled.length === 0) return null;

  return (
    <dl className="provenance">
      {filled.map(([field, label]) => (
        <div key={field}><dt><Bilingual text={label} /></dt><dd>{entry[field]}</dd></div>
      ))}
    </dl>
  );
}
