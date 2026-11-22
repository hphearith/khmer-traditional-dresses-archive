import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import EntryField from "./EntryField.js";
import YearField from "./YearField.js";

// initial holds the values an entry being edited starts from (empty on a new entry).
export default function ProvenanceFields({ errors, initial = {} }) {
  return (
    <fieldset className="field-group">
      <legend className="field-group-legend"><Bilingual text={TEXT.provenance.legend} /></legend>
      <p className="field-hint field-group-intro">
        <Bilingual text={TEXT.provenance.intro} />
      </p>
      <div className="form-stack">
        <EntryField name="occasion" label={TEXT.provenance.occasion} error={errors.occasion} initialValue={initial.occasion} />
        <YearField error={errors.year} initialYear={initial.year} />
        <EntryField name="maker" label={TEXT.provenance.maker} error={errors.maker} initialValue={initial.maker} />
        <EntryField name="place" label={TEXT.provenance.place} hint={TEXT.provenance.placeHint} error={errors.place} initialValue={initial.place} />
        <EntryField name="materials" label={TEXT.provenance.materials} error={errors.materials} initialValue={initial.materials} />
      </div>
    </fieldset>
  );
}
