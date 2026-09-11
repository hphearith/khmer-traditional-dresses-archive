"use client";

import { useState } from "react";
import garments from "../data/garments.js";
import { filterGarments } from "../lib/garmentSearch.js";
import GarmentFilter from "./GarmentFilter.js";
import GarmentCard from "./GarmentCard.js";
import GarmentSearch from "./GarmentSearch.js";

// Noun phrase shown in the empty state for each facet, keyed by tab id.
const EMPTY_LABELS = {
  all: "traditional garments",
  lower: "lower body garments",
  upper: "upper body garments",
  ensemble: "ensembles",
};

const styles = {
  section: { marginTop: 48 },
  headerRow: {
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
    flexWrap: "wrap", gap: 8, borderBottom: "1px solid #2E3644", paddingBottom: 12,
  },
  heading: { fontSize: 22, fontWeight: 600, color: "#E8EDF2", margin: 0 },
  count: { fontFamily: "'Courier New', monospace", fontSize: 13, color: "#2EE6A8", margin: 0 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
    marginTop: 8,
  },
  empty: {
    color: "#97A1B3", textAlign: "center", padding: "40px 16px", fontSize: 14,
    backgroundColor: "#1C222C", border: "1px solid #2E3644", borderRadius: 8, marginTop: 16,
  },
};

/**
 * Manages category and search filtering, rendering search input,
 * category tabs, and responsive garment card grid.
 */
export default function GarmentsArchive() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");

  // Category facet AND keyword search: both narrow the same list.
  const filtered = filterGarments(garments, { activeTab, query });

  return (
    <section style={styles.section} aria-labelledby="garments-heading">
      <div style={styles.headerRow}>
        <h2 id="garments-heading" style={styles.heading}>Garments Archive</h2>
        <p style={styles.count}>
          showing {filtered.length} of {garments.length} entries
        </p>
      </div>

      <GarmentSearch query={query} onQueryChange={setQuery} garments={garments} />
      <GarmentFilter activeTab={activeTab} onSelectTab={setActiveTab} />

      {filtered.length === 0 ? (
        <p style={styles.empty}>
          No {EMPTY_LABELS[activeTab]} found
          {query.trim() ? ` matching "${query}"` : ""}.
        </p>
      ) : (
        <div style={styles.grid}>
          {filtered.map((item) => (
            <GarmentCard key={item.id} garment={item} />
          ))}
        </div>
      )}
    </section>
  );
}
