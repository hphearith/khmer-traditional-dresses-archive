import { combined } from "../lib/bilingual.js";
import { yearOptions } from "../lib/entry.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

const CONTROL = {
  width: "100%", minWidth: 0, height: 56, border: "1px solid var(--control)", borderRadius: 4,
  padding: "12px 16px", background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 16,
};

// The year is picked from a list, not typed: the current year down to
// EARLIEST_YEAR (plus the entry's own year if that is outside it), with a
// blank first choice. The pure rules and the database still check it,
// because a direct call can send anything.
// initialYear is the year an entry being edited already has ("" for none).
export default function YearField({ error, initialYear = "" }) {
  const years = yearOptions(new Date().getFullYear(), initialYear);

  return (
    <div>
      <label htmlFor="year" style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        <Bilingual text={TEXT.provenance.year} note={TEXT.form.optional} />
      </label>
      <select id="year" name="year" defaultValue={initialYear} style={CONTROL}
        aria-invalid={error ? true : undefined} aria-describedby={error ? "year-error" : undefined}>
        <option value="">{combined(TEXT.provenance.notSure)}</option>
        {years.map((year) => <option key={year} value={year}>{year}</option>)}
      </select>
      {error && <p id="year-error" style={{ marginTop: 8, color: "red" }}><Bilingual text={error} /></p>}
    </div>
  );
}
