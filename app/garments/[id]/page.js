import Link from "next/link";
import { notFound } from "next/navigation";
import collection from "../../../collection.config.js";
import Bilingual from "../../../components/Bilingual.js";
import GarmentRecord from "../../../components/GarmentRecord.js";
import garments from "../../../data/garments.js";
import { findGarment } from "../../../lib/garmentPages.js";
import { TEXT, bylineText, identityText } from "../../../lib/uiText.js";

// One page per Official record, such as /garments/sampot-hol. The records ship
// with the site (docs/adr/0001), so every page is built ahead of time.
export function generateStaticParams() {
  return garments.map((garment) => ({ id: garment.id }));
}

export async function generateMetadata({ params }) {
  const garment = findGarment(garments, (await params).id);
  if (!garment) return {};
  return { title: `${garment.nameEn} · ${garment.nameKh} — ${collection.name}` };
}

export default async function GarmentPage({ params }) {
  const garment = findGarment(garments, (await params).id);
  if (!garment) notFound();
  const identity = identityText(collection);

  return (
    <main className="container record-page">
      <Link className="back-link" href="/#collection"><Bilingual text={TEXT.username.backToArchive} inline /></Link>
      <GarmentRecord garment={garment} source={identity.source} byline={bylineText(collection.curator)} />
    </main>
  );
}
