import { readPendingEntries } from "./readEntries.js";

// What the Review queue page may show to the signed-in account. Returns
// { access, entries, error? }, where access is:
//   "reviewer"     is_reviewer answered exactly true: entries are the Pending
//                  entries, oldest submission first (possibly none).
//   "not-reviewer" is_reviewer answered anything else: no entry is read at all.
//   "failed"       the Reviewer check, or the queue read, errored: error says
//                  why. A failure is never reported as "not-reviewer" or as an
//                  empty queue, so a Reviewer is not told they lost their role.
// The database is the real gate (row-level security hides other people's
// Pending entries); this order only keeps the page tidy.
export async function readReviewQueue(supabase) {
  const { data: isReviewer, error: checkError } = await supabase.rpc("is_reviewer");
  if (checkError) return { access: "failed", entries: [], error: checkError };
  if (isReviewer !== true) return { access: "not-reviewer", entries: [] };

  const { entries, error } = await readPendingEntries(supabase);
  if (error) return { access: "failed", entries: [], error };
  return { access: "reviewer", entries };
}

// Asks the database to publish or return one Pending entry. Answers true only
// when review_entry's data is exactly true, with no error: a refusal is false
// (not a Reviewer, or the entry is no longer Pending) and an error is logged and
// also false, since a true that arrives with an error is not trusted.
// It goes through review_entry and never updates the entries table: a refused
// direct update matches no row and raises no error, so it would look like it
// worked (docs/adr/0004).
export async function decideOnEntry(supabase, entryId, decision) {
  const { data, error } = await supabase.rpc("review_entry", { entry_id: entryId, decision });
  if (error) {
    console.error(`The ${decision} decision on entry ${entryId} failed:`, error);
    return false;
  }
  return data === true;
}
