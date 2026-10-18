"use client";

import { useEntryDraft } from "../lib/useEntryDraft.js";
import { useEntryForm } from "../lib/useEntryForm.js";
import ConsentField from "./ConsentField.js";
import EntryField from "./EntryField.js";
import PhotoField from "./PhotoField.js";
import ProvenanceFields from "./ProvenanceFields.js";
import RestoredNotice from "./RestoredNotice.js";

// noValidate: the browser's own required-field bubble shows only one field at
// a time. The form checks every field itself and shows each message in place.
// With an entryId the form edits that entry, starting from the stored values in
// initial (formValuesFromEntry in lib/entry.js) and the photo it holds now
// (photo: { path, url }). Without an entryId it writes a new entry.
// The text typed so far is kept in this browser as a Local draft (lib/draft.js) and
// comes back when the form is reopened; it is cleared once the entry is saved.
// userId is the signed-in account, so a Local draft is never shown to anyone else.
export default function EntryForm({ userId, entryId = null, initial = {}, photo = null }) {
  const draft = useEntryDraft({ userId, entryId, initial });
  const { pending, errors, formError, handleSubmit } = useEntryForm({ entryId, photoPath: photo?.path, onSaved: draft.onSaved });
  const { values, restoreKey } = draft;
  const saveLabel = entryId ? "Save changes" : "Save entry";

  return (
    <form onSubmit={handleSubmit} onChange={draft.handleChange} onCompositionEnd={draft.handleChange} noValidate aria-busy={pending} style={{ display: "grid", gap: 24 }}>
      <EntryField key={`title-${restoreKey}`} name="title" label="Title" required error={errors.title} initialValue={values.title} />
      <EntryField key={`story-${restoreKey}`} name="story" label="Story" required multiline error={errors.story} initialValue={values.story}
        hint="Who it was made for, how it was ordered, what it means to you." />
      <RestoredNotice restored={draft.restored} />
      {/* A new entry needs its one photo. An edit may replace it, or keep it by choosing nothing. */}
      <PhotoField error={errors.photo} current={entryId && photo ? { url: photo.url, title: initial.title } : null} />
      <ConsentField error={errors.consent} onlyWithNewPhoto={Boolean(entryId)} />
      <EntryField key={`credited_as-${restoreKey}`} name="credited_as" label="Credited as" error={errors.credited_as} initialValue={values.credited_as}
        hint="The name shown on this entry. Leave it blank to show your @Username." />
      <ProvenanceFields key={`provenance-${restoreKey}`} errors={errors} initial={values} />
      {formError && <p role="alert" style={{ color: "red" }}>{formError}</p>}
      <button className="button" type="submit" disabled={pending}
        style={{ opacity: pending ? 0.7 : 1, cursor: pending ? "wait" : "pointer" }}>
        {pending ? "Saving…" : saveLabel}
      </button>
    </form>
  );
}
