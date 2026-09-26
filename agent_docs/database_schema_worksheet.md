# Entries table worksheet — Khmer Traditional Dresses

**Status:** recommendation before SQL, based on the current static catalogue. The
live Supabase schema, grants, and policies were not checked because account access
was unavailable.

## 1. Archive and fixed columns

**Your archive (from `collection.config.js`):** Khmer Traditional Dresses

| Column | Type | Required? | Why it is there |
| --- | --- | --- | --- |
| `id` | `uuid` | yes | Database-generated row identity; replaces the current text slug. |
| `created_at` | `timestamptz` | yes | Database-generated arrival time. |
| `owner` | `uuid` | yes | References `auth.users(id)` and identifies the contributor responsible for the entry (feature 3). |

## 2. Columns this collection carries

Use one public table, `public.entries`, with one row per garment or ensemble.
These fields are intentionally close to the current `data/garments.js` contract:

| Column name | Type | Required? | Why this column earns its place |
| --- | --- | --- | --- |
| `title` | `text` | yes | English display name and the name visitors search for (`nameEn` today). |
| `title_kh` | `text` | yes | Khmer display name and searchable source text (`nameKh` today); preserve it exactly. |
| `category` | `text` | yes | Keeps the existing lower/upper/ensemble browse filters. |
| `material` | `text` | yes | Describes the textile or construction material and remains part of search. |
| `description` | `text` | yes | Holds the entry's explanatory text without splitting a paragraph into artificial fields. |
| `source_name` | `text` | yes | Records the approved public name or attribution label of the knowledge source, distinct from the account owner. |
| `photo_url` | `text` | no | Points to a static entry photo; `NULL` means the documentary photo is still pending. |

Do not make titles unique: two entries can legitimately share a name. No slug is
needed because no current route uses the static IDs. The existing UI can keep its
field names through a small adapter: `title` → `nameEn`, `title_kh` → `nameKh`,
and `photo_url` → `imageUrl`.

## 3. The reviewer's pass

**Assumption found (write the partner's words, not yours): Assuming one entry has one photo. Shouldn't one garment or dress entry provide multiple photos for the user to look at?**
____________________________________________________________

**Suggested assumption to test—not partner testimony:** “One cover photo is enough
for every entry.” If the archive later documents making steps, one entry may need
several images; do not add that complexity to this sprint. Also confirm `source_name`
with the contributor before import rather than treating the collection-wide source
description as automatic per-entry credit.

## 4. Two questions before you are done

**Visibility:** A visitor and a contributor both see all proposed entry columns,
including `owner`. A UUID is an identifier, not an email address or an Auth record,
so this public-archive choice does not expose account details. Only the owner should
write, edit, or delete that owner's rows. The eventual implementation needs public
read access for anonymous and signed-in visitors plus ownership checks for writes
(including both old and new owner checks on updates); enable RLS and
least-privilege grants when it is built ([Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security)).

**Sprint 3 check:** Nothing here fights submit/review/publish. Do not add status,
reviewer, or publication columns today. Before drafts exist, the access model must
change from “all rows public” to explicit workflow rules; keep account data in Auth
and reference it from the table ([Supabase managing-user-data guide](https://supabase.com/docs/guides/auth/managing-user-data)).

## Import note for Friday

Generate new UUIDs; map `nameEn`, `nameKh`, `category`, `material`, and `description`
as above. Convert all eight current placeholder image paths to `NULL`; they are not
authentic photographs. Import only after a real contributor account and verified
public source credit are known—never invent an owner's identity (including the
mother's name) or assume collection-wide provenance is automatic.
