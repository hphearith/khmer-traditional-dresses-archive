import { pick } from "../lib/bilingual.js";
import { garmentNames } from "../lib/garmentNames.js";
import { scriptRuns } from "../lib/scriptRuns.js";
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
  const [title, subtitle] = garmentNames(garment, language);
  const provenance = PROVENANCE.filter(([field]) => garment[field] !== null && garment[field] !== undefined);

  return (
    <article className="garment-card">
      <div className="swatch has-image">
        <img
          className="swatch-image"
          src={garment.imageUrl}
          alt={`${title.text} (${subtitle.text})`}
          lang={title.lang}
          width="4"
          height="5"
          loading="lazy"
        />
      </div>
      <div className="card-top label"><span>{LABELS[garment.category] ? <Bilingual text={LABELS[garment.category]} inline /> : garment.category}</span></div>
      <h3 lang={title.lang}>{title.text}</h3>
      <p className="card-subtitle" lang={subtitle.lang}>{subtitle.text}</p>
      <p className="material"><strong><Bilingual text={TEXT.catalogue.material} inline /></strong> <span lang="en">
        {/* The Khmer gloss in brackets is Khmer, so it gets its own lang. */}
        {scriptRuns(garment.material).map((run, index) => (run.lang === "km" ? <span key={index} lang="km">{run.text}</span> : run.text))}
      </span></p>
      {provenance.length > 0 && (
        <dl className="provenance">
          {provenance.map(([field, label]) => (
            <div key={field}><dt><Bilingual text={label} /></dt><dd lang="en">{garment[field]}</dd></div>
          ))}
        </dl>
      )}
      <details>
        <summary aria-label={`${pick(TEXT.catalogue.readEntry, language)}: ${title.text}`}><Bilingual text={TEXT.catalogue.readEntry} inline /></summary>
        <p lang="en">{garment.description}</p>
      </details>
    </article>
  );
}
