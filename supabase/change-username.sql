-- Change your Username (issue #21).
--
-- FOR THE STUDENT TO REVIEW AND RUN in the Supabase dashboard (SQL Editor),
-- after supabase/usernames.sql and supabase/claim-username.sql. The agent never
-- runs this against the live project. It creates one function and changes
-- nothing else.
--
-- Why it exists: public.usernames has no write access through the API (see
-- usernames.sql), so this function is the one narrow path for CHANGING a
-- Username. The 30-day wait lives here, in the database, so a direct call to
-- the API cannot skip it; the page only gives an early, friendly answer.
--
--   * It only ever acts for the caller (auth.uid()); there is no user id
--     argument, so nobody can change someone else's Username.
--   * It refuses until 30 days have passed since changed_at, and says when.
--     changed_at is empty until the first change, so the first choice (signup,
--     or claim_username for an older account) starts no wait.
--   * Format and case-insensitive uniqueness are the same as everywhere: the
--     name is lowercased, checked here, and the table's own constraints still
--     stand behind it.
--   * Entries do not store the Username; their Credit is read from this table
--     (lib/readEntries.js), so every entry shows the new name at once.
--
-- It returns a status instead of raising, so the interface can show a clear
-- message. The answer is a json object:
--   {"status": "ok"}
--   {"status": "taken"}      someone else holds it (any capitalisation)
--   {"status": "invalid"}    not 3 to 20 English letters, digits or underscore
--   {"status": "unchanged"}  it is already this account's Username
--   {"status": "too-soon", "allowed_at": "<timestamp>"}  the wait is not over
--   {"status": "no-username"} the account has none yet: it must use claim_username
--
-- The 30 days must match USERNAME_CHANGE_WAIT_DAYS in lib/usernameChange.js.

create or replace function public.change_username(candidate text)
returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  me uuid := auth.uid();
  chosen text := lower(candidate);
  current_row public.usernames%rowtype;
  allowed_at timestamptz;
begin
  if me is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;
  if chosen is null or chosen !~ '^[a-z0-9_]{3,20}$' then
    return jsonb_build_object('status', 'invalid');
  end if;

  -- Lock the account's own row, so two quick submits cannot both pass the wait.
  select * into current_row from public.usernames where user_id = me for update;
  if not found then
    return jsonb_build_object('status', 'no-username');
  end if;

  -- Choosing the name you already have is not a change, so it must not start
  -- the wait.
  if current_row.username = chosen then
    return jsonb_build_object('status', 'unchanged');
  end if;

  if current_row.changed_at is not null then
    allowed_at := current_row.changed_at + interval '30 days';
    if now() < allowed_at then
      return jsonb_build_object('status', 'too-soon', 'allowed_at', allowed_at);
    end if;
  end if;

  begin
    update public.usernames
      set username = chosen, changed_at = now()
      where user_id = me;
  exception when unique_violation then
    return jsonb_build_object('status', 'taken');
  end;

  return jsonb_build_object('status', 'ok');
end;
$$;

revoke execute on function public.change_username(text) from public, anon;
grant execute on function public.change_username(text) to authenticated;
