# Contributor entries: Credit in the same request, manual checks (issue #80)

The foreign key lives in the database and the repository holds no credentials,
so it is checked **by hand** around running `supabase/entries-owner-username.sql`.
Report the results as manually verified, not automated. `node --test tests/`
checks only that the code asks for `usernames(username)` and reads the Credit
from it, against a stand-in client.

Sections 1 to 3 run in the SQL Editor, and section 4 in the browser. No id, key
or password is written anywhere.

**Order matters.** Run the SQL before the code from #80 is merged. Until the
key exists the API cannot embed `usernames(username)`, so every list of entries
on the new code (the Community, My entries and the Review queue) fails to load.
The code that is live now does not use the key, so running the SQL first
changes nothing on the site.

## 1. Before running the SQL: every entry's owner has a Username

This must return **no rows**. If it returns any, stop: do not run the SQL, and
report the count. Each row is an entry whose owner would be refused by the key.

```sql
select e.id, e.status, e.created_at
from public.entries e
where not exists (select 1 from public.usernames u where u.user_id = e.owner);
```

This must also return **no rows**, so the key does not exist yet:

```sql
select conname from pg_constraint
where conrelid = 'public.entries'::regclass and conname = 'entries_owner_username_fkey';
```

## 2. Run the SQL, then check what it created

Run `supabase/entries-owner-username.sql`, leaving out the commented undo block.
It should finish with `Success. No rows returned`. If it stops with "Some
entries belong to an account with no Username", nothing was changed: go back to
section 1.

Then this must return **one row**: `entries(owner)` → `usernames(user_id)`,
`on_delete` = `c` (cascade).

```sql
select conname,
       pg_get_constraintdef(oid) as definition,
       confdeltype as on_delete
from pg_constraint
where conrelid = 'public.entries'::regclass and conname = 'entries_owner_username_fkey';
```

## 3. Nothing else changed

Both counts must be the same as just before you ran the SQL. Run this once
before section 2 and once after, and compare.

```sql
select (select count(*) from public.entries) as entries,
       (select count(*) from public.usernames) as usernames;
```

## 4. On the pull request's Vercel preview, or `npm run dev` on its branch

Both use the same Supabase project as the live site, so run this after
section 2.

1. **As a guest**, open the Community tab. Every entry shows its Credit:
   `@username`, or the "credited as" text when the entry has one.
2. **Signed in as a Contributor**, open My entries. Each entry shows the same
   Credit as on the Community tab. Change your Username only if its 30-day
   wait allows it, and see the new one on every entry that has no "credited
   as" text.
3. **Signed in as a Reviewer**, open the Review queue. Each Pending entry
   shows its Credit.
4. None of the three pages shows "Entries could not be loaded"
   (មិនអាចផ្ទុកកំណត់ត្រាបានទេ), and the
   server log has no "Could not find a relationship between 'entries' and
   'usernames'" error.

## If a check fails

If section 4 fails while section 2 passed, do not merge the pull request.
Leaving the key in place is harmless, because the live code does not use it.
To remove it anyway, run the undo block at the end of
`supabase/entries-owner-username.sql`. Then report which check failed.

## Results (manually verified)

| Date | Sections | Result |
|---|---|---|
| | 1: entries whose owner has no Username | |
| | 2: the key, with `on_delete` = `c` | |
| | 3: entry and Username counts before and after | |
| | 4: Community, My entries and Review queue Credits | |
