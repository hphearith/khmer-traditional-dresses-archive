-- Contributor entries: adding and editing need a Username again (issue #56).
--
-- ALREADY RUN on the live project (2026-11-07), in the Supabase dashboard (SQL
-- Editor), after review-gate.sql and entries-status.sql. This file is the record
-- of what was run. It replaces two policies and changes nothing else. It is safe
-- to run again. pg_policies confirmed the new rules are live, but most of the
-- behaviour checks were skipped: see entries-username-rule-manual-checks.md.
--
-- How it fits together:
--   1. entries.sql and entries-edit.sql required a Username to add or edit an
--      entry. The review gate replaced those policies with ones that do not,
--      so an account with no Username could add an entry through the API. The
--      delete policy kept the rule, and this brings the other two back in line.
--   2. Everything else in the two policies is the live text, read from
--      pg_policies on 2026-11-07: owner only, a new entry must be pending, and
--      an edit must be pending unless the editor is a Reviewer.
--   3. A refused insert raises 42501. A refused update raises no error when the
--      row is not matched: the API answers with no rows, which the form reports
--      as "That change wasn't saved" (changeWasSaved in lib/entry.js).
--   4. Before writing this, the owner of every entry was checked to have a
--      Username (2026-11-07, no rows), so no entry's owner is locked out of it.
--   5. A Reviewer may still save any status on their own entry. That is a
--      decision, not a gap: see docs/adr/0004.
--
-- To undo: the block at the end of this file puts back the policies as they
-- were before this file.

begin;

drop policy if exists "owners add their own entries" on public.entries;
create policy "owners add their own entries"
  on public.entries for insert
  to authenticated
  with check (
    (select auth.uid()) = owner
    and status = 'pending'
    and exists (select 1 from public.usernames where user_id = (select auth.uid()))
  );

drop policy if exists "owners edit their own entries" on public.entries;
create policy "owners edit their own entries"
  on public.entries for update
  to authenticated
  using (
    (select auth.uid()) = owner
    and exists (select 1 from public.usernames where user_id = (select auth.uid()))
  )
  with check (
    (select auth.uid()) = owner
    and exists (select 1 from public.usernames where user_id = (select auth.uid()))
    and (status = 'pending' or (select public.is_reviewer()))
  );

commit;

-- ---------------------------------------------------------------------------
-- Undo, only if this change causes a problem. Remove the comment marks and run
-- these lines on their own: they are the policies as read on 2026-11-07, before
-- this file was run.
--
-- begin;
-- drop policy if exists "owners add their own entries" on public.entries;
-- create policy "owners add their own entries"
--   on public.entries for insert to authenticated
--   with check ((select auth.uid()) = owner and status = 'pending');
-- drop policy if exists "owners edit their own entries" on public.entries;
-- create policy "owners edit their own entries"
--   on public.entries for update to authenticated
--   using ((select auth.uid()) = owner)
--   with check ((select auth.uid()) = owner and (status = 'pending' or (select public.is_reviewer())));
-- commit;
-- ---------------------------------------------------------------------------
