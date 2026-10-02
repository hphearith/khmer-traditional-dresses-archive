# Contributor entries plan

**Status:** Requirements decided and approved. Implementation is specified in
[issue #9](https://github.com/hphearith/khmer-traditional-dresses-archive/issues/9)
(Sprint 2) and has not started. The filename is kept for continuity; despite it,
no catalogue migration is planned.

The eight official records in `data/garments.js` remain curated website content
and are published through website code deployments. They are not migrated,
contributor-owned, or mixed with Contributor entries. Supabase Auth is implemented
for contributor accounts.

Contributor entries are one Contributor's story of one specific dress they
ordered or had custom made. They are a separate, unimplemented kind of Entry. The
terms used here are defined in [`CONTEXT.md`](../CONTEXT.md); earlier drafts of
this plan called them "posts" and "the pool", which are retired words.

## Where each decision is recorded

- **Purpose, audience, and why two kinds of Entry:** `CONTEXT.md` and
  [ADR 0001](../docs/adr/0001-official-records-static-contributor-entries-in-database.md).
- **Review and publishing model:** [ADR 0002](../docs/adr/0002-contributor-entries-publish-without-approval.md),
  status `proposed` until checked against the Sprint 3 brief.
- **Fields, photos and consent, ownership, editing and deletion, public visibility,
  search, usernames, moderation, and the Sprint 2 versus Sprint 3 split:**
  issue #9.

## What is still open

- Photo file types and maximum size, text length limits, and the consent wording
  need approval before implementation (listed in issue #9).
- Whether stored photos need automatic cleanup when an account is removed.
- ADR 0002 and the Sprint 3 work (entry states, the Curator flag, hide and delete)
  wait for the Sprint 3 brief.

## Resume gate

Begin implementation only after the open parameters above are approved and the
issue has been broken into tickets. Define the Contributor-entry data, access,
storage, and publication behavior from the approved requirements before writing
database or application code. Build only what the current sprint asks for.
