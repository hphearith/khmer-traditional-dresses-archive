-- Contributor entries: the review gate (Lab 10, docs/adr/0004).
--
-- ALREADY RUN on the live project, in the Supabase dashboard (SQL Editor),
-- before entries-status.sql. DO NOT RUN THIS FILE. It is a record only, and
-- nothing in it needs to be run again.
--
-- What this file is, and is not:
--   1. The SQL below is the text of the Lab 10 brief, unchanged. It is not a
--      copy taken from the live database.
--   2. It cannot be exactly what ran here. The three "drop policy" lines name
--      policies this project never created under those names. entries.sql
--      calls them "Entries are publicly readable" and "Contributors with a
--      Username create entries as themselves", and entries-edit.sql calls the
--      third "Owners update their own entries". A failed drop cancels the whole
--      transaction, so those lines must have been changed when it was run, or
--      the old policies removed some other way.
--   3. The live policies were compared with this text on 2026-11-07. The read,
--      add and edit policies matched steps 5, 6 and 7, and the old policies
--      were gone. Steps 6 and 7 dropped the Username rule the old policies had,
--      so entries-username-rule.sql has since replaced them (issue #56). The
--      status column, its check constraint, the functions and the grants were
--      not compared.
--   4. To see the rules really in force, ask the database (read-only):
--        select policyname, cmd, roles, qual, with_check
--        from pg_policies
--        where schemaname = 'public' and tablename in ('entries', 'reviewers');
--   5. PASTE-YOUR-UUID-HERE is left as the brief wrote it. The real reviewer's
--      id stays out of this public repository.
--
-- Running it by accident changes nothing. On the live project step 1 fails
-- because the column exists, and on a new project the placeholder in step 3 is
-- not a valid id. Either failure cancels the whole transaction.

begin;

-- 1. every entry gets a status. new entries start as pending.
alter table entries
  add column status text not null default 'pending'
  check (status in ('pending', 'published', 'returned'));

-- 2. everything already in your archive came from you and your sources: publish it
update entries set status = 'published';

-- 3. who can review: a list that only the SQL Editor can change
create table reviewers (
  user_id uuid primary key references auth.users (id)
);
alter table reviewers enable row level security;
-- no policies on purpose: nobody reads or writes this table through the API
insert into reviewers (user_id) values ('PASTE-YOUR-UUID-HERE');

-- 4. a yes/no question any request can ask: am I a reviewer?
create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.reviewers where user_id = (select auth.uid()));
$$;

-- 5. reading: everyone sees published, you see your own, reviewers see everything
drop policy "anyone can read entries" on entries;
create policy "anyone can read published entries"
  on entries for select
  using (status = 'published' or (select auth.uid()) = owner or (select public.is_reviewer()));

-- 6. adding: your own, and it waits for review
drop policy "owners add their own entries" on entries;
create policy "owners add their own entries"
  on entries for insert to authenticated
  with check ((select auth.uid()) = owner and status = 'pending');

-- 7. editing: your own, and an edit goes back to review (reviewers keep theirs published)
drop policy "owners edit their own entries" on entries;
create policy "owners edit their own entries"
  on entries for update to authenticated
  using ((select auth.uid()) = owner)
  with check ((select auth.uid()) = owner and (status = 'pending' or (select public.is_reviewer())));

-- 8. the one door reviewers use, and it only moves status
create or replace function public.review_entry(entry_id uuid, decision text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_reviewer() then
    return false;
  end if;
  if decision not in ('published', 'returned') then
    return false;
  end if;
  update public.entries set status = decision
    where id = entry_id and status = 'pending';
  return found;
end;
$$;
revoke execute on function public.review_entry(uuid, text) from public, anon;
grant execute on function public.review_entry(uuid, text) to authenticated;

commit;
