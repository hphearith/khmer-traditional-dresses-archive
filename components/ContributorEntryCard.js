import DeleteEntryButton from "./DeleteEntryButton.js";

const PROVENANCE = [
  ["occasion", "Occasion"],
  ["year", "Year"],
  ["maker", "Maker"],
  ["place", "Place"],
  ["materials", "Materials"],
];

// Every value is rendered as plain text by React, so a title such as
// <script>…</script> is shown, never run. Khmer text is shown as stored.
export default function ContributorEntryCard({ entry }) {
  const provenance = PROVENANCE.filter(([field]) => entry[field] !== null && entry[field] !== undefined);

  return (
    <article className="entry-card">
      {entry.credit && <p className="entry-credit">Shared by {entry.credit}</p>}
      <h3>{entry.title}</h3>
      {provenance.length > 0 && (
        <dl className="provenance">
          {provenance.map(([field, label]) => (
            <div key={field}><dt>{label}</dt><dd>{entry[field]}</dd></div>
          ))}
        </dl>
      )}
      <details>
        <summary aria-label={`Read story: ${entry.title}`}>Read story</summary>
        <p className="entry-story">{entry.story}</p>
      </details>
      {/* Offered only on the signed-in owner's own entries. The database refuses any other change or delete. */}
      {entry.mine && (
        <div className="entry-actions">
          <a className="button secondary" href={`/contribute/${entry.id}/edit`} aria-label={`Edit: ${entry.title}`}>
            Edit
          </a>
          <DeleteEntryButton entryId={entry.id} title={entry.title} />
        </div>
      )}
    </article>
  );
}
