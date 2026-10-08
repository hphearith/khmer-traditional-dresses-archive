import EntryField from "./EntryField.js";
import YearField from "./YearField.js";

export default function ProvenanceFields({ errors }) {
  return (
    <fieldset style={{ minWidth: 0, margin: 0, border: "1px solid var(--line)", padding: "16px 24px 24px" }}>
      <legend style={{ padding: "0 8px", fontWeight: 700 }}>Provenance</legend>
      <p style={{ marginBottom: 24, color: "var(--muted)", fontSize: 14 }}>
        Where the dress came from, if you know. Fill in any or none.
      </p>
      <div style={{ display: "grid", gap: 24 }}>
        <EntryField name="occasion" label="Occasion" error={errors.occasion} />
        <YearField error={errors.year} />
        <EntryField name="maker" label="Maker or tailor" error={errors.maker} />
        <EntryField name="place" label="Place" hint="Where it was made." error={errors.place} />
        <EntryField name="materials" label="Materials" error={errors.materials} />
      </div>
    </fieldset>
  );
}
