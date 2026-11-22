import Link from "next/link";
import { pick } from "../lib/bilingual.js";
import { garmentHref } from "../lib/garmentPages.js";
import { garmentNames } from "../lib/garmentNames.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT, readGarmentText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import MixedText from "./MixedText.js";

const LABELS = { lower: TEXT.catalogue.lower, upper: TEXT.catalogue.upper, ensemble: TEXT.catalogue.cardEnsemble };

// The same Provenance rows, labels and markup as a Community entry (ContributorEntryCard).
const PROVENANCE = [
  ["maker", TEXT.card.makerShort],
  ["place", TEXT.provenance.place],
];

export default function GarmentCard({ garment }) {
  const language = useLanguage();
  const [title, subtitle] = garmentNames(garment, language);
  const href = garmentHref(garment.id);
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
      <h3 lang={title.lang}><Link className="card-link" href={href}>{title.text}</Link></h3>
      <p className="card-subtitle" lang={subtitle.lang}>{subtitle.text}</p>
      <p className="card-category">{LABELS[garment.category] ? <Bilingual text={LABELS[garment.category]} inline /> : garment.category}</p>
      <p className="material"><strong><Bilingual text={TEXT.catalogue.material} inline /></strong> <MixedText text={garment.material} /></p>
      {provenance.length > 0 && (
        <dl className="provenance">
          {provenance.map(([field, label]) => (
            <div key={field}><dt><Bilingual text={label} /></dt><dd lang="en">{garment[field]}</dd></div>
          ))}
        </dl>
      )}
      {/* The description lives on the record's own page (app/garments/[id]/page.js). */}
      <Link className="read-link" href={href} aria-label={pick(readGarmentText(title.text), language)}>
        <Bilingual text={TEXT.catalogue.readEntry} inline />
      </Link>
    </article>
  );
}
