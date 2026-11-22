import Link from "next/link";
import { redirect } from "next/navigation";
import Bilingual from "../../components/Bilingual.js";
import ChangeUsernameForm from "../../components/ChangeUsernameForm.js";
import Shop from "../../components/Shop.js";
import { readUsername } from "../../lib/readUsername.js";
import { createClient } from "../../lib/supabase/server.js";
import { TEXT, changeMessageText, yourUsernameText } from "../../lib/uiText.js";
import { checkUsernameChange } from "../../lib/usernameChange.js";
import { readVisitor } from "../../lib/visitor.js";

export const dynamic = "force-dynamic";

export default async function ChangeUsernamePage() {
  const supabase = await createClient();
  const user = await readVisitor(supabase);
  if (!user) redirect("/login");

  const { username, changedAt, error } = await readUsername(supabase, user.id);
  if (!error && !username) redirect("/choose-username");

  // Only an early answer: the database refuses a change inside the wait even
  // if this page is stale or the form is skipped (supabase/change-username.sql).
  const change = checkUsernameChange(changedAt);

  return (
    <Shop>
      <main className="container sheet-page">
        <Link className="back-link" href="/"><Bilingual text={TEXT.username.backToArchive} inline /></Link>
        <section className="sheet" aria-labelledby="change-username-title">
          <h1 id="change-username-title" className="sheet-title"><Bilingual text={TEXT.username.changeTitle} /></h1>
          {username && (
            <p className="sheet-current"><Bilingual text={yourUsernameText(username)} /></p>
          )}
          <p className="sheet-intro">
            <Bilingual text={TEXT.username.changeIntro} />
          </p>
          {error && (
            <p role="alert" className="form-alert sheet-alert">
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
    </Shop>
  );
}
