import Link from "next/link";
import { TEXT } from "../lib/uiText.js";
import AuthForm from "./AuthForm.js";
import Bilingual from "./Bilingual.js";

export default function AuthPage({ signup = false, verificationRequested = false }) {
  return (
    <main style={{
      minHeight: "100vh", background: "var(--paper)", color: "var(--ink)",
      padding: "48px 24px", display: "grid", placeItems: "center",
    }}>
      <section aria-labelledby="auth-title" style={{ width: "100%", maxWidth: 440 }}>
        <h1 id="auth-title" style={{ fontSize: 40, marginBottom: 16 }}>
          <Bilingual text={signup ? TEXT.auth.signUp : TEXT.auth.logIn} />
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          <Bilingual text={signup ? TEXT.auth.signUpIntro : TEXT.auth.logInIntro} />
        </p>
        {verificationRequested && (
          <p role="alert" style={{ marginBottom: 24, color: "var(--wine)" }}>
            <Bilingual text={TEXT.auth.verifyAlert} />
          </p>
        )}
        <AuthForm signup={signup} />
        <aside aria-labelledby="cookie-heading" style={{ marginTop: 32, padding: 20, border: "1px solid var(--line)", background: "var(--surface)" }}>
          <h2 id="cookie-heading" style={{ fontSize: 22, marginBottom: 8 }}><Bilingual text={TEXT.auth.cookiesHeading} /></h2>
          <p style={{ color: "var(--muted)", marginBottom: 12 }}>
            <Bilingual text={TEXT.auth.cookiesText} />
          </p>
          <Link href="/cookies" style={{ color: "var(--wine)" }}><Bilingual text={TEXT.auth.cookiesLink} inline /></Link>
        </aside>
        <p style={{ marginTop: 24 }}>
          <Link href="/" className="button secondary"><Bilingual text={TEXT.auth.continueAsGuest} inline /></Link>
        </p>
        <p style={{ marginTop: 24, color: "var(--muted)" }}>
          <Bilingual text={signup ? TEXT.auth.haveAccount : TEXT.auth.needAccount} />
          <Link href={signup ? "/login" : "/signup"} style={{ color: "var(--wine)" }}>
            <Bilingual text={signup ? TEXT.auth.logIn : TEXT.auth.signUp} inline />
          </Link>
        </p>
      </section>
    </main>
  );
}
