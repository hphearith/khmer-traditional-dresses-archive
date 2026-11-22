"use client";

import { garmentNames } from "../lib/garmentNames.js";
import { useLanguage } from "../lib/useLanguage.js";

// The hero photo of one Official record. Like GarmentCard, its alt text leads
// with the reader's Interface language, so it follows the language toggle
// without a trip to the server.
export default function HeroImage({ garment }) {
  const language = useLanguage();
  const [title, subtitle] = garmentNames(garment, language);
  return (
    <img
      className="hero-image"
      src={garment.imageUrl}
      alt={`${title.text} (${subtitle.text})`}
      lang={title.lang}
      width="3"
      height="4"
    />
  );
}
