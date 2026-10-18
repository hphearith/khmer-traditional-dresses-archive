"use client";

import { useState } from "react";
import { combined } from "../lib/bilingual.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

const LABELS = { lower: TEXT.catalogue.lower, upper: TEXT.catalogue.upper, ensemble: TEXT.catalogue.cardEnsemble };

export default function GarmentCard({ garment }) {
  const [hasImage, setHasImage] = useState(
    Boolean(garment.imageUrl && !garment.imageUrl.includes("placeholder.svg"))
  );

  return (
    <article className="garment-card">
      <div className={`swatch${hasImage ? " has-image" : ""}`}>
        {hasImage && (
          <img
            className="swatch-image"
            src={garment.imageUrl}
            alt={`${garment.nameEn} (${garment.nameKh})`}
            width="4"
            height="5"
            loading="lazy"
            onError={() => setHasImage(false)}
          />
        )}
        {!hasImage && <span className="photo-note"><Bilingual text={TEXT.catalogue.photoPending} inline /></span>}
      </div>
      <div className="card-top label"><span>{LABELS[garment.category] ? <Bilingual text={LABELS[garment.category]} inline /> : garment.category}</span></div>
      <h3>{garment.nameEn}</h3>
      <p className="khmer" lang="km">{garment.nameKh}</p>
      <p className="material"><strong><Bilingual text={TEXT.catalogue.material} inline /></strong> {garment.material}</p>
      <details>
        <summary aria-label={`${combined(TEXT.catalogue.readEntry)}: ${garment.nameEn}`}><Bilingual text={TEXT.catalogue.readEntry} inline /></summary>
        <p>{garment.description}</p>
      </details>
    </article>
  );
}
