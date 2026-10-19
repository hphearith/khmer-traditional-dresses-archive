import { combined } from "../lib/bilingual.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

const LABELS = { lower: TEXT.catalogue.lower, upper: TEXT.catalogue.upper, ensemble: TEXT.catalogue.cardEnsemble };

// The same Provenance rows, labels and markup as a Community entry (ContributorEntryCard).
const PROVENANCE = [
  ["maker", TEXT.card.makerShort],
  ["place", TEXT.provenance.place],
];

export default function GarmentCard({ garment }) {
  const provenance = PROVENANCE.filter(([field]) => garment[field] !== null && garment[field] !== undefined);

  return (
    <article className="garment-card">
      <div className="swatch has-image">
        <img
          className="swatch-image"
          src={garment.imageUrl}
          alt={`${garment.nameEn} (${garment.nameKh})`}
          width="4"
          height="5"
          loading="lazy"
        />
      </div>
      <div className="card-top label"><span>{LABELS[garment.category] ? <Bilingual text={LABELS[garment.category]} inline /> : garment.category}</span></div>
      <h3>{garment.nameEn}</h3>
      <p className="khmer" lang="km">{garment.nameKh}</p>
      <p className="material"><strong><Bilingual text={TEXT.catalogue.material} inline /></strong> {garment.material}</p>
      {provenance.length > 0 && (
        <dl className="provenance">
          {provenance.map(([field, label]) => (
            <div key={field}><dt><Bilingual text={label} /></dt><dd>{garment[field]}</dd></div>
          ))}
        </dl>
      )}
      <details>
        <summary aria-label={`${combined(TEXT.catalogue.readEntry)}: ${garment.nameEn}`}><Bilingual text={TEXT.catalogue.readEntry} inline /></summary>
        <p>{garment.description}</p>
      </details>
    </article>
  );
}
