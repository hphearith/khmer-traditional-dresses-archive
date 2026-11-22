import { TEXT, usernameHintText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

export default function UsernameField({ pending, error }) {
  return (
    <div>
      <label htmlFor="username" className="field-label"><Bilingual text={TEXT.username.label} /></label>
      <input id="username" name="username" type="text" required disabled={pending}
        autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "username-hint username-error" : "username-hint"} />
      <p id="username-hint" className="field-hint">
        <Bilingual text={usernameHintText()} />
      </p>
      {error && <p id="username-error" role="alert" className="field-error"><Bilingual text={error} /></p>}
    </div>
  );
}
