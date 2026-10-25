import { isOwnedBy, resolveCredit } from "./entry.js";
import { photoUrl } from "./photoStorage.js";

// Every column a Contributor entry is read with. The edit page reads the same list.
export const ENTRY_COLUMNS = "id, owner, title, story, credited_as, occasion, year, maker, place, materials, photo_path";

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
    .select(ENTRY_COLUMNS)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return withCredits(supabase, query, viewerId);
}

// Reads the signed-in account's own entries in every status, newest first,
// with the status kept so the page can say where each one stands.
export async function readMyEntries(supabase, ownerId) {
  const query = supabase
    .from("entries")
    .select(`${ENTRY_COLUMNS}, status`)
    .eq("owner", ownerId)
    .order("created_at", { ascending: false });
  return withCredits(supabase, query, ownerId);
}

async function withCredits(supabase, query, viewerId) {
  const { data: rows, error } = await query;
  if (error) return { entries: [], error };
  if (rows.length === 0) return { entries: [], error: null };

  const owners = [...new Set(rows.map((row) => row.owner))];
  const { data: names, error: namesError } = await supabase
    .from("usernames")
    .select("user_id, username")
    .in("user_id", owners);
  if (namesError) return { entries: [], error: namesError };

  const usernameOf = new Map(names.map((name) => [name.user_id, name.username]));
  const entries = rows.map(({ owner, credited_as, photo_path, ...entry }) => ({
    ...entry,
    photo_url: photo_path ? photoUrl(supabase, photo_path) : null,
    credit: resolveCredit(credited_as, usernameOf.get(owner)),
    mine: isOwnedBy(owner, viewerId),
  }));
  return { entries, error: null };
}
