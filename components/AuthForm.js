"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import { getConfirmationRedirectUrl } from "../lib/authConfirmation.js";
import AuthCredentialFields from "./AuthCredentialFields.js";
import ConfirmationNotice from "./ConfirmationNotice.js";

export default function AuthForm({ signup = false }) {
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    const email = fields.get("email").trim();
    const password = fields.get("password");
    setPending(true);
    setError("");

    try {
      const supabase = createClient();
      const credentials = { email, password };
      const { data, error: authError } = signup
        ? await supabase.auth.signUp({
          ...credentials,
          options: { emailRedirectTo: getConfirmationRedirectUrl(window.location.origin) },
        })
        : await supabase.auth.signInWithPassword(credentials);

      if (!signup && authError?.code === "email_not_confirmed") {
        setConfirmationEmail(email);
        return;
      }
      if (authError) throw authError;

      if (signup && !data.session) {
        setConfirmationEmail(email);
      } else {
        window.location.assign("/login?verify=1");
      }
    } catch {
      setError(signup ? "Unable to sign up. Please try again." : "Invalid email or password");
    } finally {
      setPending(false);
    }
  }

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
        <AuthCredentialFields signup={signup} pending={pending} />
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
