import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import UsernameField from "./UsernameField.js";

export default function AuthCredentialFields({ signup, pending, usernameError, invalidCredential }) {
  const emailError = invalidCredential?.name === "email" ? invalidCredential.message : null;
  const passwordError = invalidCredential?.name === "password" ? invalidCredential.message : null;
  return (
    <>
      {signup && <UsernameField pending={pending} error={usernameError} />}
      <div>
        <label htmlFor="email" style={{ display: "block", marginBottom: 8 }}><Bilingual text={TEXT.auth.email} /></label>
        <input id="email" name="email" type="email" autoComplete="email" required disabled={pending}
          aria-invalid={emailError ? true : undefined} aria-describedby={emailError ? "credential-error" : undefined} />
        {emailError && <p id="credential-error" className="credential-error" role="alert"><Bilingual text={emailError} /></p>}
      </div>
      <div>
        <label htmlFor="password" style={{ display: "block", marginBottom: 8 }}><Bilingual text={TEXT.auth.password} /></label>
        <input id="password" name="password" type="password" required disabled={pending}
          autoComplete={signup ? "new-password" : "current-password"}
          minLength={signup ? 6 : undefined} aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "credential-error" : signup ? "password-hint" : undefined} />
        {passwordError && <p id="credential-error" className="credential-error" role="alert"><Bilingual text={passwordError} /></p>}
        {signup && !passwordError && <p id="password-hint" style={{ marginTop: 8, fontSize: 14 }}><Bilingual text={TEXT.auth.passwordHint} /></p>}
      </div>
    </>
  );
}
