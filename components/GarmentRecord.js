"use client";

import { garmentNames } from "../lib/garmentNames.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import MixedText from "./MixedText.js";

const CATEGORIES = { lower: TEXT.catalogue.lower, upper: TEXT.catalogue.upper, ensemble: TEXT.catalogue.cardEnsemble };

// One Official record on its own page (app/garments/[id]/page.js): the photo
// whole on its fabric mat, then everything the archive holds about the record.
// It closes with the archive's source, because every Official record comes
// from it. Every label is existing, audited interface text.
export default function GarmentRecord({ garment, source, byline }) {
  const language = useLanguage();
  const [title, subtitle] = garmentNames(garment, language);
  const rows = [
    [TEXT.catalogue.filterLabel, CATEGORIES[garment.category] ? <Bilingual text={CATEGORIES[garment.category]} inline /> : garment.category],
    [TEXT.catalogue.material, <MixedText text={garment.material} />],
    [TEXT.card.makerShort, <span lang="en">{garment.maker}</span>],
    [TEXT.provenance.place, <span lang="en">{garment.place}</span>],
  ];

  return (
    <article className="record" aria-labelledby="record-title">
      <div className="swatch has-image record-photo">
        <img className="swatch-image" src={garment.imageUrl} alt={`${title.text} (${subtitle.text})`} lang={title.lang} width="4" height="5" />
      </div>
      <div className="record-text">
        <h1 id="record-title" className="record-title" lang={title.lang}>{title.text}</h1>
        <p className="card-subtitle" lang={subtitle.lang}>{subtitle.text}</p>
        <dl className="provenance record-facts">
          {rows.map(([label, value], index) => (
            <div key={index}><dt><Bilingual text={label} /></dt><dd>{value}</dd></div>
          ))}
        </dl>
        <p className="record-description" lang="en">{garment.description}</p>
        <div className="record-source">
          <p><Bilingual text={source} /></p>
          <p className="byline"><Bilingual text={byline} /></p>
        </div>
      </div>
    </article>
  );
}
