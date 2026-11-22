import Link from "next/link";
import Bilingual from "../../components/Bilingual.js";
import { TEXT } from "../../lib/uiText.js";

const copy = TEXT.cookies;
const sections = [
  ["guest", copy.guestHeading, [copy.guestBody]],
  ["contributor", copy.signInHeading, [copy.signInBody]],
  ["language", copy.languageHeading, [copy.languageChoice, copy.languageStorage]],
  ["drafts", copy.draftHeading, [copy.draftStorage, copy.draftRemoval, copy.draftNotice, copy.draftGuest]],
  ["optional", copy.optionalHeading, [copy.optionalBody]],
];

export default function CookieInformationPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)", padding: "48px 24px" }}>
      <article style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 24 }}><Bilingual text={copy.title} /></h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}><Bilingual text={copy.intro} /></p>

        {sections.map(([id, heading, paragraphs]) => (
          <section key={id} aria-labelledby={id + "-heading"} style={{ marginBottom: 24 }}>
            <h2 id={id + "-heading"} style={{ fontSize: 26, marginBottom: 8 }}><Bilingual text={heading} /></h2>
            {paragraphs.map((text) => (
              <p key={text.en} style={{ marginBottom: 8 }}><Bilingual text={text} /></p>
            ))}
          </section>
        ))}

        <Link href="/" className="button secondary"><Bilingual text={TEXT.username.backToArchive} inline /></Link>
      </article>
    </main>
  );
}
