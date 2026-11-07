-- Contributor entries: a Reviewer's own entry needs no approval (issue #58).
--
-- ALREADY RUN on the live project (2026-11-07), in the Supabase dashboard (SQL
-- Editor), after entries-username-rule.sql and before the app change for #58 was
-- deployed. This file is the record of what was run. It replaces one policy and
-- adds one column grant, and changes nothing else. It is safe to run again. See
-- entries-reviewer-publish-manual-checks.md for what has been checked.
--
-- How it fits together:
--   1. The form now sends status published on a Reviewer's new entry. Without
--      this file that insert is refused, because status is not granted for
--      insert and the policy allows only pending. A Contributor's new entry
--      sends no status, so it keeps working either way.
--   2. The grant opens the column to every signed-in account, so the policy is
--      the check: anyone but a Reviewer can still add an entry only as pending.
--   3. The edit policy needs no change: it already lets a Reviewer save any
--      status on their own entry.
--   4. Another Contributor's entry still changes status only through
--      review_entry(). See docs/adr/0004.
--
-- To undo: the block at the end of this file puts back the policy and the grant
-- as they were before this file.

begin;

drop policy if exists "owners add their own entries" on public.entries;
create policy "owners add their own entries"
  on public.entries for insert
  to authenticated
  with check (
    (select auth.uid()) = owner
    and exists (select 1 from public.usernames where user_id = (select auth.uid()))
    and (status = 'pending' or (select public.is_reviewer()))
  );

grant insert (status) on public.entries to authenticated;

commit;

-- ---------------------------------------------------------------------------
-- Undo, only if this change causes a problem. Remove the comment marks and run
-- these lines on their own. Undo the app change too, or a Reviewer's new entries
-- will be refused.
--
-- begin;
-- revoke insert (status) on public.entries from authenticated;
-- drop policy if exists "owners add their own entries" on public.entries;
-- create policy "owners add their own entries"
--   on public.entries for insert
--   to authenticated
--   with check (
--     (select auth.uid()) = owner
--     and status = 'pending'
--     and exists (select 1 from public.usernames where user_id = (select auth.uid()))
--   );
-- commit;
-- ---------------------------------------------------------------------------
