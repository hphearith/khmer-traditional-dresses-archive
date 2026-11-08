import { pick } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

const LABELS = { lower: TEXT.catalogue.lower, upper: TEXT.catalogue.upper, ensemble: TEXT.catalogue.cardEnsemble };

// The same Provenance rows, labels and markup as a Community entry (ContributorEntryCard).
const PROVENANCE = [
  ["maker", TEXT.card.makerShort],
  ["place", TEXT.provenance.place],
];

export default function GarmentCard({ garment }) {
  const language = useLanguage();
  const provenance = PROVENANCE.filter(([field]) => garment[field] !== null && garment[field] !== undefined);

  return (
    <article className="garment-card">
      <div className="swatch has-image">
        <img
          className="swatch-image"
          src={garment.imageUrl}
          alt={`${garment.nameEn} (${garment.nameKh})`}
          lang="en"
          width="4"
          height="5"
          loading="lazy"
        />
      </div>
      <div className="card-top label"><span>{LABELS[garment.category] ? <Bilingual text={LABELS[garment.category]} inline /> : garment.category}</span></div>
      <h3 lang="en">{garment.nameEn}</h3>
      <p className="khmer" lang="km">{garment.nameKh}</p>
      <p className="material"><strong><Bilingual text={TEXT.catalogue.material} inline /></strong> <span lang="en">{garment.material}</span></p>
      {provenance.length > 0 && (
        <dl className="provenance">
          {provenance.map(([field, label]) => (
            <div key={field}><dt><Bilingual text={label} /></dt><dd lang="en">{garment[field]}</dd></div>
          ))}
        </dl>
      )}
      <details>
        <summary aria-label={`${pick(TEXT.catalogue.readEntry, language)}: ${garment.nameEn}`}><Bilingual text={TEXT.catalogue.readEntry} inline /></summary>
        <p lang="en">{garment.description}</p>
      </details>
    </article>
  );
}
