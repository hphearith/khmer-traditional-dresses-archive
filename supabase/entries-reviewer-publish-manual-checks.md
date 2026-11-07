# Contributor entries: Reviewer publishing manual checks (issue #58)

The policy lives in the database and the repo holds no credentials, so it is
checked **by hand**. Report the results as manually verified, not automated.
`editStatus` and `newEntryStatus` in `lib/entry.js` are automated
(`node --test tests/`).

You need a **Reviewer** account, and a **Contributor** account that has a Username
and is not on the reviewers list.

## 1. Before merging: the rule holds

Run `supabase/entries-reviewer-publish.sql` in the SQL Editor, then this, also in
the SQL Editor. It acts as a Contributor, and needs no key, password or account id.
The last line cancels everything, so no test entry is left behind.

```sql
begin;

select set_config(
  'request.jwt.claims',
  json_build_object(
    'sub', (select user_id from public.usernames
            where user_id not in (select user_id from public.reviewers)
            limit 1),
    'role', 'authenticated'
  )::text,
  true
);
set local role authenticated;

insert into public.entries (owner, title, story, photo_path, status)
values (
  (select auth.uid()),
  'Status rule test',
  'Test',
  (select auth.uid())::text || '/test',
  'published'
);

rollback;
-- expect: 42501 new row violates row-level security policy for table "entries"
```

If it answers "Success. No rows returned" instead, stop and undo: a Contributor
could skip review.

## 2. After the app change is deployed (on the live site)

- As the **Reviewer**, add an entry.
  Expect: you land on My entries, the entry has a Published pill, it shows on the
  Community tab while logged out, and it is not in the Review queue.
- As the **Contributor**, add an entry.
  Expect: the "submitted for review" notice, a Pending pill in My entries, and the
  entry is in the Review queue.
- As the **Contributor**, edit a Published entry.
  Expect: it goes back to Pending.

Delete the test entries through the site.

## If a check fails

Run the undo block at the end of `supabase/entries-reviewer-publish.sql`, revert
the app change, and report which step failed.

## Results (manually verified)

| Date | Sections | Result |
|---|---|---|
| 2026-11-07 | 1: the SQL ran, and a Contributor adding an entry as `published` was refused with 42501 | Pass |
| | 2 | Not run yet: needs the app change deployed |
