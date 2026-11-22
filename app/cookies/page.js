import Link from "next/link";
import Bilingual from "../../components/Bilingual.js";
import Shop from "../../components/Shop.js";
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
    <Shop>
      <main className="container sheet-page">
        <article className="sheet sheet-wide">
          <h1 className="sheet-title"><Bilingual text={copy.title} /></h1>
          <p className="sheet-intro"><Bilingual text={copy.intro} /></p>

          {sections.map(([id, heading, paragraphs]) => (
            <section key={id} className="sheet-section" aria-labelledby={id + "-heading"}>
              <h2 id={id + "-heading"}><Bilingual text={heading} /></h2>
              {paragraphs.map((text) => (
                <p key={text.en}><Bilingual text={text} /></p>
              ))}
            </section>
          ))}

          <p className="sheet-foot">
            <Link href="/" className="button secondary"><Bilingual text={TEXT.username.backToArchive} inline /></Link>
          </p>
        </article>
      </main>
    </Shop>
  );
}
