import { Big_Shoulders } from "next/font/google";
import collection from "../collection.config.js";
import Bilingual from "../components/Bilingual.js";
import HomeNav from "../components/HomeNav.js";
import HomeTabs from "../components/HomeTabs.js";
import { logout } from "../lib/logoutAction.js";
import { readCommunityEntries, readMyEntries } from "../lib/readEntries.js";
import { readUsername } from "../lib/readUsername.js";
import { readIsReviewer } from "../lib/review.js";
import { createClient } from "../lib/supabase/server.js";
import { TEXT, bylineText, identityText } from "../lib/uiText.js";
import { readVisitor } from "../lib/visitor.js";
import { redirect } from "next/navigation";
import "./home.css";

// The shop sign's lettering (DESIGN.md). Latin only: Khmer keeps the device's
// Noto Khmer fonts. next/font serves the file from this site, so no request
// goes to Google when a page loads.
const sign = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-sign", display: "swap" });

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
    <div className={`shop ${sign.variable}`}>
      <a className="skip" href="#collection"><Bilingual text={TEXT.home.skip} inline /></a>
      {/* The sign board. Like a Cambodian shop sign, the Khmer name is always
          on top and larger, whichever language the page is in. */}
      <header className="signboard" id="top">
        <div className="container sign-top">
          <a className="sign-brand" href="#top"><Bilingual text={TEXT.home.brand} inline /></a>
          <HomeNav>
            <a href="#collection"><Bilingual text={TEXT.home.navCollection} inline /></a>
            <a href="/#about"><Bilingual text={TEXT.home.navAbout} inline /></a>
            {user ? (
              <>
                <span className="sign-email">{user.email}</span>
                {isReviewer && <a href="/review"><Bilingual text={TEXT.review.queue.title} inline /></a>}
                <a href="/change-username"><Bilingual text={TEXT.username.change} inline /></a>
                <form action={logout} className="sign-logout">
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
        <div className="container">
          <div className="sign-panel">
            <h1>
              <span className="sign-km" lang="km">{collection.nameKm}</span>
              <span className="sign-en" lang="en">{collection.name}</span>
            </h1>
            <p className="sign-lead"><Bilingual text={identity.description} /></p>
          </div>
        </div>
      </header>
      <div className="awning" aria-hidden="true" />

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
      <footer className="kerb">
        <div className="container">
          <p className="kerb-name"><Bilingual text={identity.name} /></p>
          <p><Bilingual text={TEXT.home.footer} /></p>
        </div>
      </footer>
    </div>
  );
}
