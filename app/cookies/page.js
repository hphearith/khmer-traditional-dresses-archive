import Link from "next/link";

export default function CookieInformationPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)", padding: "48px 24px" }}>
      <article style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}>
        <p className="label" style={{ color: "var(--wine)", marginBottom: 20 }}>Cookie information</p>
        <h1 style={{ marginBottom: 24 }}>Our use of cookies</h1>
        <p style={{ color: "var(--muted)", marginBottom: 28 }}>
          We keep our use of cookies limited and purposeful.
        </p>

        <section aria-labelledby="guest-heading" style={{ marginBottom: 24 }}>
          <h2 id="guest-heading" style={{ fontSize: 28, marginBottom: 8 }}>Guest browsing</h2>
          <p>You can browse the archive without signing in or using account cookies.</p>
        </section>

        <section aria-labelledby="contributor-heading" style={{ marginBottom: 24 }}>
          <h2 id="contributor-heading" style={{ fontSize: 28, marginBottom: 8 }}>Signing in</h2>
          <p>Essential cookies keep your account secure and remember you as you move between pages.</p>
        </section>

        <section aria-labelledby="optional-heading" style={{ marginBottom: 32 }}>
          <h2 id="optional-heading" style={{ fontSize: 28, marginBottom: 8 }}>Analytics and advertising</h2>
          <p>We do not use analytics or advertising cookies.</p>
        </section>

        <Link href="/" className="button secondary">Return to the archive</Link>
      </article>
    </main>
  );
}
