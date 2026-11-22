"use client";

import { useLanguage } from "../lib/useLanguage.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// The maker and place every Official record shares, said once under the
// catalogue heading (lib/officialProvenance.js). Same rows, labels and markup
// as a card's own Provenance (GarmentCard).
const ROWS = [
  ["maker", TEXT.card.makerShort, "makerKh"],
  ["place", TEXT.provenance.place, "placeKh"],
];

const KHMER_PROVENANCE = {
  "Apsara Mode Tailor": "ជាងកាត់ដេរ អប្សរាម៉ូដ",
  "Phnom Penh": "ភ្នំពេញ",
};

export default function SharedProvenance({ shared }) {
  const language = useLanguage();
  const rows = ROWS.filter(([field]) => shared[field]);
  if (!rows.length) return null;
  return (
    <dl className="provenance">
      {rows.map(([field, label, khField]) => {
        const isKm = language === "km";
        const val = isKm ? (shared[khField] || KHMER_PROVENANCE[shared[field]] || shared[field]) : shared[field];
        const valLang = isKm && (shared[khField] || KHMER_PROVENANCE[shared[field]]) ? "km" : "en";
        return (
          <div key={field}>
            <dt><Bilingual text={label} /></dt>
            <dd lang={valLang}>{val}</dd>
          </div>
        );
      })}
    </dl>
  );
}
