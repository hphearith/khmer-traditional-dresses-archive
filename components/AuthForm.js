"use client";

import { useEffect, useState } from "react";
import { pick } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT, credentialIssueText, resendMessageText } from "../lib/uiText.js";
import { useAuthForm } from "../lib/useAuthForm.js";
import AuthCredentialFields from "./AuthCredentialFields.js";
import Bilingual from "./Bilingual.js";
import ConfirmationNotice from "./ConfirmationNotice.js";

export default function AuthForm({ signup = false }) {
  const language = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [invalidCredential, setInvalidCredential] = useState(null);
  const { pending, error, usernameError, confirmationEmail, handleSubmit } = useAuthForm(signup);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (signup && confirmationEmail) {
    return (
      <div>
        <p role="status" style={{ marginBottom: 24 }}>
          <Bilingual text={resendMessageText(null)} />
        </p>
        <ConfirmationNotice initialEmail={confirmationEmail} initialCooldown={60} />
      </div>
    );
  }

  function submitCredentials(event) {
    event.preventDefault();
    const { email, password } = event.currentTarget.elements;
    const field = email.validity.valid ? password : email;
    const message = credentialIssueText(field.validity);
    if (message) {
      setInvalidCredential({ name: field.name, message });
      field.focus();
      return;
    }
    setInvalidCredential(null);
    handleSubmit(event);
  }

  return (
    <div>
      <form noValidate onSubmit={submitCredentials} onInput={(event) => {
        if (event.target.name === invalidCredential?.name) setInvalidCredential(null);
      }} aria-busy={pending} style={{ display: "grid", gap: 24 }}>
        <AuthCredentialFields signup={signup} pending={pending} usernameError={usernameError} invalidCredential={invalidCredential} />
        {error && <p role="alert" style={{ color: "var(--wine)" }}><Bilingual text={error} /></p>}
        <button type="submit" disabled={pending} style={{
          minHeight: 48, border: "1px solid var(--wine)", borderRadius: 4, padding: "8px 16px",
          background: "var(--wine)", color: "var(--surface)", opacity: pending ? 0.7 : 1,
          cursor: pending ? "wait" : "pointer",
        }}>
          <Bilingual text={signup ? (pending ? TEXT.auth.signingUp : TEXT.auth.signUp) : (pending ? TEXT.auth.loggingIn : TEXT.auth.logIn)} inline />
        </button>
      </form>
      {!signup && confirmationEmail && (
        <section aria-label={pick(TEXT.auth.emailConfirmation, language)} style={{ marginTop: 24 }}>
          <p style={{ marginBottom: 16 }}>
            <Bilingual text={TEXT.auth.needsConfirmation} />
          </p>
          <ConfirmationNotice initialEmail={confirmationEmail} />
        </section>
      )}
    </div>
  );
}
