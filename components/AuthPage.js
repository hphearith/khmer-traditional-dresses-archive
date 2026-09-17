import Link from "next/link";
import AuthForm from "./AuthForm.js";

export default function AuthPage({ signup = false, verificationRequested = false }) {
  return (
    <main style={{
      minHeight: "100vh", background: "var(--paper)", color: "var(--ink)",
      padding: "48px 24px", display: "grid", placeItems: "center",
    }}>
      <section aria-labelledby="auth-title" style={{ width: "100%", maxWidth: 440 }}>
        <h1 id="auth-title" style={{ fontSize: 40, marginBottom: 16 }}>
          {signup ? "Sign up" : "Log in"}
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          {signup ? "Create your contributor account." : "Welcome back to the archive."}
        </p>
        {verificationRequested && (
          <p role="alert" style={{ marginBottom: 24, color: "var(--wine)" }}>
            Cookies are required for contributor accounts. Your sign-in could not be verified in this browser; you can continue browsing as a guest below.
          </p>
        )}
        <AuthForm signup={signup} />
        <aside aria-labelledby="cookie-heading" style={{ marginTop: 32, padding: 20, border: "1px solid var(--line)", background: "var(--surface)" }}>
          <h2 id="cookie-heading" style={{ fontSize: 22, marginBottom: 8 }}>Essential cookies</h2>
          <p style={{ color: "var(--muted)", marginBottom: 12 }}>
            We use essential cookies to keep your account secure and signed in. You can continue without them by browsing as a guest.
          </p>
          <Link href="/cookies" style={{ color: "var(--wine)" }}>Learn about cookies</Link>
        </aside>
        <p style={{ marginTop: 24 }}>
          <Link href="/" className="button secondary">Continue as guest</Link>
        </p>
        <p style={{ marginTop: 24, color: "var(--muted)" }}>
          {signup ? "Already have an account? " : "Need an account? "}
          <Link href={signup ? "/login" : "/signup"} style={{ color: "var(--wine)" }}>
            {signup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </section>
    </main>
  );
}
