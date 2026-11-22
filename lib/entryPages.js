// Where each Contributor entry's own page lives. Plain module (no React), so it
// is tested in tests/entry-pages.test.mjs.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The address of an entry's page, such as /entries/0b9c7a52-…. */
export function entryHref(id) {
  return `/entries/${id}`;
}

/** True for a uuid, the only shape an entry id has. Anything else is not
 * found without asking the database, which would refuse it as an error. */
export function isEntryId(value) {
  return typeof value === "string" && UUID.test(value);
}
