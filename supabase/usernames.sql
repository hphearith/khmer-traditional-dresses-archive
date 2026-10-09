-- Usernames at signup (issue #11).
--
-- FOR THE STUDENT TO REVIEW AND RUN in the Supabase dashboard (SQL Editor).
-- The agent never runs this against the live project. It is safe to read first:
-- it creates one table, two functions and one trigger, and changes nothing else.
--
-- How it fits together:
--   1. The sign-up form passes the chosen Username as signUp metadata
--      (auth.users.raw_user_meta_data ->> 'username'). That survives the
--      email-confirmation step because it is stored on the unconfirmed account.
--   2. When the account is confirmed (email_confirmed_at goes from null to a
--      value), a trigger copies the Username into public.usernames.
--   3. The table enforces the rules itself: format, length, and uniqueness.
--      Usernames are stored in lowercase only, so "Sokha" and "sokha" can
--      never both exist. The interface is not the only guard.
--
-- Nothing here ever copies the email address into public data.

-- ---------------------------------------------------------------------------
-- Table: one public Username per account.
-- changed_at is null until the Username is first changed, so the first choice
-- does not start the 30-day wait (the change feature itself is a later ticket).
-- ---------------------------------------------------------------------------
create table public.usernames (
  user_id uuid not null references auth.users on delete cascade,
  username text not null,
  changed_at timestamptz,

  primary key (user_id),
  -- Lowercase English letters, digits and underscore, 3 to 20 characters.
  -- Capitals are rejected here, so a different capitalisation cannot be a
  -- different Username.
  constraint usernames_username_format
    check (username ~ '^[a-z0-9_]{3,20}$'),
  constraint usernames_username_key unique (username)
);

-- ---------------------------------------------------------------------------
-- Access: anyone (including guests) can read; nobody can write through the API.
-- Only the trigger below, which runs with elevated rights, inserts rows.
-- (Changing a Username is a later, lowest-priority ticket and will add its own
-- narrowly scoped write path.)
-- ---------------------------------------------------------------------------
alter table public.usernames enable row level security;

create policy "Usernames are publicly readable"
  on public.usernames for select
  to anon, authenticated
  using (true);

revoke all on public.usernames from anon, authenticated;
grant select on public.usernames to anon, authenticated;
grant select, insert, update, delete on public.usernames to service_role;

-- ---------------------------------------------------------------------------
-- Availability check used by the sign-up form for immediate feedback.
-- Usernames are public, so this reveals nothing the table does not already show.
-- It never looks at email addresses.
-- ---------------------------------------------------------------------------
create function public.username_available(candidate text)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select not exists (
    select 1 from public.usernames where username = lower(candidate)
  );
$$;

revoke execute on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Attach the chosen Username once the account is confirmed.
--
-- Deliberately never raises: this runs inside the transaction that confirms the
-- account, so an exception here would break confirmation. If the metadata is
-- missing or invalid, or the name was taken by someone else in the meantime,
-- the account is still confirmed and simply has no Username yet. (A later
-- ticket sends such accounts to a "choose a Username" step.)
-- ---------------------------------------------------------------------------
create function public.attach_username_on_confirmation()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  chosen text := lower(new.raw_user_meta_data ->> 'username');
begin
  if new.email_confirmed_at is null then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.email_confirmed_at is not null then
    return new;
  end if;
  if chosen is null or chosen !~ '^[a-z0-9_]{3,20}$' then
    return new;
  end if;

  insert into public.usernames (user_id, username)
  values (new.id, chosen)
  on conflict do nothing;

  return new;
end;
$$;

revoke execute on function public.attach_username_on_confirmation() from public, anon, authenticated;

create trigger on_auth_user_confirmed_attach_username
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.attach_username_on_confirmation();
