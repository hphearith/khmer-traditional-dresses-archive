// Reads an account's own Username from the public usernames table.
// Returns { username, error }: username is null when the account has none.
// Callers must treat a non-null error as "unknown", not as "no Username".
export async function readUsername(supabase, userId) {
  const { data, error } = await supabase
    .from("usernames")
    .select("username")
    .eq("user_id", userId)
    .maybeSingle();

  return { username: data?.username ?? null, error };
}
