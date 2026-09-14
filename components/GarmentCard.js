"use client";

import { useState } from "react";

const LABELS = { lower: "Lower body", upper: "Upper body", ensemble: "Ensemble" };

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
        {!hasImage && <span className="photo-note">Photograph pending · illustrative study</span>}
      </div>
      <div className="card-top label"><span>{LABELS[garment.category] || garment.category}</span></div>
      <h3>{garment.nameEn}</h3>
      <p className="khmer" lang="km">{garment.nameKh}</p>
      <p className="material"><strong>Material:</strong> {garment.material}</p>
      <details>
        <summary aria-label={`Read entry: ${garment.nameEn}`}>Read entry</summary>
        <p>{garment.description}</p>
      </details>
    </article>
  );
}
