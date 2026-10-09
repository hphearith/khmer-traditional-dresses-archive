-- Contributor entries: edit your own entry (issue #14).
--
-- FOR THE STUDENT TO REVIEW AND RUN in the Supabase dashboard (SQL Editor),
-- after supabase/entries.sql. The agent never runs this against the live
-- project. It adds one update policy, one column grant, one function and one
-- trigger, and changes nothing else. Run it once: running it again fails,
-- because the policy, the function and the trigger already exist.
--
-- How it fits together:
--   1. Only the owner of an entry can update it, and only while the owner has
--      a Username, the same rule as an insert (supabase/entries.sql). For any
--      other account, and for a guest, the row is not matched, so nothing
--      changes.
--   2. A refused update is not an error. The API answers with no rows, which
--      is why the form asks for the changed row back (.select()) and says
--      "That change wasn't saved" when none comes back.
--   3. The owner column is not granted for update, and the policy's check
--      requires owner = auth.uid(), so an entry can never be handed to another
--      account, even by a direct call.
--   4. Every update meets the same limits as an insert: the check constraints
--      and the year trigger in supabase/entries.sql apply to updates as well.
--   5. updated_at is set by the database on every change, never by the client.
--
-- The list position does not move: entries stay ordered by created_at, which
-- no update changes.

-- ---------------------------------------------------------------------------
-- Who may change a row: its owner, and only its owner, and only an account
-- that has chosen a Username (the insert policy asks the same).
-- ---------------------------------------------------------------------------
create policy "Owners update their own entries"
  on public.entries for update
  to authenticated
  using (
    owner = (select auth.uid())
    and exists (select 1 from public.usernames where user_id = (select auth.uid()))
  )
  with check (
    owner = (select auth.uid())
    and exists (select 1 from public.usernames where user_id = (select auth.uid()))
  );

-- ---------------------------------------------------------------------------
-- Which columns may change: the form's fields only. Never owner, id or the
-- timestamps. lib/entry.js names the same eight columns.
-- ---------------------------------------------------------------------------
grant update (title, story, credited_as, occasion, year, maker, place, materials)
  on public.entries to authenticated;

-- ---------------------------------------------------------------------------
-- updated_at follows every change. The database sets it, so a client cannot.
-- ---------------------------------------------------------------------------
create function public.entries_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke execute on function public.entries_set_updated_at() from public, anon, authenticated;

create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.entries_set_updated_at();
