import Link from "next/link";
import collection from "../collection.config.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import HomeNav from "./HomeNav.js";

// The top of every inner page: the coving, the nav row, and a slim strip of
// the shop's sign. Like the full sign on the home page, the strip sets the
// Khmer name above the English and larger, in either interface language. The
// nav keeps to the archive's own places; account links stay on the home page,
// so an inner page needs no extra read to draw them.
export default function ShopHeader() {
  return (
    <header className="shop-header">
      <div className="cove" aria-hidden="true" />
      <div className="container shop-top">
        <Link className="shop-brand" href="/"><Bilingual text={TEXT.home.brand} inline /></Link>
        <HomeNav>
          <Link href="/#collection"><Bilingual text={TEXT.home.navCollection} inline /></Link>
          <Link href="/#about"><Bilingual text={TEXT.home.navAbout} inline /></Link>
        </HomeNav>
      </div>
      <div className="sign-strip">
        <Link className="container sign-strip-face" href="/">
          <img className="sign-strip-tools" src="/images/salon/tools-gold.svg" alt="" width="170" height="90" />
          <span className="sign-strip-name">
            <span className="sign-strip-km" lang="km">{collection.nameKm}</span>
            <span className="sign-strip-en" lang="en">{collection.name}</span>
          </span>
        </Link>
      </div>
      <div className="soffit" aria-hidden="true" />
    </header>
  );
}
