// A piece of interface text is a pair: { en, km }. The archive shows both at
// once for now (components/Bilingual.js). Everything that needs the text as one
// plain string (a placeholder, an aria-label) goes through combined().

function hasText(value) {
  return typeof value === "string" && value.trim() !== "";
}

export function isPair(value) {
  return Boolean(value) && hasText(value.en) && hasText(value.km);
}

// The Khmer is joined as it was written: nothing is trimmed, normalised or fixed.
export function combined(pair) {
  if (!isPair(pair)) throw new Error("A bilingual text needs both an en and a km text.");
  return `${pair.en} · ${pair.km}`;
}
