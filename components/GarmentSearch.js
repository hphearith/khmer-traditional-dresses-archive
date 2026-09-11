"use client";

import { useState } from "react";
import { matchGarment, parseQuery } from "../lib/garmentSearch.js";

const styles = {
  field: { marginTop: 20 },
  hint: { margin: "6px 0 0", fontSize: 12, color: "#97A1B3", lineHeight: 1.4 },
  wrap: { position: "relative" },
  input: {
    width: "100%", padding: "12px 36px 12px 14px", backgroundColor: "#1C222C",
    border: "1px solid #2E3644", borderRadius: 8, color: "#E8EDF2", fontSize: 14, outline: "none", boxSizing: "border-box",
  },
  clear: {
    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "#97A1B3", cursor: "pointer", fontSize: 14,
  },
  list: {
    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, backgroundColor: "#1C222C",
    border: "1px solid #2E3644", borderRadius: 8, zIndex: 20, margin: 0, padding: 0, listStyle: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
  item: { padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: "1px solid #252D3A", fontSize: 13 },
  active: { backgroundColor: "rgba(46, 230, 168, 0.12)", borderLeft: "3px solid #2EE6A8" },
};

/**
 * Auto-filtering search input with live autocomplete and keyboard navigation (Up/Down/Enter/Esc).
 */
export default function GarmentSearch({ query, onQueryChange, garments }) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const terms = parseQuery(query);

  const suggestions = terms.length
    ? garments.filter((g) => matchGarment(g, terms)).slice(0, 5)
    : [];

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!open) { setOpen(true); setCursor(0); return; }
      if (!suggestions.length) return;
      e.preventDefault();
      setCursor((c) => e.key === "ArrowDown" ? (c + 1) % suggestions.length : (c <= 0 ? suggestions.length - 1 : c - 1));
    } else if (e.key === "Enter" && open && cursor >= 0 && suggestions[cursor]) {
      e.preventDefault(); onQueryChange(suggestions[cursor].nameEn); setOpen(false); setCursor(-1);
    } else if (e.key === "Escape") { setOpen(false); setCursor(-1); }
  };

  const selectItem = (name) => { onQueryChange(name); setOpen(false); setCursor(-1); };

  return (
    <div style={styles.field}>
      <div style={styles.wrap}>
        <input
          type="search" placeholder="Try sampot…" aria-label="Search garments" aria-describedby="garment-search-hint"
          value={query} style={styles.input} onKeyDown={handleKeyDown}
          onChange={(e) => { onQueryChange(e.target.value); setOpen(true); setCursor(-1); }}
          onFocus={() => setOpen(true)} onClick={() => setOpen(true)}
          onBlur={() => { setOpen(false); setCursor(-1); }}
        />
        {query && (
          <button type="button" onClick={() => { onQueryChange(""); setOpen(false); }} style={styles.clear} aria-label="Clear search">✕</button>
        )}
        {open && suggestions.length > 0 && (
          <ul style={styles.list}>
            {suggestions.map((g, i) => (
              <li
                key={g.id} onMouseEnter={() => setCursor(i)}
                onMouseDown={(e) => { e.preventDefault(); selectItem(g.nameEn); }}
                style={{ ...styles.item, ...(i === cursor ? styles.active : {}) }}
              >
                <span style={{ color: "#E8EDF2" }}>{g.nameEn}</span>
                <span style={{ color: "#2EE6A8" }}>{g.nameKh}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p id="garment-search-hint" style={styles.hint}>
        Search by name, Khmer script, material, or description. Use &quot;quotes&quot; for a phrase.
      </p>
    </div>
  );
}
