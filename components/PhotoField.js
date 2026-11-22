import { pick } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";
import { PHOTO_EXTENSIONS } from "../lib/photo.js";
import { TEXT, photoHintText, entryPhotoText } from "../lib/uiText.js";
import { usePhotoPreview } from "../lib/usePhotoPreview.js";
import Bilingual from "./Bilingual.js";

// The entry's one photo. accept narrows the file picker only; lib/photo.js and
// the storage bucket check the type and size again, because a direct call can send anything.
// A new entry must have one. When editing, current is the photo the entry holds
// now (its url and the entry's title): choosing a file replaces it, and
// choosing nothing keeps it. There is no way to remove it without replacing it.
// A photo chosen here is shown at once, in place of the current one, before it is saved.
export default function PhotoField({ error, current = null }) {
  const language = useLanguage();
  const { preview, fileName, handleChange } = usePhotoPreview();
  const describedBy = ["photo-hint", error && "photo-error"].filter(Boolean).join(" ");

  return (
    <div>
      <label id="photo-label" htmlFor="photo" style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        <Bilingual text={current ? TEXT.photo.replaceLabel : TEXT.photo.label}
          note={current ? TEXT.form.optional : TEXT.form.required} noteHidden />
      </label>
      {(preview || current) && (
        <img src={preview ?? current.url}
          alt={preview ? pick(TEXT.photo.chosenAlt, language) : pick(entryPhotoText(current.title, true), language)}
          style={{ display: "block", maxWidth: "100%", maxHeight: 240, marginBottom: 12, borderRadius: 4 }} />
      )}
      <div className="photo-control">
        <input id="photo" name="photo" type="file" accept={Object.keys(PHOTO_EXTENSIONS).join(",")}
          className="photo-input" aria-labelledby="photo-label"
          aria-required={current ? undefined : "true"} aria-invalid={error ? true : undefined}
          aria-describedby={describedBy} onChange={handleChange} />
        <label htmlFor="photo" className="button secondary photo-picker" aria-hidden="true">
          <Bilingual text={TEXT.photo.choose} inline />
        </label>
        <span aria-hidden="true">{fileName || <Bilingual text={TEXT.photo.nothingChosen} inline />}</span>
      </div>
      <p id="photo-hint" style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
        <Bilingual text={photoHintText(Boolean(current))} />
      </p>
      {error && <p id="photo-error" style={{ marginTop: 8, color: "var(--wine)" }}><Bilingual text={error} /></p>}
    </div>
  );
}
