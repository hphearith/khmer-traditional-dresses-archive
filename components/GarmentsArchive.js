"use client";

import { useState } from "react";
import garments from "../data/garments.js";
import GarmentFilter from "./GarmentFilter.js";
import GarmentCard from "./GarmentCard.js";

const styles = {
  section: {
    marginTop: 48,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 8,
    borderBottom: "1px solid #2E3644",
    paddingBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: 600,
    color: "#E8EDF2",
    margin: 0,
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "#2EE6A8",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
    marginTop: 8,
  },
};

/**
 * Manages category filtering state and renders the filter navigation,
 * dynamic entry counter, and responsive grid of garment entry cards.
 */
export default function GarmentsArchive() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? garments
      : garments.filter((g) => g.category === activeTab);

  return (
    <section style={styles.section} aria-labelledby="garments-heading">
      <div style={styles.headerRow}>
        <h2 id="garments-heading" style={styles.heading}>
          Garments Archive
        </h2>
        <p style={styles.count}>
          showing {filtered.length} of {garments.length} entries
        </p>
      </div>

      <GarmentFilter activeTab={activeTab} onSelectTab={setActiveTab} />

      <div style={styles.grid}>
        {filtered.map((item) => (
          <GarmentCard key={item.id} garment={item} />
        ))}
      </div>
    </section>
  );
}
