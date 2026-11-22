import { Archivo, Marcellus } from "next/font/google";
import collection from "../collection.config.js";
import Bilingual from "../components/Bilingual.js";
import HeroImage from "../components/HeroImage.js";
import HomeNav from "../components/HomeNav.js";
import HomeTabs from "../components/HomeTabs.js";
import garments from "../data/garments.js";
import { logout } from "../lib/logoutAction.js";
import { readCommunityEntries, readMyEntries } from "../lib/readEntries.js";
import { readUsername } from "../lib/readUsername.js";
import { readIsReviewer } from "../lib/review.js";
import { createClient } from "../lib/supabase/server.js";
import { TEXT, bylineText, heroCaptionText, identityText } from "../lib/uiText.js";
import { readVisitor } from "../lib/visitor.js";
import { redirect } from "next/navigation";
import "./home.css";

// The two Latin faces of the salon (the surface brief allows both). Archivo,
// stretched wide, is only the sign's English; Marcellus is every other English
// heading and name. Khmer uses the font stacks in home.css.
const wide = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-wide", display: "swap" });
const salon = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-salon", display: "swap" });

// The hero shows this Official record's photo: Apsara Mode Tailor's sign is behind it.
const heroGarment = garments.find((garment) => garment.id === "av-chang-pong");

export default async function Home() {
  const supabase = await createClient();
  const user = await readVisitor(supabase);

  // Every read starts at once, so the page waits for the slowest one, not
  // their sum. Read with the visitor's own access: guests read as anonymous,
  // and no cookie is set for them. Only a signed-in visitor has a Username to
  // look up, gets a second read, of their own entries in every status, for My
  // entries, and is asked whether they are a Reviewer; each list fails on its
  // own, and the Review queue link needs a plain true.
  const identity = identityText(collection);
  const [account, community, mine, isReviewer] = await Promise.all([
    user ? readUsername(supabase, user.id) : null,
    readCommunityEntries(supabase, user?.id),
    user ? readMyEntries(supabase, user.id) : { entries: [], error: null },
    readIsReviewer(supabase, user),
  ]);

  // An account without a Username is sent to choose one before anything is
  // shown. A failed lookup is not "no Username": it lets the page load rather
  // than trapping the account.
  if (account && !account.error && !account.username) redirect("/choose-username");
  if (community.error) console.error("Reading Community entries failed:", community.error);
  if (mine.error) console.error("Reading My entries failed:", mine.error);

  return (
    <div className={`shop ${wide.variable} ${salon.variable}`}>
      <a className="skip" href="#collection"><Bilingual text={TEXT.home.skip} inline /></a>
      <div className="cove" aria-hidden="true" />
      <div className="container shop-top" id="top">
        <a className="shop-brand" href="#top"><Bilingual text={TEXT.home.brand} inline /></a>
        <HomeNav>
          <a href="#collection"><Bilingual text={TEXT.home.navCollection} inline /></a>
          <a href="/#about"><Bilingual text={TEXT.home.navAbout} inline /></a>
          {user ? (
            <>
              <span className="shop-email">{user.email}</span>
              {isReviewer && <a href="/review"><Bilingual text={TEXT.review.queue.title} inline /></a>}
              <a href="/change-username"><Bilingual text={TEXT.username.change} inline /></a>
              <form action={logout} className="shop-logout">
                <button type="submit"><Bilingual text={TEXT.home.logOut} inline /></button>
              </form>
            </>
          ) : (
            <>
              <a href="/login"><Bilingual text={TEXT.auth.logIn} inline /></a>
              <a href="/signup"><Bilingual text={TEXT.auth.signUp} inline /></a>
            </>
          )}
        </HomeNav>
      </div>

      {/* The shop sign. Like a Cambodian shop sign, the Khmer name is always
          on top and larger, whichever language the page is in. */}
      <header className="signboard">
        <div className="container sign-face">
          <img className="sign-tools" src="/images/salon/tools-gold.svg" alt="" width="170" height="90" />
          <h1>
            <span className="sign-km" lang="km">{collection.nameKm}</span>
            <span className="sign-en" lang="en">{collection.name}</span>
          </h1>
        </div>
      </header>
      <div className="soffit" aria-hidden="true" />

      {/* Inside the salon: the house dress in its frame, over the marble wainscot. */}
      <section className="salon">
        <div className="container salon-inner">
          <div className="salon-copy">
            <p className="salon-lead"><Bilingual text={identity.description} /></p>
            <p className="salon-note"><Bilingual text={TEXT.home.heroNote} /></p>
            <a className="button salon-browse" href="#collection">
              <Bilingual text={TEXT.home.browse} inline />
              <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 2v12M3 9l5 5 5-5" /></svg>
            </a>
          </div>
          <figure className="salon-frame">
            <HeroImage garment={heroGarment} />
            <figcaption><Bilingual text={heroCaptionText(heroGarment)} /></figcaption>
          </figure>
        </div>
        <div className="wainscot" aria-hidden="true" />
      </section>

      <main>
        {/* The source statement describes the Official records only, so it
            goes inside that tab: Community entries come from their Contributors. */}
        <HomeTabs
          communityEntries={community.entries} communityFailed={Boolean(community.error)}
          myEntries={mine.entries} myFailed={Boolean(mine.error)} signedIn={Boolean(user)}
          officialSource={
            // React asks for a key: this element crosses from the server page into
            // the client HomeTabs, where it is one child in a list.
            <section key="source" className="source" id="about" aria-labelledby="source-heading">
              <div className="container source-inner">
                <h2 id="source-heading"><Bilingual text={TEXT.home.aboutHeading} /></h2>
                <div>
                  <p className="source-copy"><Bilingual text={identity.source} /></p>
                  <p className="byline"><Bilingual text={bylineText(collection.curator)} /></p>
                </div>
              </div>
            </section>
          }
        />
      </main>
      <footer className="shop-footer">
        <div className="container">
          <p className="shop-footer-name"><Bilingual text={identity.name} /></p>
          <p><Bilingual text={TEXT.home.footer} /></p>
        </div>
      </footer>
    </div>
  );
}
