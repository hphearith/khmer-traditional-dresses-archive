import { combined } from "../lib/bilingual.js";
import { TEXT, sharedByText } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";
import ProvenanceList from "./ProvenanceList.js";

// One Pending entry as a Reviewer reads it: everything the public would see once
// it is published, with the whole story open. It has no Edit or Delete, even on
// a Reviewer's own entry; deciding on the entry is not offered here yet.
// submitted is the "Submitted <date>" pair, worked out on the server (submittedText).
// Every value is plain text, so a title such as <script>…</script> is shown, never
// run, and Khmer is shown as stored.
export default function ReviewQueueCard({ entry, submitted }) {
  return (
    <article className="entry-card">
      {/* A plain img, like the Contributor entry card: the photo is public. */}
      {entry.photo_url && (
        <img className="entry-photo" src={entry.photo_url} alt={`${combined(TEXT.card.photoFor)}: ${entry.title}`} loading="lazy" />
      )}
      {entry.credit && <p className="entry-credit"><Bilingual text={sharedByText(entry.credit)} /></p>}
      <h3>{entry.title}</h3>
      <p className="entry-credit"><Bilingual text={submitted} /></p>
      <ProvenanceList entry={entry} />
      <p className="entry-story">{entry.story}</p>
    </article>
  );
}
