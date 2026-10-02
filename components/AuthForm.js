"use client";

import { useEffect, useState } from "react";
import { useAuthForm } from "../lib/useAuthForm.js";
import AuthCredentialFields from "./AuthCredentialFields.js";
import ConfirmationNotice from "./ConfirmationNotice.js";

export default function AuthForm({ signup = false }) {
  const [mounted, setMounted] = useState(false);
  const { pending, error, usernameError, confirmationEmail, handleSubmit } = useAuthForm(signup);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (signup && confirmationEmail) {
    return (
      <div>
        <p role="status" style={{ marginBottom: 20 }}>
          If this address needs confirmation, an email will arrive shortly.
        </p>
        <ConfirmationNotice initialEmail={confirmationEmail} initialCooldown={60} />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} aria-busy={pending} style={{ display: "grid", gap: 20 }}>
        <AuthCredentialFields signup={signup} pending={pending} usernameError={usernameError} />
        {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={pending} style={{
          minHeight: 48, border: "1px solid var(--wine)", borderRadius: 4, padding: "8px 16px",
          background: "var(--wine)", color: "var(--surface)", opacity: pending ? 0.7 : 1,
          cursor: pending ? "wait" : "pointer",
        }}>
          {pending ? "Please wait…" : signup ? "Sign up" : "Log in"}
        </button>
      </form>
      {!signup && confirmationEmail && (
        <section aria-label="Email confirmation" style={{ marginTop: 24 }}>
          <p style={{ marginBottom: 16 }}>
            This address may need confirmation before sign-in. If so, you can request another email.
          </p>
          <ConfirmationNotice initialEmail={confirmationEmail} />
        </section>
      )}
    </div>
  );
}
