import Bilingual from "./Bilingual.js";

// A Return note, read-only, under heading (an { en, km } pair). The note is the
// Reviewer's own words: React shows it as plain text, never as HTML, with its
// line breaks kept and Khmer exactly as written. With no note it shows nothing,
// since an entry Returned before Return notes existed has none. Each caller
// decides which statuses show a note at all.
export default function ReturnNote({ heading, note }) {
  if (!note) return null;
  return (
    <div className="return-note">
      <p className="return-note-heading"><Bilingual text={heading} /></p>
      <p className="return-note-text">{note}</p>
    </div>
  );
}
