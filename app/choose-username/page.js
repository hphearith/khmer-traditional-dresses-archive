import { redirect } from "next/navigation";
import Bilingual from "../../components/Bilingual.js";
import ChooseUsernameForm from "../../components/ChooseUsernameForm.js";
import { logout } from "../../lib/logoutAction.js";
import { readUsername } from "../../lib/readUsername.js";
import { createClient } from "../../lib/supabase/server.js";
import { TEXT } from "../../lib/uiText.js";

export const dynamic = "force-dynamic";

export default async function ChooseUsernamePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Only a positive "already has one" leaves this page. A failed lookup keeps
  // the step on screen, so the two pages can never bounce between each other.
  const { username } = await readUsername(supabase, user.id);
  if (username) redirect("/");

  return (
    <main style={{
      minHeight: "100vh", background: "var(--paper)", color: "var(--ink)",
      padding: "48px 24px", display: "grid", placeItems: "center",
    }}>
      <section aria-labelledby="choose-username-title" style={{ width: "100%", maxWidth: 440 }}>
        <h1 id="choose-username-title" style={{ fontSize: 40, marginBottom: 16 }}><Bilingual text={TEXT.username.chooseTitle} /></h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          <Bilingual text={TEXT.username.chooseIntro} />
        </p>
        <ChooseUsernameForm />
        <form action={logout} style={{ marginTop: 32 }}>
          <button type="submit" style={{ border: 0, padding: 0, minHeight: 44, background: "transparent", color: "inherit", textDecoration: "underline", textUnderlineOffset: 5 }}>
            <Bilingual text={TEXT.username.logOutInstead} inline />
          </button>
        </form>
      </section>
    </main>
  );
}
