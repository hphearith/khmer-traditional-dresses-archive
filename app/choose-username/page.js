import { redirect } from "next/navigation";
import Bilingual from "../../components/Bilingual.js";
import ChooseUsernameForm from "../../components/ChooseUsernameForm.js";
import Shop from "../../components/Shop.js";
import { logout } from "../../lib/logoutAction.js";
import { readUsername } from "../../lib/readUsername.js";
import { createClient } from "../../lib/supabase/server.js";
import { TEXT } from "../../lib/uiText.js";
import { readVisitor } from "../../lib/visitor.js";

export const dynamic = "force-dynamic";

export default async function ChooseUsernamePage() {
  const supabase = await createClient();
  const user = await readVisitor(supabase);
  if (!user) redirect("/login");

  // Only a positive "already has one" leaves this page. A failed lookup keeps
  // the step on screen, so the two pages can never bounce between each other.
  const { username } = await readUsername(supabase, user.id);
  if (username) redirect("/");

  return (
    <Shop>
      <main className="container sheet-page">
        <section className="sheet" aria-labelledby="choose-username-title">
          <h1 id="choose-username-title" className="sheet-title"><Bilingual text={TEXT.username.chooseTitle} /></h1>
          <p className="sheet-intro">
            <Bilingual text={TEXT.username.chooseIntro} />
          </p>
          <ChooseUsernameForm />
          <form action={logout} className="sheet-foot">
            <button type="submit" className="text-button">
              <Bilingual text={TEXT.username.logOutInstead} inline />
            </button>
          </form>
        </section>
      </main>
    </Shop>
  );
}
