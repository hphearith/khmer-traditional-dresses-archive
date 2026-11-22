import Link from "next/link";
import { notFound } from "next/navigation";
import collection from "../../../collection.config.js";
import Bilingual from "../../../components/Bilingual.js";
import GarmentRecord from "../../../components/GarmentRecord.js";
import garments from "../../../data/garments.js";
import { findGarment } from "../../../lib/garmentPages.js";
import { getLanguage } from "../../../lib/getLanguage.js";
import { TEXT, archiveMetadataText, bylineText, identityText } from "../../../lib/uiText.js";

// The Official records ship with the site (docs/adr/0001). Their routes are
// known at build time, and the server reads the Interface language per request.
export function generateStaticParams() {
  return garments.map((garment) => ({ id: garment.id }));
}

function garmentTitle(garment) {
  return `${garment.nameEn} · ${garment.nameKh}`;
}

export async function generateMetadata({ params }) {
  const garment = findGarment(garments, (await params).id);
  if (!garment) return {};
  return archiveMetadataText(collection, await getLanguage(), garmentTitle(garment));
}

export default async function GarmentPage({ params }) {
  const garment = findGarment(garments, (await params).id);
  if (!garment) notFound();
  const identity = identityText(collection);

  return (
    <main className="container record-page" data-record-title={garmentTitle(garment)}>
      <Link className="back-link" href="/#collection"><Bilingual text={TEXT.username.backToArchive} inline /></Link>
      <GarmentRecord garment={garment} source={identity.source} byline={bylineText(collection.curator)} />
    </main>
  );
}
