import Link from "next/link";
import { redirect } from "next/navigation";
import Bilingual from "../../components/Bilingual.js";
import ContributorEntryCard from "../../components/ContributorEntryCard.js";
import { readMyEntries } from "../../lib/readEntries.js";
import { readUsername } from "../../lib/readUsername.js";
import { createClient } from "../../lib/supabase/server.js";
import { TEXT } from "../../lib/uiText.js";

export const dynamic = "force-dynamic";

export default async function MyEntriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Same rule as /contribute: a failed lookup is not "no Username". The two
  // lookups do not depend on each other, so they run together.
  const [{ username, error: usernameError }, mine] = await Promise.all([
    readUsername(supabase, user.id),
    readMyEntries(supabase, user.id),
  ]);
  if (!usernameError && !username) redirect("/choose-username");
  if (mine.error) console.error("Reading My entries failed:", mine.error);

  return (
    <main className="container" style={{ minHeight: "100vh", padding: "48px 0" }}>
      <section aria-labelledby="my-entries-title">
        <p style={{ marginBottom: 24 }}>
          <Link href="/?tab=community" style={{ color: "var(--wine)" }}><Bilingual text={TEXT.page.backToCommunity} inline /></Link>
        </p>
        <h1 id="my-entries-title" style={{ fontSize: 40, marginBottom: 16 }}><Bilingual text={TEXT.community.myEntries} /></h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}><Bilingual text={TEXT.review.mineIntro} /></p>
        {mine.error ? (
          <div className="empty" role="alert">
            <h2><Bilingual text={TEXT.community.loadFailed} /></h2>
            <p><Bilingual text={TEXT.community.loadFailedHelp} /></p>
          </div>
        ) : mine.entries.length === 0 ? (
          <div className="empty">
            <h2><Bilingual text={TEXT.community.noneMine} /></h2>
            <a className="button" href="/contribute"><Bilingual text={TEXT.page.writeTitle} inline /></a>
          </div>
        ) : (
          <div className="grid">{mine.entries.map((entry) => <ContributorEntryCard key={entry.id} entry={entry} showStatus />)}</div>
        )}
      </section>
    </main>
  );
}
