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

        <section aria-labelledby="drafts-heading" style={{ marginBottom: 24 }}>
          <h2 id="drafts-heading" style={{ fontSize: 28, marginBottom: 8 }}>Local drafts on this device</h2>
          <p style={{ marginBottom: 8 }}>
            While you write or edit an entry, the text you have typed is saved in your browser&rsquo;s local
            storage on this device as a local draft, so you can come back to it after leaving the page, reloading or
            closing the tab. It is stored under a name that includes your account, so someone else signing in on the
            same browser does not see it. Only the text fields and the year are kept, never the photo or the consent box.
          </p>
          <p style={{ marginBottom: 8 }}>
            Nothing in a local draft is sent anywhere until you choose to save the entry. Saving removes the draft from
            this device, and you can also clear it in your browser&rsquo;s site data. If your browser blocks local
            storage, the forms still work and simply do not keep local drafts.
          </p>
          <p style={{ marginBottom: 8 }}>
            When you leave a form with a local draft kept, a short note with the time is placed in your browser&rsquo;s
            session storage so the next page can say &ldquo;Draft saved&rdquo;. The page removes it as soon as it
            reads it, and the browser removes it when you close the tab.
          </p>
          <p>Browsing as a guest stores nothing: local drafts exist only once you are signed in and start writing.</p>
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
