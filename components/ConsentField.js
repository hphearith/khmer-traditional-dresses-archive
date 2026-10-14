import { PHOTO_CONSENT } from "../lib/photo.js";

// The consent box that goes with the photo. It must be ticked before an entry is saved.
export default function ConsentField({ error }) {
  return (
    <div>
      <label htmlFor="consent" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <input id="consent" name="consent" type="checkbox"
          style={{ flexShrink: 0, width: 24, height: 24, marginTop: 4 }}
          aria-required="true" aria-invalid={error ? true : undefined}
          aria-describedby={error ? "consent-error" : undefined} />
        <span>
          {PHOTO_CONSENT}{" "}
          <span aria-hidden="true" style={{ color: "var(--muted)" }}>(required)</span>
        </span>
      </label>
      {error && <p id="consent-error" style={{ marginTop: 8, color: "red" }}>{error}</p>}
    </div>
  );
}
