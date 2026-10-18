import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import EntryField from "./EntryField.js";
import YearField from "./YearField.js";

// initial holds the values an entry being edited starts from (empty on a new entry).
export default function ProvenanceFields({ errors, initial = {} }) {
  return (
    <fieldset style={{ minWidth: 0, margin: 0, border: "1px solid var(--line)", padding: "16px 24px 24px" }}>
      <legend style={{ padding: "0 8px", fontWeight: 700 }}><Bilingual text={TEXT.provenance.legend} /></legend>
      <p style={{ marginBottom: 24, color: "var(--muted)", fontSize: 14 }}>
        <Bilingual text={TEXT.provenance.intro} />
      </p>
      <div style={{ display: "grid", gap: 24 }}>
        <EntryField name="occasion" label={TEXT.provenance.occasion} error={errors.occasion} initialValue={initial.occasion} />
        <YearField error={errors.year} initialYear={initial.year} />
        <EntryField name="maker" label={TEXT.provenance.maker} error={errors.maker} initialValue={initial.maker} />
        <EntryField name="place" label={TEXT.provenance.place} hint={TEXT.provenance.placeHint} error={errors.place} initialValue={initial.place} />
        <EntryField name="materials" label={TEXT.provenance.materials} error={errors.materials} initialValue={initial.materials} />
      </div>
    </fieldset>
  );
}
