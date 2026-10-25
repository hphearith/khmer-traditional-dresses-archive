# Contributor entries: status grant manual checks (issue #33)

The grant lives in the database and the repo holds no credentials, so it is
checked **by hand** after running `supabase/entries-status.sql`. Report the
results as manually verified, not automated. `editStatus` in `lib/entry.js` is
automated (`node --test tests/`).

You need a non-reviewer Contributor account and a reviewer account, and one
pending entry owned by the Contributor (`<PENDING_ID>`). Sign in from the
browser console with the publishable key; never commit a key or password.

## 1. The grant (SQL Editor)

```sql
select column_name, privilege_type
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'entries'
  and grantee = 'authenticated' and column_name = 'status';
-- expect: two rows, SELECT and UPDATE
```

## 2. Editing on the live site

- As the Contributor, edit an entry and save.
  Expect: it saves, and `/my-entries` shows it as pending.
- As the reviewer, edit an entry and save.
  Expect: it saves, and its status is unchanged.

## 3. The policy still holds (browser console, as the Contributor)

```js
await sb.from('entries').update({ status: 'published' }).eq('id', '<PENDING_ID>').select();
// expect: 42501 new row violates row-level security policy for table "entries"
// (before the grant it said "permission denied for table entries")

await sb.rpc('review_entry', { entry_id: '<PENDING_ID>', decision: 'published' });
// expect: data: false
```

Verified 2026-10-25: all of the above, except that `review_entry` was last
run before the grant (it does not depend on it).
