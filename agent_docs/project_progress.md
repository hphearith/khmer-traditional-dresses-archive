# Project Progress

The eight official garment entries remain curated website content in
`data/garments.js`. Supabase provides contributor authentication, but no catalogue
database migration is planned. The future contributor-post pool is intentionally
paused for requirements work.

## Goal

Keep the official archive stable and static while defining the separate future
experience for contributor posts about ordered or custom-made traditional dresses.

## Overall Progress

Public guest browsing, search/filter behavior, and cookie-backed contributor
authentication are implemented. The abandoned official-catalogue SQL setup,
guarded import, and focused migration test have been removed. No live catalogue
schema, policy, or data mutation occurred.

## Current Position

The official catalogue continues to load from `data/garments.js` and is published
through normal website code deployments. Contributor accounts do not own or write
those records. A separate contributor-post data model, ownership boundary, media
rules, and review/publishing workflow have not been approved or implemented.
The current weekly course documentation is drafted truthfully as a blocker submission;
only its live Vercel URL placeholder remains for the student to fill.

## Next Milestone

Revise `supabase_migration_plan.md` to decide the future contributor-post scope and
workflow before any database schema or SQL is written. Keep that work separate from
the official catalogue and do not build ahead of the approved course sprint.
