import { isOwnedBy, resolveCredit } from "./entry.js";

// Every column a Contributor entry is read with. The edit page reads the same list.
export const ENTRY_COLUMNS = "id, owner, title, story, credited_as, occasion, year, maker, place, materials";

// Reads every Contributor entry, newest first, each with its Credit worked out
// from the owner's current Username. An entry is marked mine only when it
// belongs to viewerId, so the owner's id never reaches the page. Returns
// { entries, error }; callers must show a non-null error as a failed read, not
// as "no entries yet".
export async function readCommunityEntries(supabase, viewerId = null) {
  const { data: rows, error } = await supabase
    .from("entries")
    .select(ENTRY_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) return { entries: [], error };
  if (rows.length === 0) return { entries: [], error: null };

  const owners = [...new Set(rows.map((row) => row.owner))];
  const { data: names, error: namesError } = await supabase
    .from("usernames")
    .select("user_id, username")
    .in("user_id", owners);
  if (namesError) return { entries: [], error: namesError };

  const usernameOf = new Map(names.map((name) => [name.user_id, name.username]));
  const entries = rows.map(({ owner, credited_as, ...entry }) => ({
    ...entry,
    credit: resolveCredit(credited_as, usernameOf.get(owner)),
    mine: isOwnedBy(owner, viewerId),
  }));
  return { entries, error: null };
}
