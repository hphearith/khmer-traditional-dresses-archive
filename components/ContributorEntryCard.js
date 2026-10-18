import { combined } from "../lib/bilingual.js";
import { TEXT, sharedByText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import DeleteEntryButton from "./DeleteEntryButton.js";

const PROVENANCE = [
  ["occasion", TEXT.provenance.occasion],
  ["year", TEXT.provenance.year],
  ["maker", TEXT.card.makerShort],
  ["place", TEXT.provenance.place],
  ["materials", TEXT.provenance.materials],
];

// Every value is rendered as plain text by React, so a title such as
// <script>…</script> is shown, never run. Khmer text is shown as stored.
export default function ContributorEntryCard({ entry }) {
  const provenance = PROVENANCE.filter(([field]) => entry[field] !== null && entry[field] !== undefined);

  return (
    <article className="entry-card">
      {/* A plain img, like GarmentCard. The photo is public, so a guest needs no cookie to see it. */}
      {entry.photo_url && (
        <img className="entry-photo" src={entry.photo_url} alt={`${combined(TEXT.card.photoFor)}: ${entry.title}`} loading="lazy" />
      )}
      {entry.credit && <p className="entry-credit"><Bilingual text={sharedByText(entry.credit)} /></p>}
      <h3>{entry.title}</h3>
      {provenance.length > 0 && (
        <dl className="provenance">
          {provenance.map(([field, label]) => (
            <div key={field}><dt><Bilingual text={label} /></dt><dd>{entry[field]}</dd></div>
          ))}
        </dl>
      )}
      <details>
        <summary aria-label={`${combined(TEXT.card.readStory)}: ${entry.title}`}><Bilingual text={TEXT.card.readStory} inline /></summary>
        <p className="entry-story">{entry.story}</p>
      </details>
      {/* Offered only on the signed-in owner's own entries. The database refuses any other change or delete. */}
      {entry.mine && (
        <div className="entry-actions">
          <a className="button secondary" href={`/contribute/${entry.id}/edit`} aria-label={`${combined(TEXT.card.edit)}: ${entry.title}`}>
            <Bilingual text={TEXT.card.edit} inline />
          </a>
          <DeleteEntryButton entryId={entry.id} title={entry.title} />
        </div>
      )}
    </article>
  );
}
