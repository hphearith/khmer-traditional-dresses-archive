import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// The consent box that goes with the photo. It must be ticked before an entry is
// saved with a new photo. When editing it is needed only if a new photo is chosen.
export default function ConsentField({ error, onlyWithNewPhoto = false }) {
  return (
    <div>
      <label htmlFor="consent" className="consent">
        <input id="consent" name="consent" type="checkbox"
          className="consent-box"
          aria-required={onlyWithNewPhoto ? undefined : "true"} aria-invalid={error ? true : undefined}
          aria-describedby={error ? "consent-error" : undefined} />
        <span>
          <Bilingual text={TEXT.photo.consent} noteHidden
            note={onlyWithNewPhoto ? TEXT.photo.consentWithNewPhoto : TEXT.form.required} />
        </span>
      </label>
      {error && <p id="consent-error" className="field-error"><Bilingual text={error} /></p>}
    </div>
  );
}
