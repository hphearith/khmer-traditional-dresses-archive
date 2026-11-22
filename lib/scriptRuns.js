// Splits one string into runs of Khmer and non-Khmer text, so each run can
// carry its own lang (DESIGN.md, Khmer-Is-Content Rule). Used where a stored
// value mixes the two, such as an English material with a Khmer gloss:
// "Chong Kiet Tie-Dyed Silk (សូត្រចងគៀត)". The text itself is never changed:
// joining the runs gives back the original exactly.

// The Khmer block (U+1780 to U+17FF) and Khmer Symbols (U+19E0 to U+19FF).
const KHMER = /([ក-៿᧠-᧿]+)/;

export function scriptRuns(text) {
  return String(text)
    .split(KHMER)
    .filter((part) => part !== "")
    .map((part) => ({ text: part, lang: KHMER.test(part) ? "km" : "en" }));
}
