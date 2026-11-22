import { isOwnedBy, resolveCredit } from "./entry.js";
import { photoUrl } from "./photoStorage.js";

// Every column a Contributor entry is read with. The edit page reads the same list.
// It never holds return_note: the Community reads exactly this list, and a
// Return note is only for the entry's Contributor and Reviewers.
export const ENTRY_COLUMNS = "id, owner, title, story, credited_as, occasion, year, maker, place, materials, photo_path";

// What the owner reads of their own entries, on My entries and the edit page:
// every column, plus where the entry stands and its Return note.
export const OWN_ENTRY_COLUMNS = `${ENTRY_COLUMNS}, status, return_note`;

// The owner's current Username, read in the same request as each entry through
// the foreign key from entries.owner to usernames.user_id
// (supabase/entries-owner-username.sql). Usernames are public, so this shows
// nothing a guest could not already read.
const CREDIT_COLUMN = "usernames(username)";

// Reads every published Contributor entry, newest first, each with its Credit
// worked out from the owner's current Username. An entry is marked mine only
// when it belongs to viewerId, so the owner's id never reaches the page.
// Returns { entries, error }; callers must show a non-null error as a failed
// read, not as "no entries yet".
// The database already hides other people's unpublished entries. The status
// filter is still needed: the owner, and a reviewer, are allowed to read more,
// and the Community must look the same to them as to a guest.
export async function readCommunityEntries(supabase, viewerId = null) {
  const query = supabase
    .from("entries")
    .select(`${ENTRY_COLUMNS}, ${CREDIT_COLUMN}`)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return withCredits(supabase, query, viewerId);
}

// Reads the signed-in account's own entries in every status, newest first,
// with the status kept so the page can say where each one stands, and the
// Return note so a Returned entry can show what to change.
export async function readMyEntries(supabase, ownerId) {
  const query = supabase
    .from("entries")
    .select(`${OWN_ENTRY_COLUMNS}, ${CREDIT_COLUMN}`)
    .eq("owner", ownerId)
    .order("created_at", { ascending: false });
  return withCredits(supabase, query, ownerId);
}

// Reads every Pending Contributor entry, oldest submission first, for the
// Review queue. created_at is kept so the page can say when each was submitted,
// and return_note so an entry Returned before shows the note it was sent with.
// Credits and photo addresses are worked out exactly as for the Community. No
// entry is marked mine: the queue offers no Edit or Delete, even on a
// Reviewer's own entries. The database shows Pending entries only to their
// owner and to Reviewers; readReviewQueue (lib/review.js) checks the Reviewer
// first, so nobody else's call reaches this read.
export async function readPendingEntries(supabase) {
  const query = supabase
    .from("entries")
    .select(`${ENTRY_COLUMNS}, created_at, updated_at, return_note, ${CREDIT_COLUMN}`)
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return withCredits(supabase, query, null);
}

// Reads one Contributor entry for its own page (app/entries/[id]/page.js),
// with when it was submitted and where it stands. The database decides who
// may see it: a Published entry is public, a Pending or Returned one only
// reaches its Contributor and Reviewers. Everyone else gets no row, and the
// page says Not found. Returns { entry, error }; entry is null when there is
// no row. The Return note is never read here.
export async function readEntry(supabase, id, viewerId = null) {
  const query = supabase
    .from("entries")
    .select(`${ENTRY_COLUMNS}, created_at, status, ${CREDIT_COLUMN}`)
    .eq("id", id)
    .limit(1);
  const { entries, error } = await withCredits(supabase, query, viewerId);
  return { entry: entries[0] ?? null, error };
}

// Each entry's Credit, from the Username that came with it in the same
// request. Neither the owner's id nor the embedded Username reaches the page.
async function withCredits(supabase, query, viewerId) {
  const { data: rows, error } = await query;
  if (error) return { entries: [], error };

  const entries = rows.map(({ owner, credited_as, photo_path, usernames, ...entry }) => ({
    ...entry,
    photo_url: photo_path ? photoUrl(supabase, photo_path) : null,
    credit: resolveCredit(credited_as, usernames?.username),
    mine: isOwnedBy(owner, viewerId),
  }));
  return { entries, error: null };
}
