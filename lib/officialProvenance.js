// Every Official record names its maker and place. When all of them share a
// value (today: one tailor shop in one city), the catalogue says it once and
// the cards leave it out, so seven identical lines don't drown the rest. A
// future record by another maker keeps its own line. Plain module (no React).

const FIELDS = ["maker", "place"];

function present(value) {
  return value !== null && value !== undefined && value !== "";
}

/** The provenance fields every record has, with one identical value. */
export function sharedProvenance(garments) {
  const shared = {};
  if (!garments.length) return shared;
  for (const field of FIELDS) {
    const first = garments[0][field];
    if (present(first) && garments.every((garment) => garment[field] === first)) shared[field] = first;
  }
  return shared;
}

/** The record with each shared field emptied, so its card skips that row. */
export function withoutShared(garment, shared) {
  const copy = { ...garment };
  for (const field of Object.keys(shared)) copy[field] = null;
  return copy;
}
