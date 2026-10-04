"use client";

import { useSearchParams } from "next/navigation";
import { getHomeTabHref, moveHomeTab, parseHomeTab } from "../lib/homeTabs.js";
import CommunityTab from "./CommunityTab.js";
import GarmentsArchive from "./GarmentsArchive.js";

const TABS = [
  { id: "official", label: "Official collection" },
  { id: "community", label: "Community" },
];

export default function HomeTabs({ communityEntries, communityFailed }) {
  // The page-level tab lives in the address (?tab=). GarmentsArchive keeps its
  // own separate category filter state, so the two never share a name.
  const homeTab = parseHomeTab(useSearchParams().get("tab"));

  const selectTab = (tab) => {
    if (tab !== homeTab) window.history.pushState(null, "", getHomeTabHref(tab));
  };

  const onKeyDown = (event) => {
    const next = moveHomeTab(homeTab, event.key);
    if (!next) return;
    // Arrows only move focus; Enter or Space activates, so one keypress is not one history entry.
    event.preventDefault();
    document.getElementById(`home-tab-${next}`)?.focus();
  };

  return (
    <div id="collection" className="home-tabs-wrap">
      <div className="container">
        <div className="home-tabs" role="tablist" aria-label="Archive sections" onKeyDown={onKeyDown}>
          {TABS.map((tab) => (
            <button
              className="home-tab"
              key={tab.id}
              id={`home-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={homeTab === tab.id}
              aria-controls={`home-panel-${tab.id}`}
              tabIndex={homeTab === tab.id ? 0 : -1}
              onClick={() => selectTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Both panels stay mounted so the Official search and filters survive a tab switch. */}
      <div role="tabpanel" id="home-panel-official" aria-labelledby="home-tab-official" hidden={homeTab !== "official"}>
        <GarmentsArchive />
      </div>
      <div role="tabpanel" id="home-panel-community" aria-labelledby="home-tab-community" hidden={homeTab !== "community"}>
        <CommunityTab entries={communityEntries} failed={communityFailed} />
      </div>
    </div>
  );
}
