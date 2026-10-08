"use client";

import { useEntryForm } from "../lib/useEntryForm.js";
import EntryField from "./EntryField.js";
import ProvenanceFields from "./ProvenanceFields.js";

// noValidate: the browser's own required-field bubble shows only one field at
// a time. The form checks every field itself and shows each message in place.
// With an entryId the form edits that entry, starting from the stored values in
// initial (formValuesFromEntry in lib/entry.js). Without one it writes a new entry.
export default function EntryForm({ entryId = null, initial = {} }) {
  const { pending, errors, formError, handleSubmit } = useEntryForm({ entryId });
  const saveLabel = entryId ? "Save changes" : "Save entry";

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={pending} style={{ display: "grid", gap: 24 }}>
      <EntryField name="title" label="Title" required error={errors.title} initialValue={initial.title} />
      <EntryField name="story" label="Story" required multiline error={errors.story} initialValue={initial.story}
        hint="Who it was made for, how it was ordered, what it means to you." />
      <EntryField name="credited_as" label="Credited as" error={errors.credited_as} initialValue={initial.credited_as}
        hint="The name shown on this entry. Leave it blank to show your @Username." />
      <ProvenanceFields errors={errors} initial={initial} />
      {formError && <p role="alert" style={{ color: "red" }}>{formError}</p>}
      <button className="button" type="submit" disabled={pending}
        style={{ opacity: pending ? 0.7 : 1, cursor: pending ? "wait" : "pointer" }}>
        {pending ? "Saving…" : saveLabel}
      </button>
    </form>
  );
}
