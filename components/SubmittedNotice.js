import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// Shown in place of the entry form once a new entry is saved. The entry waits
// for review, so it is not on the Community tab yet; My entries lists it.
export default function SubmittedNotice() {
  return (
    <div role="status" style={{ display: "grid", gap: 24, justifyItems: "start" }}>
      <p><Bilingual text={TEXT.review.submitted} /></p>
      <a className="button" href="/my-entries"><Bilingual text={TEXT.community.myEntries} inline /></a>
    </div>
  );
}
