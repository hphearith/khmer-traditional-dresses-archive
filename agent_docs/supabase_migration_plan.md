# Supabase entries migration plan

**Status:** Deferred until email-confirmation implementation is verified. This is
the saved plan; no live schema, grants, policies, or import have been checked or
changed.

## Scope and operator decisions

Migrate the eight records in `data/garments.js` to `public.entries`, then load
the public catalogue from Supabase. The operator chose the existing project's
Dashboard SQL Editor and limits this migration to database setup and catalogue
browsing. During setup, confirm the contributor's real Auth user UUID and the
exact source credit for each entry. Do not invent either value. Do not add
submission, review, publication, or Storage features in this migration.

Use two reviewed SQL artifacts: one for schema, grants, and RLS; a second for
the guarded one-time import. Before setup, inspect existing columns, rows,
grants, and policies. If existing state conflicts, stop and reconcile it; do
not overwrite data. PostgreSQL permissive policies combine with OR, so remove
an incompatible broad write policy only after identifying and reviewing its
effect.

## Table and access contract

Create one row per garment or ensemble with:

| Column | Definition |
| --- | --- |
| `id` | `uuid` primary key, default `gen_random_uuid()` |
| `created_at` | `timestamptz NOT NULL`, default `now()` |
| `owner` | `uuid NOT NULL`, references `auth.users(id) ON DELETE RESTRICT` |
| `title` | required English display name (`nameEn` in the current data) |
| `title_kh` | required Khmer name (`nameKh`); preserve exactly |
| `category` | required text; check allows only `lower`, `upper`, `ensemble` |
| `material` | required text |
| `description` | required text |
| `source_name` | required text; approved per-entry public attribution |
| `photo_url` | nullable text; `NULL` while authentic photos are pending |

Add an index on `owner`. Do not add title uniqueness, slugs, a display-order
column, or Sprint 3 workflow fields. Public browsing sorts by `title` A–Z, then
`id` for a stable tie-breaker.

Enable RLS. Grant `SELECT` to `anon`; grant `SELECT`, `INSERT`, `UPDATE`, and
`DELETE` to `authenticated`. Policies must allow public reads and restrict
writes to the row owner: inserts check `owner = auth.uid()`; updates use that
predicate for both `USING` and `WITH CHECK`, preventing reassignment; deletes
use it for `USING`. Test these permissions through real app sessions because
SQL Editor administrator access does not prove RLS behavior.

## One-time import

Map `nameEn` → `title`, `nameKh` → `title_kh`, and copy `category`, `material`,
and `description` verbatim. Set each `source_name` to its confirmed credit and
each `owner` to the confirmed Auth UUID. Convert all eight placeholder image
paths to `NULL`; omit IDs and timestamps so PostgreSQL generates them.

The import artifact must run transactionally, lock `public.entries`, require
the table to be empty, and reject a repeat run before changing any rows. It
must not partially import. Verify eight rows, exact source text and field
parity, generated IDs/timestamps, and eight null photo URLs before app cutover.

## Application cutover and checks

After the database checks pass, use the existing publishable Supabase SSR
client for an explicit-field server-side catalogue read. Adapt `title`,
`title_kh`, and `photo_url` to the current `nameEn`, `nameKh`, and `imageUrl`
view fields, and pass records from `app/page.js` to `GarmentsArchive`. Keep the
existing client-side search and `data/garments.js` as the reference dataset.
Show distinct states for load failure, an empty catalogue, and no search
matches; provide reload retry and do not silently fall back to static data.

Acceptance checks:

- Imported English and Khmer text, categories, materials, descriptions, and
  source credits match all eight source records; photos remain pending.
- Re-running the import rejects without changing the table; required fields,
  category checks, foreign key, and owner index are present.
- An anonymous visitor can read. The owner can create, read, update, and delete
  their own disposable row; a non-owner cannot write it or reassign ownership.
- Search still handles Khmer and English phrases, category filters,
  autocomplete, reset, and pending images. Check fresh requests, build,
  browser behavior, and auth regression.

Once verified, update `DESIGN.md` to replace its static-data rule and update
affected project documentation. Cut over only after DB verification. If app
cutover needs rollback, restore the static loader while preserving database
data.

## Dashboard handoff

1. Select the existing Supabase project and inspect `public.entries`, its data,
   grants, and policies.
2. Copy the real contributor UUID from Auth Users and confirm the exact source
   credit for every row.
3. Review and run the setup SQL, then review and run the guarded import SQL.
4. Verify the imported rows and RLS through anonymous, owner, and non-owner app
   sessions before changing the catalogue loader.
5. Use the existing project URL and publishable environment value locally and
   in Vercel; do not put credentials in committed files.

References: [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api/)
and [Postgres row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
