import Link from "next/link";
import { redirect } from "next/navigation";
import Bilingual from "../../components/Bilingual.js";
import ChangeUsernameForm from "../../components/ChangeUsernameForm.js";
import { readUsername } from "../../lib/readUsername.js";
import { createClient } from "../../lib/supabase/server.js";
import { TEXT, changeMessageText, yourUsernameText } from "../../lib/uiText.js";
import { checkUsernameChange } from "../../lib/usernameChange.js";

export const dynamic = "force-dynamic";

export default async function ChangeUsernamePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { username, changedAt, error } = await readUsername(supabase, user.id);
  if (!error && !username) redirect("/choose-username");

  // Only an early answer: the database refuses a change inside the wait even
  // if this page is stale or the form is skipped (supabase/change-username.sql).
  const change = checkUsernameChange(changedAt);

  return (
    <main style={{
      minHeight: "100vh", background: "var(--paper)", color: "var(--ink)",
      padding: "48px 24px", display: "grid", placeItems: "center",
    }}>
      <section aria-labelledby="change-username-title" style={{ width: "100%", maxWidth: 440 }}>
        <p style={{ marginBottom: 24 }}>
          <Link href="/" style={{ color: "var(--wine)" }}><Bilingual text={TEXT.username.backToArchive} inline /></Link>
        </p>
        <h1 id="change-username-title" style={{ fontSize: 40, marginBottom: 16 }}><Bilingual text={TEXT.username.changeTitle} /></h1>
        {username && (
          <p style={{ marginBottom: 16 }}><Bilingual text={yourUsernameText(username)} /></p>
        )}
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          <Bilingual text={TEXT.username.changeIntro} />
        </p>
        {error && (
          <p role="alert" style={{ marginBottom: 32 }}>
            <Bilingual text={TEXT.username.checkFailed} />
          </p>
        )}
        {change.allowed ? (
          <ChangeUsernameForm />
        ) : (
          <p role="status">
            <Bilingual text={changeMessageText({ reason: "too-soon", allowedAt: change.allowedAt })} />
          </p>
        )}
      </section>
    </main>
  );
}
