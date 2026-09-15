import Link from "next/link";
import collection from "../collection.config.js";
import AuthForm from "./AuthForm.js";

export default function AuthPage({ signup = false }) {
  return (
    <main style={{
      minHeight: "100vh", background: "var(--paper)", color: "var(--ink)",
      padding: "48px 24px", display: "grid", placeItems: "center",
    }}>
      <section aria-labelledby="auth-title" style={{ width: "100%", maxWidth: 440 }}>
        <Link href="/" style={{ display: "inline-block", marginBottom: 32 }}>
          ← {collection.name}
        </Link>
        <h1 id="auth-title" style={{ fontSize: 40, marginBottom: 16 }}>
          {signup ? "Sign up" : "Log in"}
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          {signup ? "Create your contributor account." : "Welcome back to the archive."}
        </p>
        <AuthForm signup={signup} />
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
