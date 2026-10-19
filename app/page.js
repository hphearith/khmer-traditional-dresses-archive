import collection from "../collection.config.js";
import Bilingual from "../components/Bilingual.js";
import HomeTabs from "../components/HomeTabs.js";
import garments from "../data/garments.js";
import { combined } from "../lib/bilingual.js";
import { logout } from "../lib/logoutAction.js";
import { readCommunityEntries } from "../lib/readEntries.js";
import { readUsername } from "../lib/readUsername.js";
import { createClient } from "../lib/supabase/server.js";
import { TEXT, bylineText, heroCaptionText, identityText } from "../lib/uiText.js";
import { redirect } from "next/navigation";

// The hero shows this Official record's photo: Apsara Mode Tailor's sign is behind it.
const heroGarment = garments.find((garment) => garment.id === "av-chang-pong");

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guests have no user, so they never reach this lookup. A failed lookup is
  // not "no Username": it lets the page load rather than trapping the account.
  if (user) {
    const { username, error } = await readUsername(supabase, user.id);
    if (!error && !username) redirect("/choose-username");
  }

  // Read with the visitor's own access: guests read as anonymous, and no
  // cookie is set for them. A signed-in visitor's own entries are marked, so
  // the Community tab can offer My entries.
  const identity = identityText(collection);
  const community = await readCommunityEntries(supabase, user?.id);
  if (community.error) console.error("Reading Community entries failed:", community.error);

  return (
    <>
      <a className="skip" href="#collection"><Bilingual text={TEXT.home.skip} inline /></a>
      <header className="container masthead">
        <a className="brand" href="#top">
          <span className="mark" aria-hidden="true">✳</span>
          <span className="label"><Bilingual text={TEXT.home.brand} inline /></span>
        </a>
        <nav aria-label={combined(TEXT.home.navLabel)}>
          <a href="#collection"><Bilingual text={TEXT.home.navCollection} inline /></a>
          <a href="#about"><Bilingual text={TEXT.home.navAbout} inline /></a>
          {user ? (
            <>
              <span style={{ display: "flex", minHeight: 44, alignItems: "center", color: "var(--muted)", fontSize: 14 }}>
                {user.email}
              </span>
              <a href="/change-username"><Bilingual text={TEXT.username.change} inline /></a>
              <form action={logout} style={{ display: "flex" }}>
                <button type="submit" style={{ border: 0, padding: 0, background: "transparent", color: "inherit", fontSize: 14, textDecoration: "underline", textUnderlineOffset: 5 }}>
                  <Bilingual text={TEXT.home.logOut} inline />
                </button>
              </form>
            </>
          ) : (
            <>
              <a href="/login"><Bilingual text={TEXT.auth.logIn} inline /></a>
              <a href="/signup"><Bilingual text={TEXT.auth.signUp} inline /></a>
            </>
          )}
        </nav>
      </header>
      <main id="top">
        <section className="container hero" aria-labelledby="archive-name">
          <div className="hero-copy">
            <p className="label"><Bilingual text={TEXT.home.heroLabel} /></p>
            <h1 id="archive-name"><Bilingual text={identity.name} /></h1>
            <p className="lead"><Bilingual text={identity.description} /></p>
            <a className="button" href="#collection"><Bilingual text={TEXT.home.browse} inline /> <span aria-hidden="true">↗</span></a>
            <p className="hero-note"><Bilingual text={TEXT.home.heroNote} /></p>
          </div>
          <figure>
            <div className="hero-art">
              <img className="hero-image" src={heroGarment.imageUrl} alt={`${heroGarment.nameEn} (${heroGarment.nameKh})`} width="3" height="4" />
            </div>
            <figcaption><Bilingual text={heroCaptionText(heroGarment)} /></figcaption>
          </figure>
        </section>

        <HomeTabs communityEntries={community.entries} communityFailed={Boolean(community.error)} signedIn={Boolean(user)} />

        <section className="source" id="about" aria-labelledby="source-heading">
          <div className="container source-inner">
            <div>
              <p className="label"><Bilingual text={TEXT.home.aboutLabel} inline /></p>
              <h2 id="source-heading"><Bilingual text={TEXT.home.aboutHeading} /></h2>
            </div>
            <div>
              <p className="source-copy"><Bilingual text={identity.source} /></p>
              <p className="byline"><Bilingual text={bylineText(collection.curator)} /></p>
            </div>
          </div>
        </section>
      </main>
      <footer className="container">
        <p><Bilingual text={identity.name} /></p>
        <p><Bilingual text={TEXT.home.footer} /></p>
      </footer>
    </>
  );
}
