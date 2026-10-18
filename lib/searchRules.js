// The matching rules both searches share (Official collection and Community).
// Plain module (no React). Each search decides which fields to read; the rules
// for what counts as a match live here so the two can never drift apart.

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

/** True when every keyword appears in at least one of the record's fields (AND match). */
export function matchesTerms(record, fields, terms) {
  if (!terms.length) return true;
  return terms.every((term) =>
    fields.some((field) =>
      String(record[field] || "").toLowerCase().includes(term)
    )
  );
}
