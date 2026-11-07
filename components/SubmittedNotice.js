import { getHomeTabHref } from "../lib/homeTabs.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// Shown in place of the entry form once a new entry is saved. The entry waits
// for review, so it is not in All entries yet; the Community's My entries view lists it.
export default function SubmittedNotice() {
  return (
    <div role="status" style={{ display: "grid", gap: 24, justifyItems: "start" }}>
      <p><Bilingual text={TEXT.review.submitted} /></p>
      <a className="button" href={getHomeTabHref("community", "mine")}><Bilingual text={TEXT.community.myEntries} inline /></a>
    </div>
  );
}
