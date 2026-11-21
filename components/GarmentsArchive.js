"use client";

import { useRef, useState } from "react";
import garments from "../data/garments.js";
import { filterGarments } from "../lib/garmentSearch.js";
import { sharedProvenance, withoutShared } from "../lib/officialProvenance.js";
import { TEXT, countText, emptyGarmentsText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import GarmentFilter from "./GarmentFilter.js";
import GarmentCard from "./GarmentCard.js";
import GarmentSearch from "./GarmentSearch.js";
import SharedProvenance from "./SharedProvenance.js";

// Read once: the whole collection, not the filtered view, decides what is shared.
const SHARED = sharedProvenance(garments);

export default function GarmentsArchive() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const filtered = filterGarments(garments, { activeTab, query });
  // Nothing to reset yet: on phones the full-width Reset button is hidden (globals.css).
  const idle = activeTab === "all" && query === "";
  const reset = () => {
    setActiveTab("all");
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <section className="container catalogue" aria-labelledby="collection-heading">
      <div className="section-head">
        <div><p className="label"><Bilingual text={TEXT.catalogue.label} inline /></p><h2 id="collection-heading"><Bilingual text={TEXT.catalogue.heading} /></h2><SharedProvenance shared={SHARED} /></div>
        <p className="count" role="status" aria-live="polite" aria-atomic="true"><Bilingual text={countText(filtered.length, garments.length)} /></p>
      </div>
      <div className="search-row">
        <GarmentSearch query={query} onQueryChange={setQuery} garments={garments} inputRef={inputRef} />
        <button className={idle ? "button secondary reset-idle" : "button secondary"} type="button" onClick={reset}><Bilingual text={TEXT.catalogue.reset} inline /></button>
      </div>
      <GarmentFilter activeTab={activeTab} onSelectTab={setActiveTab} />
      {filtered.length === 0 ? (
        <div className="empty">
          <h3><Bilingual text={TEXT.catalogue.noneFound} /></h3>
          <p><Bilingual text={emptyGarmentsText(activeTab, query)} /></p>
          <button className="button secondary" type="button" onClick={reset}><Bilingual text={TEXT.catalogue.resetAll} inline /></button>
        </div>
      ) : (
        <div className="grid">{filtered.map((garment) => <GarmentCard key={garment.id} garment={withoutShared(garment, SHARED)} />)}</div>
      )}
    </section>
  );
}
