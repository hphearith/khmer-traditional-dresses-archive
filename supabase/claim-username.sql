-- Existing accounts choose a Username at next login (issue #12).
--
-- FOR THE STUDENT TO REVIEW AND RUN in the Supabase dashboard (SQL Editor),
-- after supabase/usernames.sql. The agent never runs this against the live
-- project. It creates one function and changes nothing else.
--
-- Why it exists: public.usernames has no write access through the API (see
-- usernames.sql), so an account that confirmed before Usernames existed has no
-- way to add its own row. This function is the one narrow write path: it lets
-- a signed-in account add a Username for ITSELF, once.
--
--   * It only ever acts for the caller (auth.uid()); there is no user id
--     argument, so nobody can claim a Username for someone else.
--   * It refuses if the account already has a Username, so it cannot be used
--     to change one and skip the 30-day wait (a later, lowest-priority ticket).
--   * changed_at is left empty, so the first choice does not start the wait.
--   * Format and case-insensitive uniqueness are still enforced by the table.
--
-- It returns a status instead of raising, so the interface can show a clear
-- message: 'ok', 'taken', 'invalid' or 'already-chosen'.

create or replace function public.claim_username(candidate text)
returns text
language plpgsql
security definer set search_path = ''
as $$
declare
  me uuid := auth.uid();
  chosen text := lower(candidate);
begin
  if me is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;
  if chosen is null or chosen !~ '^[a-z0-9_]{3,20}$' then
    return 'invalid';
  end if;
  if exists (select 1 from public.usernames where user_id = me) then
    return 'already-chosen';
  end if;

  begin
    insert into public.usernames (user_id, username) values (me, chosen);
  exception when unique_violation then
    -- Either someone else holds the name, or a double submit already gave
    -- this account its row a moment ago.
    if exists (select 1 from public.usernames where user_id = me) then
      return 'already-chosen';
    end if;
    return 'taken';
  end;

  return 'ok';
end;
$$;

revoke execute on function public.claim_username(text) from public, anon;
grant execute on function public.claim_username(text) to authenticated;
