"use client";

import { ENTRY_LIMITS } from "../lib/entry.js";
import { useLimitedText } from "../lib/useLimitedText.js";

const CONTROL = {
  width: "100%", minWidth: 0, border: "1px solid var(--control)", borderRadius: 4,
  padding: "12px 16px", background: "var(--surface)", color: "var(--ink)",
  font: "inherit", fontSize: 16, lineHeight: 1.9, resize: "vertical",
};

// One labelled text field that stops at its limit (lib/useLimitedText.js). There
// is deliberately no maxLength: the browser counts UTF-16 units, not characters,
// and cuts pasted text mid-way, which can split a Khmer cluster.
export default function EntryField({ name, label, hint, error, required = false, multiline = false }) {
  const limit = ENTRY_LIMITS[name];
  const { count, inputProps } = useLimitedText(name);
  const full = count >= limit;
  const describedBy = [hint && `${name}-hint`, `${name}-count`, error && `${name}-error`].filter(Boolean).join(" ");
  const control = {
    ...inputProps,
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
        {/* Shown before submit. Hidden from screen readers, which already
            announce "required" from aria-required on the control. */}
        {required
          ? <span aria-hidden="true" style={{ fontWeight: 400, color: "var(--muted)" }}> (required)</span>
          : <span style={{ fontWeight: 400, color: "var(--muted)" }}> (optional)</span>}
      </label>
      {multiline
        ? <textarea {...control} rows={10} style={CONTROL} />
        : <input {...control} type="text" />}
      {hint && <p id={`${name}-hint`} style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>{hint}</p>}
      <p id={`${name}-count`} style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
        {count.toLocaleString("en")} of {limit.toLocaleString("en")} characters
        {full && <span role="status"> · Limit reached.</span>}
      </p>
      {error && <p id={`${name}-error`} style={{ marginTop: 8, color: "red" }}>{error}</p>}
    </div>
  );
}
