# Contributor entries wait for a Reviewer before they are published

This supersedes 0002. A new or edited Contributor entry is Pending, and only a Reviewer can make it Published or Returned. The Sprint 3 brief settled what 0002 left open: "submit-review-publish" means another person approves the entry, not the Contributor previewing their own. The database is the gate. Row-level security keeps Pending and Returned entries from everyone except their Contributor (and keeps Pending ones visible to Reviewers), and the only way to change a status is `review_entry()`, which refuses anyone not on the reviewers list. The `/review` page decides only what it shows.

## Considered Options

- **Publish immediately, Curator takes entries down afterwards (0002).** Rejected: the brief needs review to happen before an entry is public, and the takedown power was never built.
- **Reviewers update `entries.status` directly.** Rejected: an update RLS refuses affects zero rows and raises no error, so a button would look like it worked when it hadn't. One function with a true/false answer is easier to check and to test as a stranger.

## Consequences

- The Community and its search read Published entries only. The Community's My entries view shows the Contributor every one of their entries and its status.
- 0002's bottleneck worry is real: nothing goes public until a Reviewer acts on it.
- A Contributor's edit always sends the entry back to Pending, even if it was Published. A Reviewer's edit leaves its status alone.
- The Draft and Hidden states from 0002 are gone. They were never built.
