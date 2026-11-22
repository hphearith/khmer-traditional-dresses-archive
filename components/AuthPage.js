import Link from "next/link";
import { TEXT } from "../lib/uiText.js";
import AuthForm from "./AuthForm.js";
import Bilingual from "./Bilingual.js";
import Shop from "./Shop.js";

export default function AuthPage({ signup = false, verificationRequested = false }) {
  return (
    <Shop>
      <main className="container sheet-page">
        <section className="sheet" aria-labelledby="auth-title">
          <h1 id="auth-title" className="sheet-title">
            <Bilingual text={signup ? TEXT.auth.signUp : TEXT.auth.logIn} />
          </h1>
          <p className="sheet-intro">
            <Bilingual text={signup ? TEXT.auth.signUpIntro : TEXT.auth.logInIntro} />
          </p>
          {verificationRequested && (
            <p role="alert" className="form-alert sheet-alert">
              <Bilingual text={TEXT.auth.verifyAlert} />
            </p>
          )}
          <AuthForm signup={signup} />
          <aside className="sheet-note" aria-labelledby="cookie-heading">
            <h2 id="cookie-heading"><Bilingual text={TEXT.auth.cookiesHeading} /></h2>
            <p><Bilingual text={TEXT.auth.cookiesText} /></p>
            <Link href="/cookies"><Bilingual text={TEXT.auth.cookiesLink} inline /></Link>
          </aside>
          <p className="sheet-foot">
            <Link href="/" className="button secondary"><Bilingual text={TEXT.auth.continueAsGuest} inline /></Link>
          </p>
          <p className="sheet-foot sheet-switch">
            <Bilingual text={signup ? TEXT.auth.haveAccount : TEXT.auth.needAccount} />
            <Link href={signup ? "/login" : "/signup"}>
              <Bilingual text={signup ? TEXT.auth.logIn : TEXT.auth.signUp} inline />
            </Link>
          </p>
        </section>
      </main>
    </Shop>
  );
}
