# Contributor entries: entry page manual checks (issue #124)

Who may open `/entries/<id>` is decided by row-level security in the database,
and the repo holds no credentials, so these cases are checked **by hand** on
the running site. Report the results as manually verified, not automated.
`entryHref` and `isEntryId` in `lib/entryPages.js` are automated
(`node --test tests/`).

You need a non-reviewer Contributor account, a reviewer account, one Published
entry (`<PUBLISHED_ID>`) and one Pending entry owned by the Contributor
(`<PENDING_ID>`). Find the ids in the SQL Editor:

```sql
select id, title, status from public.entries order by created_at desc;
```

## 1. A guest (signed out, or a private window)

- Open `/entries/<PUBLISHED_ID>`.
  Expect: the photo, Credit, title, Provenance, story and "Submitted …" date,
  with no Status pill. The tab title is the entry's title.
- Open `/entries/<PENDING_ID>`.
  Expect: the 404 page. The database returns no row to a guest.
- Open `/entries/not-an-id`.
  Expect: the 404 page, without a database error in the server log.

## 2. The Contributor who owns `<PENDING_ID>`

- Open `/entries/<PENDING_ID>`.
  Expect: the page, with a Pending pill under the title. No Return note, and
  no Edit or Delete (those stay in My entries).
- In My entries, select the entry's title or "Read story".
  Expect: the same page opens.

## 3. The reviewer

- Open `/entries/<PENDING_ID>`.
  Expect: the page, with a Pending pill.

## 4. Navigation

- From the Community, select a card's "Read story", then "← Community".
  Expect: back on `/?tab=community`, with the Community tab selected.
