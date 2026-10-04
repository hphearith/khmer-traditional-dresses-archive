-- Contributor entries, first slice: write a text-only entry (issue #13).
--
-- FOR THE STUDENT TO REVIEW AND RUN in the Supabase dashboard (SQL Editor),
-- after supabase/usernames.sql. The agent never runs this against the live
-- project. It creates one table, two indexes, one function and one trigger,
-- and changes nothing else.
--
-- How it fits together:
--   1. Every entry belongs to one account (owner). Removing the account
--      removes its entries (on delete cascade).
--   2. Anyone, including guests with no auth cookie, can read every entry.
--      Every saved entry is public at once (there is no Draft state until
--      Sprint 3, see ADR 0002).
--   3. Only a signed-in account that has a Username can insert, and only with
--      itself as owner. There is no update or delete yet: editing and deleting
--      are later tickets and will add their own owner-only rules.
--   4. The table refuses bad data itself, with the same limits as
--      lib/entry.js, so a direct API call cannot store what the form refuses.
--      Change both together.
--
-- The text limits use char_length(trim(column)). Postgres trim() removes
-- spaces only (not tabs or newlines), and char_length() counts characters, not
-- bytes, so a Khmer letter such as ក counts as 1. This matches the form.
-- Khmer text is stored exactly as typed: nothing here normalises it.

-- ---------------------------------------------------------------------------
-- Table
-- photo_path stays nullable in this slice. Issue #16 makes a photo required;
-- delete any text-only test entries before running that ticket's SQL.
-- ---------------------------------------------------------------------------
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users on delete cascade,
  title text not null,
  story text not null,
  credited_as text,
  occasion text,
  year integer,
  maker text,
  place text,
  materials text,
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Required fields: not blank after trimming spaces, and within the limit.
  constraint entries_title_length check (char_length(trim(title)) between 1 and 120),
  constraint entries_story_length check (char_length(trim(story)) between 1 and 5000),
  -- Optional fields: may be null (check constraints pass on null); when
  -- present they must not be blank, so "no value" is always stored as null.
  constraint entries_credited_as_length check (char_length(trim(credited_as)) between 1 and 50),
  constraint entries_occasion_length check (char_length(trim(occasion)) between 1 and 100),
  constraint entries_maker_length check (char_length(trim(maker)) between 1 and 100),
  constraint entries_place_length check (char_length(trim(place)) between 1 and 100),
  constraint entries_materials_length check (char_length(trim(materials)) between 1 and 200),
  -- The lower year bound is fixed. The upper bound (the current year) changes
  -- over time, which a check constraint must not depend on, so the trigger
  -- below enforces it.
  constraint entries_year_earliest check (year >= 1900)
);

-- Newest first on the Community tab; owner for the cascade and "My entries".
create index entries_created_at_idx on public.entries (created_at desc);
create index entries_owner_idx on public.entries (owner);

-- ---------------------------------------------------------------------------
-- Year cannot be in the future.
-- Compared with the year on the world's most-ahead clock (UTC+14), so the
-- database is never stricter than a visitor's browser on New Year's Day.
-- ---------------------------------------------------------------------------
create function public.entries_check_year()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.year > extract(year from now() at time zone 'Pacific/Kiritimati') then
    raise exception 'year % is in the future', new.year using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke execute on function public.entries_check_year() from public, anon, authenticated;

create trigger entries_check_year
  before insert or update of year on public.entries
  for each row execute function public.entries_check_year();

-- ---------------------------------------------------------------------------
-- Access
-- New tables here do not inherit grants, so every grant is explicit.
-- Guests (anon) can only read. Signed-in accounts can read, and insert only
-- the columns the form sends: id, created_at, updated_at and photo_path are
-- set by the database (photo_path is granted by issue #16).
-- ---------------------------------------------------------------------------
alter table public.entries enable row level security;

create policy "Entries are publicly readable"
  on public.entries for select
  to anon, authenticated
  using (true);

create policy "Contributors with a Username create entries as themselves"
  on public.entries for insert
  to authenticated
  with check (
    owner = (select auth.uid())
    and exists (select 1 from public.usernames where user_id = (select auth.uid()))
  );

revoke all on public.entries from anon, authenticated;
grant select on public.entries to anon, authenticated;
grant insert (owner, title, story, credited_as, occasion, year, maker, place, materials)
  on public.entries to authenticated;
grant select, insert, update, delete on public.entries to service_role;
