import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Bilingual from "../../../../components/Bilingual.js";
import EntryForm from "../../../../components/EntryForm.js";
import { formValuesFromEntry, isOwnedBy } from "../../../../lib/entry.js";
import { photoUrl } from "../../../../lib/photoStorage.js";
import { ENTRY_COLUMNS } from "../../../../lib/readEntries.js";
import { readUsername } from "../../../../lib/readUsername.js";
import { createClient } from "../../../../lib/supabase/server.js";
import { TEXT } from "../../../../lib/uiText.js";

export const dynamic = "force-dynamic";

// Entry ids are UUIDs. Anything else cannot be an entry, so it is never looked up.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditEntryPage({ params }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // The two lookups do not depend on each other, so they run together. The
  // rules still apply in order: Username first, then the entry. Published
  // entries can be read by anyone, so only the owner gets the form, and the
  // database refuses a save from anyone else. An unpublished entry is not
  // found at all, except by its owner or a reviewer.
  const [{ username, error: usernameError }, { data: entry, error }] = await Promise.all([
    readUsername(supabase, user.id),
    supabase.from("entries").select(ENTRY_COLUMNS).eq("id", id).maybeSingle(),
  ]);

  // Same rule as /contribute: a failed lookup is not "no Username".
  if (!usernameError && !username) redirect("/choose-username");
  if (error) console.error("Reading the entry to edit failed:", error);
  else if (!entry) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)", padding: "48px 16px" }}>
      <section aria-labelledby="edit-title" style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
        <p style={{ marginBottom: 24 }}>
          <Link href="/?tab=community" style={{ color: "var(--wine)" }}><Bilingual text={TEXT.page.backToCommunity} inline /></Link>
        </p>
        <h1 id="edit-title" style={{ fontSize: 40, marginBottom: 16 }}><Bilingual text={TEXT.page.editTitle} /></h1>
        {error ? (
          <p role="alert" style={{ color: "red" }}><Bilingual text={TEXT.page.editLoadFailed} /></p>
        ) : !isOwnedBy(entry.owner, user.id) ? (
          <p role="alert" style={{ color: "red" }}><Bilingual text={TEXT.page.editNotOwner} /></p>
        ) : (
          <>
            <p style={{ color: "var(--muted)", marginBottom: 32 }}>
              <Bilingual text={TEXT.page.editIntro} />
            </p>
            <EntryForm userId={user.id} entryId={entry.id} initial={formValuesFromEntry(entry)}
              photo={{ path: entry.photo_path, url: photoUrl(supabase, entry.photo_path) }} />
          </>
        )}
      </section>
    </main>
  );
}
