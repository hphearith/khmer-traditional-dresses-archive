"use client";

import { useRef, useState } from "react";
import { combined } from "../lib/bilingual.js";
import { filterEntries } from "../lib/entrySearch.js";
import { TEXT, countText, emptyEntriesText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import CommunitySearch from "./CommunitySearch.js";
import ContributorEntryCard from "./ContributorEntryCard.js";

// All entries lists the published entries. My entries lists every entry the
// signed-in visitor wrote, in any status, each with a Status pill. Each list has
// its own failed flag, so one failing never blanks the other. HomeTabs works the
// view out from the address and hands a guest "all"; a guest gets no toggle. The
// view is not state here: choosing one goes through onViewChange, into the address.
// The one search belongs to this tab and is kept when the view changes.
export default function CommunityTab({
  entries = [], failed = false, myEntries = [], myFailed = false,
  signedIn = false, view = "all", onViewChange,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const mine = signedIn && view === "mine";
  const list = mine ? myEntries : entries;
  const listFailed = mine ? myFailed : failed;
  const shown = filterEntries(list, query);
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
      {!listFailed && list.length > 0 && (
        <>
          <div className="search-row">
            <CommunitySearch query={query} onQueryChange={setQuery} inputRef={inputRef} />
            <button className="button secondary" type="button" onClick={resetSearch}><Bilingual text={TEXT.catalogue.reset} inline /></button>
          </div>
          <p className="count" role="status" aria-live="polite" aria-atomic="true"><Bilingual text={countText(shown.length, list.length)} /></p>
        </>
      )}
      {signedIn && (
        <div className="entry-views" role="group" aria-label={combined(TEXT.community.viewsLabel)}>
          <button type="button" aria-pressed={!mine} onClick={() => onViewChange("all")}><Bilingual text={TEXT.community.allEntries} inline /></button>
          <button type="button" aria-pressed={mine} onClick={() => onViewChange("mine")}><Bilingual text={TEXT.community.myEntries} inline /></button>
        </div>
      )}
      {listFailed ? (
        <div className="empty" role="alert">
          <h3><Bilingual text={TEXT.community.loadFailed} /></h3>
          <p><Bilingual text={TEXT.community.loadFailedHelp} /></p>
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">
          {list.length === 0 ? (
            <h3><Bilingual text={mine ? TEXT.community.noneMine : TEXT.community.none} /></h3>
          ) : (
            <>
              <h3><Bilingual text={TEXT.community.noneFound} /></h3>
              <p><Bilingual text={emptyEntriesText(query)} /></p>
              <button className="button secondary" type="button" onClick={resetSearch}><Bilingual text={TEXT.community.resetSearch} inline /></button>
            </>
          )}
        </div>
      ) : (
        <div className="grid">{shown.map((entry) => <ContributorEntryCard key={entry.id} entry={entry} showStatus={mine} />)}</div>
      )}
    </section>
  );
}
