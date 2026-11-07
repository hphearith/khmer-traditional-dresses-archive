# Contributor entries: Username rule manual checks (issue #56)

The policies live in the database and the repo holds no credentials, so they are
checked **by hand** around running `supabase/entries-username-rule.sql`. Report
the results as manually verified, not automated.

Section 4 needs two test accounts, neither holding real entries you care about:

- **Contributor:** confirmed, with a Username, not on the reviewers list.
- **Reviewer:** on the reviewers list, with a Username.

## 1. Before running the SQL: see the gap

This could only be seen before the SQL was run, and it was skipped. The policies
read from `pg_policies` beforehand are what showed the gap (issue #56).

## 2. Run the SQL (SQL Editor)

Run `supabase/entries-username-rule.sql`, leaving out the commented undo block.
Then confirm the policies:

```sql
select policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'entries' and cmd in ('INSERT', 'UPDATE');
-- expect: two rows. INSERT's with_check and both of UPDATE's rules mention usernames.
```

## 3. No Username is refused (SQL Editor)

Each query briefly removes the Username of an entry's owner, acts as that owner,
and tries the change. Nothing is kept: both end by cancelling their transaction,
which puts the Username back. Run them separately.

```sql
begin;

select set_config('test.owner', (select owner::text from public.entries limit 1), true);
delete from public.usernames where user_id = current_setting('test.owner')::uuid;

select set_config(
  'request.jwt.claims',
  json_build_object('sub', current_setting('test.owner'), 'role', 'authenticated')::text,
  true
);
set local role authenticated;

insert into public.entries (owner, title, story, photo_path)
values (
  (select auth.uid()),
  'Username rule test',
  'Test',
  (select auth.uid())::text || '/test'
);

rollback;
-- expect: 42501 new row violates row-level security policy for table "entries"
```

A refused edit raises no error, so this query ends with one that says how many
rows changed.

```sql
begin;

select set_config('test.entry', (select id::text from public.entries limit 1), true);
select set_config('test.owner', (select owner::text from public.entries where id = current_setting('test.entry')::uuid), true);
delete from public.usernames where user_id = current_setting('test.owner')::uuid;

select set_config(
  'request.jwt.claims',
  json_build_object('sub', current_setting('test.owner'), 'role', 'authenticated')::text,
  true
);
set local role authenticated;

do $$
declare
  changed integer;
begin
  update public.entries set title = title
  where id = current_setting('test.entry')::uuid;
  get diagnostics changed = row_count;
  raise exception 'The edit changed % row(s)', changed;
end $$;

rollback;
-- expect: The edit changed 0 row(s)
```

## 4. Everyone else still works (on the live site)

- As **Contributor**, add two entries.
  Expect: both save and show in My entries with a Pending pill.
- As **Contributor**, edit one of them.
  Expect: it saves and is still Pending.
- As **Reviewer**, edit one of your own Published entries.
  Expect: it saves and is still Published.
- As **Reviewer**, publish one of the Contributor's entries from the Review
  queue, and return the other.
  Expect: both work, and each entry shows its new status.
- As **Contributor**, edit the Returned entry.
  Expect: it saves and is Pending again.

## 5. Clean up

Delete the test entries from section 4 through the site.

## If a check fails

Run the undo block at the end of `supabase/entries-username-rule.sql`, and report
which step failed.

## Results (manually verified)

| Date | Sections | Result |
|---|---|---|
| 2026-11-07 | 2: the SQL ran, and `pg_policies` shows the Username rule on both policies | Pass |
| 2026-11-07 | 4, in part: a Contributor can add and edit, and a Reviewer can add, seen during the checks for #58 | Pass |
| 2026-11-07 | 3: with its owner's Username removed, adding an entry is refused with 42501, and an edit changes 0 rows | Pass |
| 2026-11-07 | 1 | Not run: it could only be seen before the SQL ran |

Still not checked: the rest of section 4. Run it if that needs proving later.
