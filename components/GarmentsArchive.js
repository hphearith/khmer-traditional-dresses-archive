"use client";

import { useRef, useState } from "react";
import garments from "../data/garments.js";
import { filterGarments } from "../lib/garmentSearch.js";
import GarmentFilter from "./GarmentFilter.js";
import GarmentCard from "./GarmentCard.js";
import GarmentSearch from "./GarmentSearch.js";

const EMPTY_LABELS = {
  all: "garments",
  lower: "lower body garments",
  upper: "upper body garments",
  ensemble: "ensembles",
};

export default function GarmentsArchive() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const filtered = filterGarments(garments, { activeTab, query });
  const reset = () => {
    setActiveTab("all");
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <section className="container catalogue" id="collection" aria-labelledby="collection-heading">
      <div className="section-head">
        <div><p className="label">01 / The catalogue</p><h2 id="collection-heading">Explore the garments</h2></div>
        <p className="count" role="status" aria-live="polite" aria-atomic="true">showing {filtered.length} of {garments.length} entries</p>
      </div>
      <div className="search-row">
        <GarmentSearch query={query} onQueryChange={setQuery} garments={garments} inputRef={inputRef} />
        <button className="button secondary" type="button" onClick={reset}>Reset</button>
      </div>
      <GarmentFilter activeTab={activeTab} onSelectTab={setActiveTab} />
      {filtered.length === 0 ? (
        <div className="empty">
          <h3>No garments found</h3>
          <p>No {EMPTY_LABELS[activeTab]} match “{query.trim()}”. Try a different name or material.</p>
          <button className="button secondary" type="button" onClick={reset}>Reset search and filters</button>
        </div>
      ) : (
        <div className="grid">{filtered.map((garment) => <GarmentCard key={garment.id} garment={garment} />)}</div>
      )}
    </section>
  );
}
