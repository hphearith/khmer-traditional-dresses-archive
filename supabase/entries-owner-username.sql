-- Contributor entries: each entry's Credit comes in the same request (issue #80).
--
-- FOR THE STUDENT TO REVIEW AND RUN in the Supabase dashboard (SQL Editor),
-- BEFORE the code from issue #80 is merged and deployed. The agent never runs
-- this against the live project. It adds one foreign key and changes nothing
-- else: no rows, policies or functions. Follow
-- supabase/entries-owner-username-manual-checks.md around running it.
--
-- How it fits together:
--   1. Every list of entries shows each entry's Credit, worked out from its
--      owner's current Username (resolveCredit in lib/entry.js). The code read
--      the entries, waited, then read usernames for their owners: two round
--      trips per list, one after the other.
--   2. entries.owner and usernames.user_id both pointed only at auth.users, so
--      the API saw no link between the two tables. This foreign key is that
--      link. With it, the code asks for usernames(username) in the entries
--      request itself and gets each Username back inside its entry row.
--   3. Every owner already needs a Username to add, edit or delete an entry
--      (entries-username-rule.sql), and a Username is only ever changed in
--      place (change-username.sql), never removed while its account exists.
--      So the key forbids nothing the archive allows. The check below still
--      stops the run if any entry's owner has no Username.
--   4. on delete cascade, like the two keys entries and usernames already have
--      to auth.users: removing an account removes its Username and its entries
--      together, exactly as before. Only the service role can delete a
--      Username row on its own, and that now removes that account's entries.
--   5. The key uses the existing index on entries.owner (entries.sql).
--   6. usernames is readable by everyone, guests included (usernames.sql), and
--      the embedded read still goes through that table's row-level security.
--      So the Credit shows nothing it did not show before.
--
-- To undo: the block at the end of this file removes the key. Undo only after
-- the code that reads usernames(username) has been reverted, or every list of
-- entries will fail to load.

begin;

-- Stop with a clear message, rather than the constraint's own error, if any
-- entry belongs to an account with no Username.
do $$
begin
  if exists (
    select 1 from public.entries e
    where not exists (select 1 from public.usernames u where u.user_id = e.owner)
  ) then
    raise exception 'Some entries belong to an account with no Username. Nothing was changed. See section 1 of supabase/entries-owner-username-manual-checks.md.';
  end if;
end;
$$;

alter table public.entries
  add constraint entries_owner_username_fkey
  foreign key (owner) references public.usernames (user_id)
  on delete cascade;

-- Tell the API to read the new link now, not on its next schema refresh.
notify pgrst, 'reload schema';

commit;

-- ---------------------------------------------------------------------------
-- Undo, only after the code from issue #80 has been reverted. Remove the
-- comment marks and run these lines on their own.
--
-- begin;
-- alter table public.entries drop constraint if exists entries_owner_username_fkey;
-- notify pgrst, 'reload schema';
-- commit;
-- ---------------------------------------------------------------------------
