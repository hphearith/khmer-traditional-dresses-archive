import Link from "next/link";
import { redirect } from "next/navigation";
import Bilingual from "../../components/Bilingual.js";
import ReviewQueueCard from "../../components/ReviewQueueCard.js";
import { readUsername } from "../../lib/readUsername.js";
import { readReviewQueue } from "../../lib/review.js";
import { createClient } from "../../lib/supabase/server.js";
import { TEXT, submittedText } from "../../lib/uiText.js";

export const dynamic = "force-dynamic";

// A page with only a message has no queue title: the message is its heading.
const messageHeading = { fontSize: 26, lineHeight: 1.3 };

// The Review queue, for Reviewers. This page only decides what to show: the
// database refuses everyone else's Pending entries whatever this page does.
export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Same rule as My entries: a failed lookup is not "no Username".
  const { username, error: usernameError } = await readUsername(supabase, user.id);
  if (!usernameError && !username) redirect("/choose-username");

  // The Reviewer check comes first and no entry is read without it.
  const queue = await readReviewQueue(supabase);
  if (queue.access === "failed") console.error("Reading the Review queue failed:", queue.error);

  return (
    <main className="container" style={{ minHeight: "100vh", padding: "48px 0" }}>
      <p style={{ marginBottom: 24 }}>
        <Link href="/?tab=community" style={{ color: "var(--wine)" }}><Bilingual text={TEXT.page.backToCommunity} inline /></Link>
      </p>
      {queue.access === "failed" ? (
        <div className="empty" role="alert">
          <h1 style={messageHeading}><Bilingual text={TEXT.community.loadFailed} /></h1>
          <p><Bilingual text={TEXT.community.loadFailedHelp} /></p>
        </div>
      ) : queue.access === "not-reviewer" ? (
        <div className="empty">
          <h1 style={messageHeading}><Bilingual text={TEXT.review.queue.notReviewer} /></h1>
        </div>
      ) : (
        <>
          <h1 style={{ fontSize: 40, marginBottom: 32 }}><Bilingual text={TEXT.review.queue.title} /></h1>
          {queue.entries.length === 0 ? (
            <div className="empty">
              <h2><Bilingual text={TEXT.review.queue.empty} /></h2>
            </div>
          ) : (
            <div className="grid">
              {queue.entries.map((entry) => (
                <ReviewQueueCard key={entry.id} entry={entry} submitted={submittedText(entry.created_at)} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
