// The most characters a Return note may have, the same as review_entry's
// limit (supabase/entries-return-note.sql).
export const RETURN_NOTE_LIMIT = 500;

// Judges a Return note exactly the way review_entry does, so the screen never
// offers Send back for a note the database would refuse, or the other way round.
//   Trim: only space, tab, newline and carriage return, from the two ends, the
//   same set as btrim(note, E' \t\n\r'). Not String.prototype.trim(), which
//   also strips the non-breaking space and others that the database keeps.
//   Count: code points after trimming, like char_length. An emoji is one.
//   Refuse what Postgres text cannot hold: a NUL, or half of an emoji pair (a
//   lone surrogate). review_entry would fail on either, so Send back is not offered.
// Nothing inside the note is changed, so Khmer is handed back as written.
// Returns { ok, note, count }: note is the trimmed text to send when ok, and
// null when refused; count is the trimmed length either way, for the counter.
const UNSTORABLE = /\u0000|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

export function checkReturnNote(text) {
  const trimmed = String(text ?? "").replace(/^[ \t\n\r]+|[ \t\n\r]+$/g, "");
  const count = [...trimmed].length;
  const ok = count >= 1 && count <= RETURN_NOTE_LIMIT && !UNSTORABLE.test(trimmed);
  return { ok, note: ok ? trimmed : null, count };
}
