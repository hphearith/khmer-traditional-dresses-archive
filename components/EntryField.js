"use client";

import { ENTRY_LIMITS } from "../lib/entry.js";
import { TEXT, characterCountText } from "../lib/uiText.js";
import { useLimitedText } from "../lib/useLimitedText.js";
import Bilingual from "./Bilingual.js";

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
      <label htmlFor={name} className="field-label">
        {/* The marker is shown before submit. Required is hidden from screen readers, which
            already announce "required" from aria-required on the control. */}
        <Bilingual text={label} note={required ? TEXT.form.required : TEXT.form.optional} noteHidden={required} />
      </label>
      {multiline
        ? <textarea {...control} rows={10} className="field-control" />
        : <input {...control} type="text" />}
      {hint && <p id={`${name}-hint`} className="field-hint"><Bilingual text={hint} /></p>}
      <p id={`${name}-count`} className="field-hint">
        <Bilingual text={characterCountText(count, limit)} />
        {full && <span role="status"><Bilingual text={TEXT.form.limitReached} /></span>}
      </p>
      {error && <p id={`${name}-error`} className="field-error"><Bilingual text={error} /></p>}
    </div>
  );
}
