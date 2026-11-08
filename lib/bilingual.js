// A piece of interface text is a pair: { en, km }. The reader sees one half,
// in their Interface language (docs/adr/0005): components/Bilingual.js on
// screen, and pick() for text that has to be one plain string (a placeholder,
// an aria-label).

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

export function isPair(value) {
  return Boolean(value) && hasText(value.en) && hasText(value.km);
}

// One language of a pair, for text shown in the reader's Interface language
// (lib/language.js). The half is returned exactly as written.
export function pick(pair, language) {
  if (!isPair(pair)) throw new Error("A bilingual text needs both an en and a km text.");
  if (language !== "en" && language !== "km") throw new Error("The language must be en or km.");
  return pair[language];
}
