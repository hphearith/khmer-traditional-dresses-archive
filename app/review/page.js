import Link from "next/link";
import { redirect } from "next/navigation";
import Bilingual from "../../components/Bilingual.js";
import ReviewQueue from "../../components/ReviewQueue.js";
import Shop from "../../components/Shop.js";
import { readUsername } from "../../lib/readUsername.js";
import { readReviewQueue } from "../../lib/review.js";
import { createClient } from "../../lib/supabase/server.js";
import { TEXT, submittedText } from "../../lib/uiText.js";
import { readVisitor } from "../../lib/visitor.js";

export const dynamic = "force-dynamic";

// The Review queue, for Reviewers. This page only decides what to show: the
// database refuses everyone else's Pending entries whatever this page does.
export default async function ReviewPage() {
  const supabase = await createClient();
  const user = await readVisitor(supabase);
  if (!user) redirect("/login");

  // Both reads start at once. Inside readReviewQueue the Reviewer check still
  // comes first and no entry is read without it, so starting it before the
  // Username is known shows nothing the database would not.
  const [{ username, error: usernameError }, queue] = await Promise.all([
    readUsername(supabase, user.id),
    readReviewQueue(supabase),
  ]);

  // Same rule as My entries: a failed lookup is not "no Username".
  if (!usernameError && !username) redirect("/choose-username");
  if (queue.access === "failed") console.error("Reading the Review queue failed:", queue.error);

  return (
    <Shop>
      <main className="container record-page review-page">
        <Link className="back-link" href="/?tab=community"><Bilingual text={TEXT.page.backToCommunity} inline /></Link>
        {/* A page with only a message has no queue title: the message is its heading. */}
        {queue.access === "failed" ? (
          <div className="empty" role="alert">
            <h1 className="sheet-title"><Bilingual text={TEXT.community.loadFailed} /></h1>
            <p><Bilingual text={TEXT.community.loadFailedHelp} /></p>
          </div>
        ) : queue.access === "not-reviewer" ? (
          <div className="empty">
            <h1 className="sheet-title"><Bilingual text={TEXT.review.queue.notReviewer} /></h1>
          </div>
        ) : (
          <>
            <h1 className="sheet-title review-title"><Bilingual text={TEXT.review.queue.title} /></h1>
            <ReviewQueue entries={queue.entries.map((entry) => ({ ...entry, submitted: submittedText(entry.created_at) }))} />
          </>
        )}
      </main>
    </Shop>
  );
}
