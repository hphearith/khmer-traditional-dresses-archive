// Keyword search for Contributor entries (the Community tab), using the same
// matching rules as the Official collection (lib/searchRules.js).
import { matchesTerms, parseQuery } from "./searchRules.js";

// Every field a keyword is allowed to hit. `credit` is the Credit already worked
// out by readCommunityEntries (credited-as text, else the @Username).
const FIELDS = ["title", "story", "credit", "maker", "place", "materials"];

/** The entries in which every keyword appears in at least one searched field. */
export function filterEntries(entries, query) {
  const terms = parseQuery(query);
  return entries.filter((entry) => matchesTerms(entry, FIELDS, terms));
}
