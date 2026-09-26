# Project Diary

Maintain a compact project-experience reference that prevents repeated mistakes.
Record only distinct decisions, discarded approaches, mistakes, and reusable
lessons that can affect future work. Consolidate repetition; preserve the
context, reason, outcome, and applicability of each lesson. Do not record
session chronology, releases, commits, routine maintenance, or raw logs.

## Decisions and Lessons

- Keep pre-SQL schema proposals distinct from the live database. The current
  catalogue has no recorded account ownership or per-entry source credit;
  neither a display name nor collection-wide provenance proves those values.
  Confirm them before import, preserve Khmer verbatim, and represent pending
  photos as missing data rather than documentary images.

- Keep archive identity in `collection.config.js`; both metadata and page
  content already consume it, so new UI should continue using that boundary.
- Treat Khmer strings as source content, not data to normalize or transliterate;
  preserve them when editing records or UI.
- Keep the current implementation limited to Next.js, React, and the two
  Sprint 2-approved Supabase packages, using plain JavaScript components and
  existing inline-style conventions.
- README.md describes future course features, but the source is currently a
  static archive. Implement only the assigned sprint scope rather than
  assuming those features are already available.
- A dangling `node_modules/.bin/next` link and missing declared top-level
  packages cause `npm run dev` to report `next: command not found`. Restore the
  lockfile-defined tree with `npm ci`; do not change dependency declarations.
  Running `pnpm run dev` only executes the existing script and does not itself
  explain removed packages, unlike an install operation.
- When documentary photographs are unavailable, label decorative textile
  studies and catalogue wells as illustrative or pending. Do not let the shared
  placeholder SVG imply a documented Khmer motif or authentic garment image.
- Preserve the archive controller and `lib/garmentSearch.js` rules when changing
  presentation. Accessible combobox state, live counts, pressed filters, reset
  focus, and native disclosures can be added around the same data contract.
- Mixed or stale `.next` output can pass a new build yet fail at runtime with an
  incorrect server chunk path. Move the generated directory aside, rebuild from
  a clean output state, and require an HTTP/browser check before accepting a
  production UI deployment.
- For cookie-based Supabase SSR auth, validate identity with `getClaims()` in a
  Next.js request boundary and preserve refreshed cookies plus cache-control
  headers on redirects. This project uses Next.js 15, so the boundary is
  `middleware.js`; do not copy the Next.js 16 `proxy.js` filename without a
  framework upgrade.
- Treat Supabase session cookies as necessary only for the contributor account
  service, not for viewing the archive. Keep `/` usable without an auth cookie,
  explain the storage before sign-in, and verify persistence with a full server
  navigation so browsers that block cookies receive a stable guest fallback
  instead of a redirect loop. Do not replace cookies with local storage merely
  to avoid cookie disclosure; both are client-side storage mechanisms.
