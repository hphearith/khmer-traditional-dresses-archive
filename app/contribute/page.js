import Link from "next/link";
import { redirect } from "next/navigation";
import Bilingual from "../../components/Bilingual.js";
import EntryForm from "../../components/EntryForm.js";
import { readUsername } from "../../lib/readUsername.js";
import { readIsReviewer } from "../../lib/review.js";
import { createClient } from "../../lib/supabase/server.js";
import { TEXT } from "../../lib/uiText.js";
import { readVisitor } from "../../lib/visitor.js";

export const dynamic = "force-dynamic";

export default async function ContributePage() {
  const supabase = await createClient();
  const user = await readVisitor(supabase);
  if (!user) redirect("/login");

  // Both reads start at once. A Reviewer's own entry needs no review, so they
  // are not told it does. If the check fails, isReviewer is false and the page
  // says what it says to a Contributor.
  const [{ username, error }, isReviewer] = await Promise.all([
    readUsername(supabase, user.id),
    readIsReviewer(supabase, user),
  ]);

  // Same rule as the home page: a failed lookup is not "no Username", so it
  // never bounces the account. The database still refuses an entry from an
  // account without a Username (supabase/entries.sql).
  if (!error && !username) redirect("/choose-username");

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)", padding: "48px 16px" }}>
      <section aria-labelledby="contribute-title" style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
        <p style={{ marginBottom: 24 }}>
          <Link href="/?tab=community" style={{ color: "var(--wine)" }}><Bilingual text={TEXT.page.backToCommunity} inline /></Link>
        </p>
        <h1 id="contribute-title" style={{ fontSize: 40, marginBottom: 16 }}><Bilingual text={TEXT.page.writeTitle} /></h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          <Bilingual text={isReviewer ? TEXT.page.writeIntroReviewer : TEXT.page.writeIntro} />
        </p>
        <EntryForm userId={user.id} isReviewer={isReviewer} />
      </section>
    </main>
  );
}
