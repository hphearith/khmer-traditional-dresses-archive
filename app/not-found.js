import Link from "next/link";
import Bilingual from "../components/Bilingual.js";
import Shop from "../components/Shop.js";
import { TEXT } from "../lib/uiText.js";

export default function NotFound() {
  return (
    <Shop>
      <main className="container record-page">
        <div className="empty">
          <h1 className="record-title"><Bilingual text={TEXT.unavailable.title} /></h1>
          <p><Bilingual text={TEXT.unavailable.help} /></p>
          <Link className="back-link" href="/"><Bilingual text={TEXT.username.backToArchive} inline /></Link>
        </div>
      </main>
    </Shop>
  );
}
