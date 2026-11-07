"use client";

import { useSearchParams } from "next/navigation";
import { combined } from "../lib/bilingual.js";
import { getHomeTabHref, moveHomeTab, parseHomeTab, parseHomeView } from "../lib/homeTabs.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import CommunityTab from "./CommunityTab.js";
import GarmentsArchive from "./GarmentsArchive.js";

const TABS = [
  { id: "official", label: TEXT.tabs.official },
  { id: "community", label: TEXT.tabs.community },
];

export default function HomeTabs({ communityEntries, communityFailed, myEntries, myFailed, signedIn }) {
  // The page-level tab lives in the address (?tab=), and so does the Community
  // view (?view=). GarmentsArchive keeps its own separate category filter state,
  // so the two never share a name. Only a signed-in visitor has My entries;
  // anyone else gets All entries, whatever the address says.
  const params = useSearchParams();
  const homeTab = parseHomeTab(params.get("tab"));
  const view = signedIn ? parseHomeView(params.get("view")) : "all";

  const selectTab = (tab) => {
    if (tab !== homeTab) window.history.pushState(null, "", getHomeTabHref(tab));
  };

  const selectView = (next) => {
    if (next !== view) window.history.pushState(null, "", getHomeTabHref("community", next));
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
        <div className="home-tabs" role="tablist" aria-label={combined(TEXT.tabs.label)} onKeyDown={onKeyDown}>
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
              <Bilingual text={tab.label} inline />
            </button>
          ))}
        </div>
      </div>
      {/* Both panels stay mounted so the Official search and filters survive a tab switch. */}
      <div role="tabpanel" id="home-panel-official" aria-labelledby="home-tab-official" hidden={homeTab !== "official"}>
        <GarmentsArchive />
      </div>
      <div role="tabpanel" id="home-panel-community" aria-labelledby="home-tab-community" hidden={homeTab !== "community"}>
        <CommunityTab
          entries={communityEntries} failed={communityFailed} myEntries={myEntries} myFailed={myFailed}
          signedIn={signedIn} view={view} onViewChange={selectView}
        />
      </div>
    </div>
  );
}
