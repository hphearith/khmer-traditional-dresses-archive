# Contributor entries: Username rule manual checks (issue #56)

The policies live in the database and the repo holds no credentials, so they are
checked **by hand** around running `supabase/entries-username-rule.sql`. Report
the results as manually verified, not automated.

You need three test accounts, none of them holding real entries you care about:

- **No Username:** confirmed, with no Username (make one with "Auto Confirm" and
  no metadata). `<NO_NAME_ID>` is its id, from Authentication → Users.
- **Contributor:** confirmed, with a Username, not on the reviewers list.
- **Reviewer:** on the reviewers list, with a Username.

Sign in from the browser console with the publishable key; never commit a key or
password.

## 1. Before running the SQL: see the gap

As **No Username**, in the browser console:

```js
await sb.from('entries').insert({ owner: '<NO_NAME_ID>', title: 'Username rule test', story: 'Before' }).select();
// expect: the row comes back. This is the gap #56 closes.
```

If it is refused instead, stop: the live rules are not what #56 describes.

Keep that row's id as `<NO_NAME_ENTRY_ID>` for section 3.

## 2. Run the SQL (SQL Editor)

Run `supabase/entries-username-rule.sql`, leaving out the commented undo block.
Then confirm the policies:

```sql
select policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'entries' and cmd in ('INSERT', 'UPDATE');
-- expect: two rows. INSERT's with_check and both of UPDATE's rules mention usernames.
```

## 3. No Username is refused (browser console)

```js
await sb.from('entries').insert({ owner: '<NO_NAME_ID>', title: 'Username rule test', story: 'After' }).select();
// expect: 42501 new row violates row-level security policy for table "entries"

await sb.from('entries').update({ title: 'Changed' }).eq('id', '<NO_NAME_ENTRY_ID>').select();
// expect: data is [] with no error, and the title in the Table Editor is unchanged
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

## 5. Clean up (SQL Editor)

The No Username account cannot delete its own entry, so remove the test row here:

```sql
delete from public.entries where id = '<NO_NAME_ENTRY_ID>';
```

Delete the other test entries the same way, or through the site. Then delete the
No Username account in Authentication → Users, so the database goes back to
having no account without a Username.

## If a check fails

Run the undo block at the end of `supabase/entries-username-rule.sql`, and report
which step failed.

## Results (manually verified)

| Date | Sections | Result |
|---|---|---|
| 2026-11-07 | 2: the SQL ran, and `pg_policies` shows the Username rule on both policies | Pass |
| 2026-11-07 | 1, 3, 4 and 5 | Not run: the owner chose to skip them |

The rules are confirmed as live, but how they behave has not been checked: not
that an account with no Username is refused, and not that a Contributor or
Reviewer can still save. Run sections 3 and 4 if that needs proving later.
