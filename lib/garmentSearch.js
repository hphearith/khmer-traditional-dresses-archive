// Shared keyword + faceted search rules for garment entries.
// Plain module (no React) so that the results grid and the autocomplete
// dropdown always agree on what a match is.

// Every field a keyword is allowed to hit.
const FIELDS = ["nameEn", "nameKh", "material", "description"];

/**
 * Turns the raw search box value into a list of keywords.
 * Words wrapped in double quotes stay together as one phrase, so
 * `"sampot chang"` matches those two words only when they are adjacent.
 * Bare words each count as their own keyword. An unclosed quote (still
 * being typed, e.g. `"sam`) is treated as a normal keyword so the
 * autocomplete keeps working mid-type.
 */
export function parseQuery(input) {
  const terms = [];
  const pattern = /"([^"]+)"|(\S+)/g;
  let match;
  while ((match = pattern.exec(String(input || ""))) !== null) {
    const term = (match[1] || match[2] || "").replace(/"/g, "").trim();
    if (term) terms.push(term.toLowerCase());
  }
  return terms;
}

/** True when every keyword appears somewhere in the entry (AND match). */
export function matchGarment(garment, terms) {
  if (!terms.length) return true;
  return terms.every((term) =>
    FIELDS.some((field) =>
      String(garment[field] || "").toLowerCase().includes(term)
    )
  );
}

/**
 * Faceted (category tab) + keyword search, combined with AND:
 * an entry must belong to the active category *and* match every keyword.
 */
export function filterGarments(garments, { activeTab, query }) {
  const terms = parseQuery(query);
  return garments.filter(
    (g) =>
      (activeTab === "all" || g.category === activeTab) &&
      matchGarment(g, terms)
  );
}
