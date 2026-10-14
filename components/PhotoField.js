import { MAX_PHOTO_BYTES, PHOTO_EXTENSIONS } from "../lib/photo.js";

const CONTROL = {
  width: "100%", minWidth: 0, border: "1px solid var(--control)", borderRadius: 4,
  padding: "12px 16px", background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 16,
};

// The one required photo. accept narrows the file picker only; lib/photo.js and
// the storage bucket check the type and size again, because a direct call can send anything.
export default function PhotoField({ error }) {
  const describedBy = ["photo-hint", error && "photo-error"].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor="photo" style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        Photo <span aria-hidden="true" style={{ fontWeight: 400, color: "var(--muted)" }}>(required)</span>
      </label>
      <input id="photo" name="photo" type="file" accept={Object.keys(PHOTO_EXTENSIONS).join(",")}
        style={CONTROL} aria-required="true" aria-invalid={error ? true : undefined}
        aria-describedby={describedBy} />
      <p id="photo-hint" style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
        One JPEG, PNG or WebP photo of the dress, up to {MAX_PHOTO_BYTES / 1024 / 1024} MB.
      </p>
      {error && <p id="photo-error" style={{ marginTop: 8, color: "red" }}>{error}</p>}
    </div>
  );
}
