"use client";

import { ENTRY_LIMITS } from "../lib/entry.js";
import { TEXT, characterCountText } from "../lib/uiText.js";
import { useLimitedText } from "../lib/useLimitedText.js";
import Bilingual from "./Bilingual.js";

const CONTROL = {
  width: "100%", minWidth: 0, border: "1px solid var(--control)", borderRadius: 4,
  padding: "12px 16px", background: "var(--surface)", color: "var(--ink)",
  font: "inherit", fontSize: 16, lineHeight: 1.9, resize: "vertical",
};

// label and hint are { en, km } pairs; error is the pair for this field's message.
// One labelled text field that stops at its limit (lib/useLimitedText.js). There
// is deliberately no maxLength: the browser counts UTF-16 units, not characters,
// and cuts pasted text mid-way, which can split a Khmer cluster.
export default function EntryField({ name, label, hint, error, required = false, multiline = false, initialValue = "" }) {
  const limit = ENTRY_LIMITS[name];
  const { count, inputProps } = useLimitedText(name, initialValue);
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
        {/* The marker is shown before submit. Required is hidden from screen readers, which
            already announce "required" from aria-required on the control. */}
        <Bilingual text={label} note={required ? TEXT.form.required : TEXT.form.optional} noteHidden={required} />
      </label>
      {multiline
        ? <textarea {...control} rows={10} style={CONTROL} />
        : <input {...control} type="text" />}
      {hint && <p id={`${name}-hint`} style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}><Bilingual text={hint} /></p>}
      <p id={`${name}-count`} style={{ marginTop: 8, fontSize: 14, color: "var(--muted)" }}>
        <Bilingual text={characterCountText(count, limit)} />
        {full && <span role="status"><Bilingual text={TEXT.form.limitReached} /></span>}
      </p>
      {error && <p id={`${name}-error`} style={{ marginTop: 8, color: "red" }}><Bilingual text={error} /></p>}
    </div>
  );
}
