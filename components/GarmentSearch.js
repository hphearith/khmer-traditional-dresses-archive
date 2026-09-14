"use client";

import { useState } from "react";
import { matchGarment, parseQuery } from "../lib/garmentSearch.js";
import GarmentSuggestions from "./GarmentSuggestions.js";

const LIST_ID = "garment-search-suggestions";

export default function GarmentSearch({ query, onQueryChange, garments, inputRef }) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const terms = parseQuery(query);
  const suggestions = terms.length
    ? garments.filter((garment) => matchGarment(garment, terms)).slice(0, 5)
    : [];
  const expanded = open && suggestions.length > 0;
  const activeId = expanded && cursor >= 0 && suggestions[cursor]
    ? `garment-suggestion-${suggestions[cursor].id}`
    : undefined;

  const selectItem = (name) => {
    onQueryChange(name);
    setOpen(false);
    setCursor(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!open) {
        setOpen(true);
        setCursor(0);
        return;
      }
      if (!suggestions.length) return;
      event.preventDefault();
      setCursor((current) => {
        return event.key === "ArrowDown"
          ? (current + 1) % suggestions.length
          : (current <= 0 ? suggestions.length - 1 : current - 1);
      });
    } else if (event.key === "Enter" && expanded && suggestions[cursor]) {
      event.preventDefault();
      selectItem(suggestions[cursor].nameEn);
    } else if (event.key === "Escape") {
      setOpen(false);
      setCursor(-1);
    }
  };

  return (
    <div className="search-field">
      <label className="search-label" htmlFor="garment-search">Search the archive</label>
      <div className="search-control">
        <input
          id="garment-search"
          ref={inputRef}
          type="search"
          role="combobox"
          placeholder="Try sampot, silk, or a Khmer name…"
          value={query}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls={expanded ? LIST_ID : undefined}
          aria-expanded={expanded}
          aria-activedescendant={activeId}
          aria-describedby="garment-search-hint"
          onKeyDown={handleKeyDown}
          onChange={(event) => { onQueryChange(event.target.value); setOpen(true); setCursor(-1); }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onBlur={() => { setOpen(false); setCursor(-1); }}
        />
        {query && (
          <button className="search-clear" type="button" aria-label="Clear search" onClick={() => { onQueryChange(""); setOpen(false); setCursor(-1); }}>
            ✕
          </button>
        )}
        {expanded && <GarmentSuggestions suggestions={suggestions} cursor={cursor} onHover={setCursor} onSelect={selectItem} />}
      </div>
      <p className="search-hint" id="garment-search-hint">Search English or Khmer names, materials, and descriptions. Use quotes for an exact phrase.</p>
    </div>
  );
}
