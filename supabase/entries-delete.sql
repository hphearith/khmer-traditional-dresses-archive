-- Contributor entries: delete your own entry (issue #15).
--
-- FOR THE STUDENT TO REVIEW AND RUN in the Supabase dashboard (SQL Editor),
-- after supabase/entries.sql and supabase/entries-edit.sql. The agent never
-- runs this against the live project. It adds one delete policy and one
-- table grant, and changes nothing else. Run it once: running it again fails,
-- because the policy already exists.
--
-- How it fits together:
--   1. Only the owner of an entry can delete it, and only while the owner has
--      a Username, the same rule as an insert and an update. For any other
--      account, and for a guest, the row is not matched, so nothing is deleted.
--   2. A refused delete is not an error. The API answers with no rows, which
--      is why the app asks for the deleted row back (.select()) and says
--      "That change wasn't saved" when none comes back.
--   3. Deletion is permanent: there is no soft-delete column. Photos arrive in
--      issue #16, and deleting a photo's file along with its entry is #17's job.

-- ---------------------------------------------------------------------------
-- Who may delete a row: its owner, and only its owner, and only an account
-- that has chosen a Username (the insert and update policies ask the same).
-- ---------------------------------------------------------------------------
create policy "Owners delete their own entries"
  on public.entries for delete
  to authenticated
  using (
    owner = (select auth.uid())
    and exists (select 1 from public.usernames where user_id = (select auth.uid()))
  );

-- ---------------------------------------------------------------------------
-- entries.sql revoked everything from anon and authenticated, so delete has to
-- be granted before the policy can matter. anon gets nothing: a guest cannot
-- delete.
-- ---------------------------------------------------------------------------
grant delete on public.entries to authenticated;
