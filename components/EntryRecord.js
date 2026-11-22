"use client";

import { pick } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT, sharedByText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import ProvenanceList from "./ProvenanceList.js";
import StatusPill from "./StatusPill.js";

// One Contributor entry on its own page (app/entries/[id]/page.js), laid out
// like an Official record's page. Every value is plain text, shown exactly as
// its Contributor wrote it, Khmer included. A Status pill appears only on an
// entry that is not yet Published, which only its Contributor and Reviewers
// can open. Edit and Delete stay in My entries.
export default function EntryRecord({ entry, submitted }) {
  const language = useLanguage();
  return (
    <article className="record" aria-labelledby="record-title">
      {entry.photo_url && (
        <img className="record-photo entry-record-photo" src={entry.photo_url} alt={`${pick(TEXT.card.photoFor, language)}: ${entry.title}`} />
      )}
      <div className="record-text entry-record">
        {entry.credit && <p className="entry-credit"><Bilingual text={sharedByText(entry.credit)} /></p>}
        <h1 id="record-title" className="record-title">{entry.title}</h1>
        {entry.status !== "published" && <div className="entry-status"><StatusPill status={entry.status} /></div>}
        <ProvenanceList entry={entry} />
        <p className="record-description entry-story">{entry.story}</p>
        <p className="record-submitted"><Bilingual text={submitted} /></p>
      </div>
    </article>
  );
}
