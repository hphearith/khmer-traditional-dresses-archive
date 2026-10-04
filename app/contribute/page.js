import Link from "next/link";
import { redirect } from "next/navigation";
import EntryForm from "../../components/EntryForm.js";
import { readUsername } from "../../lib/readUsername.js";
import { createClient } from "../../lib/supabase/server.js";

export const dynamic = "force-dynamic";

export default async function ContributePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Same rule as the home page: a failed lookup is not "no Username", so it
  // never bounces the account. The database still refuses an entry from an
  // account without a Username (supabase/entries.sql).
  const { username, error } = await readUsername(supabase, user.id);
  if (!error && !username) redirect("/choose-username");

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)", padding: "48px 16px" }}>
      <section aria-labelledby="contribute-title" style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
        <p style={{ marginBottom: 24 }}>
          <Link href="/?tab=community" style={{ color: "var(--wine)" }}>Back to the Community</Link>
        </p>
        <h1 id="contribute-title" style={{ fontSize: 40, marginBottom: 16 }}>Write an entry</h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          Tell the story of one dress you ordered or had made, in Khmer, English or both.
          Your entry is public as soon as you save it.
        </p>
        <EntryForm />
      </section>
    </main>
  );
}
