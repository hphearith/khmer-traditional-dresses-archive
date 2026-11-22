import collection from "../collection.config.js";
import { TEXT, identityText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// The ink footer that closes every salon page: the archive's name and the
// footer note.
export default function ShopFooter() {
  const identity = identityText(collection);
  return (
    <footer className="shop-footer">
      <div className="container">
        <p className="shop-footer-name"><Bilingual text={identity.name} /></p>
        <p><Bilingual text={TEXT.home.footer} /></p>
      </div>
    </footer>
  );
}
