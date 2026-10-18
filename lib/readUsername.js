// Reads an account's own Username from the public usernames table.
// Returns { username, changedAt, error }: username is null when the account has
// none, and changedAt is null until the Username is first changed.
// Callers must treat a non-null error as "unknown", not as "no Username".
export async function readUsername(supabase, userId) {
  const { data, error } = await supabase
    .from("usernames")
    .select("username, changed_at")
    .eq("user_id", userId)
    .maybeSingle();

  return { username: data?.username ?? null, changedAt: data?.changed_at ?? null, error };
}
