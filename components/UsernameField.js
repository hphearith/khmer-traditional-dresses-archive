import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from "../lib/username.js";

export default function UsernameField({ pending, error }) {
  return (
    <div>
      <label htmlFor="username" style={{ display: "block", marginBottom: 8 }}>Username</label>
      <input id="username" name="username" type="text" required disabled={pending}
        autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "username-hint username-error" : "username-hint"} />
      <p id="username-hint" style={{ marginTop: 8, fontSize: 14 }}>
        {USERNAME_MIN_LENGTH} to {USERNAME_MAX_LENGTH} English letters, digits or underscore.
        Capitals are saved as lowercase. It is shown publicly with an @ in front; never type the @.
      </p>
      {error && <p id="username-error" role="alert" style={{ marginTop: 8, color: "red" }}>{error}</p>}
    </div>
  );
}
