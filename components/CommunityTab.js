import ContributorEntryCard from "./ContributorEntryCard.js";

export default function CommunityTab({ entries = [], failed = false }) {
  return (
    <section className="container community" aria-labelledby="community-heading">
      <div className="section-head">
        <div><p className="label">Community</p><h2 id="community-heading">Dresses and their stories</h2></div>
        <a className="button" href="/contribute">Write an entry</a>
      </div>
      {failed ? (
        <div className="empty" role="alert">
          <h3>Entries could not be loaded</h3>
          <p>Please refresh the page to try again.</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="empty">
          <h3>No entries yet</h3>
        </div>
      ) : (
        <div className="grid">{entries.map((entry) => <ContributorEntryCard key={entry.id} entry={entry} />)}</div>
      )}
    </section>
  );
}
