// Keyword + faceted search for garment entries (the Official collection).
// Plain module (no React) so that the results grid and the autocomplete
// dropdown always agree on what a match is. The matching rules themselves are
// shared with the Community search: see lib/searchRules.js.
import { matchesTerms, parseQuery } from "./searchRules.js";

export { parseQuery };

// Every field a keyword is allowed to hit.
const FIELDS = ["nameEn", "nameKh", "material", "description"];

/** True when every keyword appears somewhere in the entry (AND match). */
export function matchGarment(garment, terms) {
  return matchesTerms(garment, FIELDS, terms);
}

// Any letter from the Khmer and Khmer Symbols Unicode blocks.
const KHMER = /[\u1780-\u17FF\u19E0-\u19FF]/;

/**
 * The name a chosen suggestion puts in the search box: Khmer when the reader
 * typed any Khmer, English otherwise, so the query stays in their script.
 */
export function suggestionValue(garment, query) {
  return KHMER.test(String(query || "")) ? garment.nameKh : garment.nameEn;
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
