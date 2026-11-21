import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// The maker and place every Official record shares, said once under the
// catalogue heading (lib/officialProvenance.js). Same rows, labels and markup
// as a card's own Provenance (GarmentCard).
const ROWS = [
  ["maker", TEXT.card.makerShort],
  ["place", TEXT.provenance.place],
];

export default function SharedProvenance({ shared }) {
  const rows = ROWS.filter(([field]) => shared[field]);
  if (!rows.length) return null;
  return (
    <dl className="provenance">
      {rows.map(([field, label]) => (
        <div key={field}><dt><Bilingual text={label} /></dt><dd lang="en">{shared[field]}</dd></div>
      ))}
    </dl>
  );
}
