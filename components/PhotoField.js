import { MAX_PHOTO_BYTES, PHOTO_EXTENSIONS } from "../lib/photo.js";
import { usePhotoPreview } from "../lib/usePhotoPreview.js";

const CONTROL = {
  width: "100%", minWidth: 0, border: "1px solid var(--control)", borderRadius: 4,
  padding: "12px 16px", background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 16,
};

// The entry's one photo. accept narrows the file picker only; lib/photo.js and
// the storage bucket check the type and size again, because a direct call can send anything.
// A new entry must have one. When editing, current is the photo the entry holds
// now (its url and the entry's title): choosing a file replaces it, and
// choosing nothing keeps it. There is no way to remove it without replacing it.
// A photo chosen here is shown at once, in place of the current one, before it is saved.
export default function PhotoField({ error, current = null }) {
  const { preview, handleChange } = usePhotoPreview();
  const describedBy = ["photo-hint", error && "photo-error"].filter(Boolean).join(" ");
  const limits = `One JPEG, PNG or WebP photo of the dress, up to ${MAX_PHOTO_BYTES / 1024 / 1024} MB.`;

  return (
    <div>
      <label htmlFor="photo" style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        {current ? "Replace the photo" : "Photo"}{" "}
        <span aria-hidden="true" style={{ fontWeight: 400, color: "var(--muted)" }}>
          {current ? "(optional)" : "(required)"}
        </span>
      </label>
      {(preview || current) && (
        <img src={preview ?? current.url}
          alt={preview ? "The photo you chose" : `Current photo for: ${current.title}`}
          style={{ display: "block", maxWidth: "100%", maxHeight: 240, marginBottom: 12, borderRadius: 4 }} />
      )}
      <input id="photo" name="photo" type="file" accept={Object.keys(PHOTO_EXTENSIONS).join(",")}
        style={CONTROL} aria-required={current ? undefined : "true"} aria-invalid={error ? true : undefined}
        aria-describedby={describedBy} onChange={handleChange} />
      <p id="photo-hint" style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
        {current ? `Leave this empty to keep the current photo. ${limits}` : limits}
      </p>
      {error && <p id="photo-error" style={{ marginTop: 8, color: "red" }}>{error}</p>}
    </div>
  );
}
