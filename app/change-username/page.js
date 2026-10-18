import Link from "next/link";
import { redirect } from "next/navigation";
import ChangeUsernameForm from "../../components/ChangeUsernameForm.js";
import { readUsername } from "../../lib/readUsername.js";
import { createClient } from "../../lib/supabase/server.js";
import { formatUsername } from "../../lib/username.js";
import { checkUsernameChange, formatAllowedAt, USERNAME_CHANGE_WAIT_DAYS } from "../../lib/usernameChange.js";

export const dynamic = "force-dynamic";

export default async function ChangeUsernamePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { username, changedAt, error } = await readUsername(supabase, user.id);
  if (!error && !username) redirect("/choose-username");

  // Only an early answer: the database refuses a change inside the wait even
  // if this page is stale or the form is skipped (supabase/change-username.sql).
  const change = checkUsernameChange(changedAt);

  return (
    <main style={{
      minHeight: "100vh", background: "var(--paper)", color: "var(--ink)",
      padding: "48px 24px", display: "grid", placeItems: "center",
    }}>
      <section aria-labelledby="change-username-title" style={{ width: "100%", maxWidth: 440 }}>
        <p style={{ marginBottom: 24 }}>
          <Link href="/" style={{ color: "var(--wine)" }}>Back to the archive</Link>
        </p>
        <h1 id="change-username-title" style={{ fontSize: 40, marginBottom: 16 }}>Change your Username</h1>
        {username && (
          <p style={{ marginBottom: 16 }}>Your Username is <strong>{formatUsername(username)}</strong>.</p>
        )}
        <p style={{ color: "var(--muted)", marginBottom: 32 }}>
          Entries that show your Username will show the new one. After a change you must wait
          {" "}{USERNAME_CHANGE_WAIT_DAYS} days before changing it again.
        </p>
        {error && (
          <p role="alert" style={{ marginBottom: 32 }}>
            We could not check when you last changed your Username. You can still try; we will tell you if it is too soon.
          </p>
        )}
        {change.allowed ? (
          <ChangeUsernameForm />
        ) : (
          <p role="status">
            You changed your Username recently. You can change it again from {formatAllowedAt(change.allowedAt)}.
          </p>
        )}
      </section>
    </main>
  );
}
