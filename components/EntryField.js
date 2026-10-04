import { ENTRY_LIMITS } from "../lib/entry.js";

const CONTROL = {
  width: "100%", minWidth: 0, border: "1px solid var(--control)", borderRadius: 4,
  padding: "12px 16px", background: "var(--surface)", color: "var(--ink)",
  font: "inherit", fontSize: 16, lineHeight: 1.9, resize: "vertical",
};

// One labelled text field. There is deliberately no maxLength: the browser
// would cut pasted text mid-way, which can split a Khmer cluster. Over-long
// text is refused with a message instead (lib/entry.js).
export default function EntryField({ name, label, hint, error, required = false, multiline = false, inputMode }) {
  const limit = ENTRY_LIMITS[name];
  const hintText = [hint, limit && `Up to ${limit.toLocaleString("en")} characters.`].filter(Boolean).join(" ");
  const describedBy = [hintText && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ");
  const control = {
    id: name,
    name,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  };

  return (
    <div>
      <label htmlFor={name} style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
        {label}
        {!required && <span style={{ fontWeight: 400, color: "var(--muted)" }}> (optional)</span>}
      </label>
      {multiline
        ? <textarea {...control} rows={10} style={CONTROL} />
        : <input {...control} type="text" inputMode={inputMode} />}
      {hintText && <p id={`${name}-hint`} style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>{hintText}</p>}
      {error && <p id={`${name}-error`} style={{ marginTop: 8, color: "red" }}>{error}</p>}
    </div>
  );
}
