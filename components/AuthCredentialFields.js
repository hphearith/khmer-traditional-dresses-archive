import UsernameField from "./UsernameField.js";

export default function AuthCredentialFields({ signup, pending, usernameError }) {
  return (
    <>
      {signup && <UsernameField pending={pending} error={usernameError} />}
      <div>
        <label htmlFor="email" style={{ display: "block", marginBottom: 8 }}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required disabled={pending} />
      </div>
      <div>
        <label htmlFor="password" style={{ display: "block", marginBottom: 8 }}>Password</label>
        <input id="password" name="password" type="password" required disabled={pending}
          autoComplete={signup ? "new-password" : "current-password"}
          minLength={signup ? 6 : undefined} aria-describedby={signup ? "password-hint" : undefined} />
        {signup && <p id="password-hint" style={{ marginTop: 8, fontSize: 14 }}>Use at least 6 characters.</p>}
      </div>
    </>
  );
}
