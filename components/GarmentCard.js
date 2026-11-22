import Link from "next/link";
import { pick } from "../lib/bilingual.js";
import { garmentHref } from "../lib/garmentPages.js";
import { garmentNames } from "../lib/garmentNames.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT, readGarmentText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import MixedText from "./MixedText.js";

const LABELS = { lower: TEXT.catalogue.lower, upper: TEXT.catalogue.upper, ensemble: TEXT.catalogue.cardEnsemble };

// Like a Community entry's card, the card leaves out Maker and Place; they are
// shown on the record's own page (GarmentRecord).
export default function GarmentCard({ garment }) {
  const language = useLanguage();
  const [title, subtitle] = garmentNames(garment, language);
  const href = garmentHref(garment.id);
  const isKm = language === "km";

  return (
    <article className="garment-card">
      {/* The photo opens the record too. Keyboard users reach it by the title
          link, so the photo is skipped by Tab and the same link is not met twice. */}
      <Link className="swatch has-image" href={href} tabIndex={-1}>
        <img
          className="swatch-image"
          src={garment.imageUrl}
          alt={`${title.text} (${subtitle.text})`}
          lang={title.lang}
          width="4"
          height="5"
          loading="lazy"
        />
      </Link>
      {/* The grey step the dress stands on in the salon (app/home.css). */}
      <div className="plinth" aria-hidden="true" />
      <h3 lang={title.lang}><Link className="card-link" href={href}>{title.text}</Link></h3>
      <p className="card-subtitle" lang={subtitle.lang}>{subtitle.text}</p>
      <p className="card-category">{LABELS[garment.category] ? <Bilingual text={LABELS[garment.category]} inline /> : garment.category}</p>
      <p className="material">
        <strong><Bilingual text={TEXT.catalogue.material} inline /></strong>{" "}
        {isKm && garment.materialKh ? (
          <span lang="km">{garment.materialKh}</span>
        ) : (
          <MixedText text={garment.material} />
        )}
      </p>
      {/* The description lives on the record's own page (app/garments/[id]/page.js). */}
      <Link className="read-link" href={href} aria-label={pick(readGarmentText(title.text), language)}>
        <Bilingual text={TEXT.catalogue.readEntry} inline />
      </Link>
    </article>
  );
}
