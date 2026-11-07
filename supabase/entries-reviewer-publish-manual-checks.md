# Contributor entries: Reviewer publishing manual checks (issue #58)

The policy lives in the database and the repo holds no credentials, so it is
checked **by hand**. Report the results as manually verified, not automated.
`editStatus` and `newEntryStatus` in `lib/entry.js` are automated
(`node --test tests/`).

You need a **Reviewer** account, and a **Contributor** account that has a Username
and is not on the reviewers list. `<CONTRIBUTOR_ID>` is the Contributor's id, from
Authentication → Users. Sign in from the browser console with the publishable key;
never commit a key or password.

## 1. Before merging: the rule holds

Run `supabase/entries-reviewer-publish.sql` in the SQL Editor, then this, as the
**Contributor**, in the browser console:

```js
await sb.from('entries').insert({ owner: '<CONTRIBUTOR_ID>', title: 'Status rule test', story: 'Test', photo_path: '<CONTRIBUTOR_ID>/test', status: 'published' }).select();
// expect: 42501 new row violates row-level security policy for table "entries"
```

If the row comes back instead, stop and undo: a Contributor could skip review.
Delete that row in the SQL Editor.

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
| 2026-11-07 | The SQL in section 1 was run, as reported by the owner | Done |
| | The Contributor refusal in section 1, and section 2 | Not run yet |
