// Where each Official record's own page lives, and finding the record for one.
// Plain module (no React), so both are tested in tests/garment-pages.test.mjs.

/** The address of a record's page, such as /garments/sampot-hol. */
export function garmentHref(id) {
  return `/garments/${id}`;
}

/** The record with this id, or null when there is none. */
export function findGarment(garments, id) {
  return garments.find((garment) => garment.id === id) ?? null;
}
