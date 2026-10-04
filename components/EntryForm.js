"use client";

import { useEntryForm } from "../lib/useEntryForm.js";
import EntryField from "./EntryField.js";
import ProvenanceFields from "./ProvenanceFields.js";

// noValidate: the browser's own required-field bubble shows only one field at
// a time. The form checks every field itself and shows each message in place.
export default function EntryForm() {
  const { pending, errors, formError, handleSubmit } = useEntryForm();

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={pending} style={{ display: "grid", gap: 24 }}>
      <EntryField name="title" label="Title" required error={errors.title} />
      <EntryField name="story" label="Story" required multiline error={errors.story}
        hint="Who it was made for, how it was ordered, what it means to you." />
      <EntryField name="credited_as" label="Credited as" error={errors.credited_as}
        hint="The name shown on this entry. Leave it blank to show your @Username." />
      <ProvenanceFields errors={errors} />
      {formError && <p role="alert" style={{ color: "red" }}>{formError}</p>}
      <button className="button" type="submit" disabled={pending}
        style={{ opacity: pending ? 0.7 : 1, cursor: pending ? "wait" : "pointer" }}>
        {pending ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}
