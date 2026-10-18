"use client";

import { useRef, useState } from "react";
import { filterEntries } from "../lib/entrySearch.js";
import ContributorEntryCard from "./ContributorEntryCard.js";
import CommunitySearch from "./CommunitySearch.js";

// My entries is offered only to a signed-in visitor. The page marks each entry
// mine when it is the visitor's own, so the view never shows anyone else's.
// The search belongs to this tab alone: the Official collection keeps its own.
export default function CommunityTab({ entries = [], failed = false, signedIn = false }) {
  const [mineOnly, setMineOnly] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const view = mineOnly ? entries.filter((entry) => entry.mine) : entries;
  const shown = filterEntries(view, query);
  const resetSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <section className="container community" aria-labelledby="community-heading">
      <div className="section-head">
        <div><p className="label">Community</p><h2 id="community-heading">Dresses and their stories</h2></div>
        <a className="button" href="/contribute">Write an entry</a>
      </div>
      {!failed && entries.length > 0 && (
        <>
          <div className="search-row">
            <CommunitySearch query={query} onQueryChange={setQuery} inputRef={inputRef} />
            <button className="button secondary" type="button" onClick={resetSearch}>Reset</button>
          </div>
          <p className="count" role="status" aria-live="polite" aria-atomic="true">showing {shown.length} of {view.length} entries</p>
        </>
      )}
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
          {view.length === 0 ? (
            <h3>{mineOnly ? "You have not written an entry yet" : "No entries yet"}</h3>
          ) : (
            <>
              <h3>No entries found</h3>
              <p>No entries match “{query.trim()}”. Try a different word, or search in English or Khmer.</p>
              <button className="button secondary" type="button" onClick={resetSearch}>Reset search</button>
            </>
          )}
        </div>
      ) : (
        <div className="grid">{shown.map((entry) => <ContributorEntryCard key={entry.id} entry={entry} />)}</div>
      )}
    </section>
  );
}
