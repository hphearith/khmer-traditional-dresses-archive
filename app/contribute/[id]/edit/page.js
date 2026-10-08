import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import EntryForm from "../../../../components/EntryForm.js";
import { formValuesFromEntry, isOwnedBy } from "../../../../lib/entry.js";
import { ENTRY_COLUMNS } from "../../../../lib/readEntries.js";
import { readUsername } from "../../../../lib/readUsername.js";
import { createClient } from "../../../../lib/supabase/server.js";

export const dynamic = "force-dynamic";

// Entry ids are UUIDs. Anything else cannot be an entry, so it is never looked up.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditEntryPage({ params }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Same rule as /contribute: a failed lookup is not "no Username".
  const { username, error: usernameError } = await readUsername(supabase, user.id);
  if (!usernameError && !username) redirect("/choose-username");

  // Entries are public, so this read succeeds for anyone. Only the owner gets
  // the form here, and the database refuses a save from anyone else.
  const { data: entry, error } = await supabase
    .from("entries")
    .select(ENTRY_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) console.error("Reading the entry to edit failed:", error);
  else if (!entry) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)", padding: "48px 16px" }}>
      <section aria-labelledby="edit-title" style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
        <p style={{ marginBottom: 24 }}>
          <Link href="/?tab=community" style={{ color: "var(--wine)" }}>Back to the Community</Link>
        </p>
        <h1 id="edit-title" style={{ fontSize: 40, marginBottom: 16 }}>Edit your entry</h1>
        {error ? (
          <p role="alert" style={{ color: "red" }}>This entry could not be loaded. Go back to the Community and try again.</p>
        ) : !isOwnedBy(entry.owner, user.id) ? (
          <p role="alert" style={{ color: "red" }}>You can only change entries you wrote.</p>
        ) : (
          <>
            <p style={{ color: "var(--muted)", marginBottom: 32 }}>
              Changes go live only when you choose Save changes. The entry keeps its place on the Community tab.
            </p>
            <EntryForm entryId={entry.id} initial={formValuesFromEntry(entry)} />
          </>
        )}
      </section>
    </main>
  );
}
