import Link from "next/link";
import { pick } from "../lib/bilingual.js";
import { entryHref } from "../lib/entryPages.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT, sharedByText, entryPhotoText, namedEntryText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import DeleteEntryButton from "./DeleteEntryButton.js";
import ProvenanceList from "./ProvenanceList.js";
import ReturnNote from "./ReturnNote.js";
import StatusPill from "./StatusPill.js";

// Every value is rendered as plain text by React, so a title such as
// <script>…</script> is shown, never run. Khmer text is shown as stored.
// showStatus adds where the entry stands in review, as a Status pill (My
// entries only); All entries shows published entries alone, so it never needs it.
// A Returned entry also says what to do next, under its pill, followed by its
// Return note if it has one. A Pending or Published entry never shows a note.
export default function ContributorEntryCard({ entry, showStatus = false }) {
  const language = useLanguage();
  return (
    <article className="entry-card">
      {/* A plain img, like GarmentCard. The photo is public, so a guest needs no cookie to see it.
          It stands on a plinth and opens the entry, like an Official record's photo (GarmentCard). */}
      {entry.photo_url && (
        <>
          <Link className="entry-photo-link" href={entryHref(entry.id)} tabIndex={-1}>
            <img className="entry-photo" src={entry.photo_url} alt={pick(entryPhotoText(entry.title), language)} loading="lazy" />
          </Link>
          <div className="plinth" aria-hidden="true" />
        </>
      )}
      <h3><Link className="card-link" href={entryHref(entry.id)}>{entry.title}</Link></h3>
      {entry.credit && <p className="entry-credit"><Bilingual text={sharedByText(entry.credit)} /></p>}
      {showStatus && (
        <div className="entry-status">
          <StatusPill status={entry.status} />
          {entry.status === "returned" && (
            <>
              <p className="entry-status-hint"><Bilingual text={TEXT.review.returnedHint} /></p>
              <ReturnNote heading={TEXT.review.note.name} note={entry.return_note} />
            </>
          )}
        </div>
      )}
      <ProvenanceList entry={entry} />
      {/* The story is read on the entry's own page (app/entries/[id]/page.js). */}
      <Link className="read-link" href={entryHref(entry.id)} aria-label={pick(namedEntryText(TEXT.card.readStory, entry.title), language)}>
        <Bilingual text={TEXT.card.readStory} inline />
      </Link>
      {/* Offered only on the signed-in owner's own entries. The database refuses any other change or delete. */}
      {entry.mine && (
        <div className="entry-actions">
          <a className="button secondary" href={`/contribute/${entry.id}/edit`} aria-label={pick(namedEntryText(TEXT.card.edit, entry.title), language)}>
            <Bilingual text={TEXT.card.edit} inline />
          </a>
          <DeleteEntryButton entryId={entry.id} title={entry.title} />
        </div>
      )}
    </article>
  );
}
