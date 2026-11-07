import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// The capsule that says where an entry stands: Pending, Published or Returned.
// The status word is always on it, so the meaning never rests on colour alone.
// English and Khmer share one line, as on buttons and tab names. A status the
// pill has no words for shows nothing rather than a wrong word.
export default function StatusPill({ status }) {
  const text = TEXT.review.pill[status];
  if (!text) return null;
  return (
    <span className={`status-pill status-pill-${status}`}>
      <Bilingual text={text} inline />
    </span>
  );
}
