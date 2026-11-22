import { fontVariables } from "../app/fonts.js";
import "../app/salon.css";
import ShopFooter from "./ShopFooter.js";
import ShopHeader from "./ShopHeader.js";

// Puts a page inside the salon (DESIGN.md, Sign and Salon): the .shop wrapper
// that app/salon.css is scoped to, carrying the salon's web fonts. Inner pages
// get the shared header (nav row and slim sign strip); the home page passes
// header={false} and draws its own nav and full sign. Every page closes with
// the ink footer.
export default function Shop({ children, header = true }) {
  return (
    <div className={`shop ${fontVariables}`}>
      {header && <ShopHeader />}
      {children}
      <ShopFooter />
    </div>
  );
}
