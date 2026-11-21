// Who is signed in, for a server page. Returns { id, email }, or null for a
// guest or a session that fails the check.
//
// It reads the session's token with getClaims, which checks the token's
// signature against the project's public signing key (ECC P-256), kept in
// memory once fetched. So the page learns who the visitor is without asking
// the Supabase Auth server again: the middleware has already checked and,
// when needed, refreshed this same session on this request.
//
// Like the database, which trusts a correctly signed token until it expires,
// this does not notice a session ended elsewhere (signing out on another
// device) until the token expires, at most an hour. Every read and write is
// still checked by row-level security in the database.
export async function readVisitor(supabase) {
  const { data, error } = await supabase.auth.getClaims();
  if (error) return null;

  const id = data?.claims?.sub;
  if (typeof id !== "string" || id === "") return null;
  return { id, email: data.claims.email ?? null };
}
