import { EARLIEST_YEAR } from "../lib/entry.js";

const CONTROL = {
  width: "100%", minWidth: 0, height: 56, border: "1px solid var(--control)", borderRadius: 4,
  padding: "12px 16px", background: "var(--surface)", color: "var(--ink)", font: "inherit", fontSize: 16,
};

// The year is picked from a list, not typed: the current year down to
// EARLIEST_YEAR, with a blank first choice. The pure rules and the database
// still check it, because a direct call can send anything.
// initialYear is the year an entry being edited already has ("" for none).
export default function YearField({ error, initialYear = "" }) {
  const latest = new Date().getFullYear();
  const years = Array.from({ length: latest - EARLIEST_YEAR + 1 }, (_, index) => latest - index);

  return (
    <div>
      <label htmlFor="year" style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        Year <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span>
      </label>
      <select id="year" name="year" defaultValue={initialYear} style={CONTROL}
        aria-invalid={error ? true : undefined} aria-describedby={error ? "year-error" : undefined}>
        <option value="">Not sure</option>
        {years.map((year) => <option key={year} value={year}>{year}</option>)}
      </select>
      {error && <p id="year-error" style={{ marginTop: 8, color: "red" }}>{error}</p>}
    </div>
  );
}
