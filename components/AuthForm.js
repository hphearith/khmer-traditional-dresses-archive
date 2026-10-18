"use client";

import { useEffect, useState } from "react";
import { combined } from "../lib/bilingual.js";
import { TEXT, resendMessageText } from "../lib/uiText.js";
import { useAuthForm } from "../lib/useAuthForm.js";
import AuthCredentialFields from "./AuthCredentialFields.js";
import Bilingual from "./Bilingual.js";
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
          <Bilingual text={resendMessageText(null)} />
        </p>
        <ConfirmationNotice initialEmail={confirmationEmail} initialCooldown={60} />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} aria-busy={pending} style={{ display: "grid", gap: 20 }}>
        <AuthCredentialFields signup={signup} pending={pending} usernameError={usernameError} />
        {error && <p role="alert" style={{ color: "red" }}><Bilingual text={error} /></p>}
        <button type="submit" disabled={pending} style={{
          minHeight: 48, border: "1px solid var(--wine)", borderRadius: 4, padding: "8px 16px",
          background: "var(--wine)", color: "var(--surface)", opacity: pending ? 0.7 : 1,
          cursor: pending ? "wait" : "pointer",
        }}>
          <Bilingual text={pending ? TEXT.auth.pleaseWait : signup ? TEXT.auth.signUp : TEXT.auth.logIn} inline />
        </button>
      </form>
      {!signup && confirmationEmail && (
        <section aria-label={combined(TEXT.auth.emailConfirmation)} style={{ marginTop: 24 }}>
          <p style={{ marginBottom: 16 }}>
            <Bilingual text={TEXT.auth.needsConfirmation} />
          </p>
          <ConfirmationNotice initialEmail={confirmationEmail} />
        </section>
      )}
    </div>
  );
}
