"use client";

import { useRef, useState } from "react";
import { combined } from "../lib/bilingual.js";
import { filterEntries } from "../lib/entrySearch.js";
import { TEXT, countText, emptyEntriesText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
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
        <div><p className="label"><Bilingual text={TEXT.tabs.community} inline /></p><h2 id="community-heading"><Bilingual text={TEXT.community.heading} /></h2></div>
        <a className="button" href="/contribute"><Bilingual text={TEXT.page.writeTitle} inline /></a>
      </div>
      {!failed && entries.length > 0 && (
        <>
          <div className="search-row">
            <CommunitySearch query={query} onQueryChange={setQuery} inputRef={inputRef} />
            <button className="button secondary" type="button" onClick={resetSearch}><Bilingual text={TEXT.catalogue.reset} inline /></button>
          </div>
          <p className="count" role="status" aria-live="polite" aria-atomic="true"><Bilingual text={countText(shown.length, view.length)} /></p>
        </>
      )}
      {signedIn && (
        <div className="entry-views" role="group" aria-label={combined(TEXT.community.viewsLabel)}>
          <button type="button" aria-pressed={!mineOnly} onClick={() => setMineOnly(false)}><Bilingual text={TEXT.community.allEntries} inline /></button>
          <button type="button" aria-pressed={mineOnly} onClick={() => setMineOnly(true)}><Bilingual text={TEXT.community.myEntries} inline /></button>
        </div>
      )}
      {failed ? (
        <div className="empty" role="alert">
          <h3><Bilingual text={TEXT.community.loadFailed} /></h3>
          <p><Bilingual text={TEXT.community.loadFailedHelp} /></p>
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">
          {view.length === 0 ? (
            <h3><Bilingual text={mineOnly ? TEXT.community.noneMine : TEXT.community.none} /></h3>
          ) : (
            <>
              <h3><Bilingual text={TEXT.community.noneFound} /></h3>
              <p><Bilingual text={emptyEntriesText(query)} /></p>
              <button className="button secondary" type="button" onClick={resetSearch}><Bilingual text={TEXT.community.resetSearch} inline /></button>
            </>
          )}
        </div>
      ) : (
        <div className="grid">{shown.map((entry) => <ContributorEntryCard key={entry.id} entry={entry} />)}</div>
      )}
    </section>
  );
}
