"use client";

import { useState } from "react";
import ContributorEntryCard from "./ContributorEntryCard.js";

// My entries is offered only to a signed-in visitor. The page marks each entry
// mine when it is the visitor's own, so the view never shows anyone else's.
export default function CommunityTab({ entries = [], failed = false, signedIn = false }) {
  const [mineOnly, setMineOnly] = useState(false);
  const shown = mineOnly ? entries.filter((entry) => entry.mine) : entries;

  return (
    <section className="container community" aria-labelledby="community-heading">
      <div className="section-head">
        <div><p className="label">Community</p><h2 id="community-heading">Dresses and their stories</h2></div>
        <a className="button" href="/contribute">Write an entry</a>
      </div>
      {signedIn && (
        <div className="entry-views" role="group" aria-label="Which entries to show">
          <button type="button" aria-pressed={!mineOnly} onClick={() => setMineOnly(false)}>All entries</button>
          <button type="button" aria-pressed={mineOnly} onClick={() => setMineOnly(true)}>My entries</button>
        </div>
      )}
      {failed ? (
        <div className="empty" role="alert">
          <h3>Entries could not be loaded</h3>
          <p>Please refresh the page to try again.</p>
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">
          <h3>{mineOnly ? "You have not written an entry yet" : "No entries yet"}</h3>
        </div>
      ) : (
        <div className="grid">{shown.map((entry) => <ContributorEntryCard key={entry.id} entry={entry} />)}</div>
      )}
    </section>
  );
}
