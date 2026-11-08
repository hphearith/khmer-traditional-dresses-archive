# Contributor entries: Return note manual checks (issue #66)

The column and `review_entry` live in the database and the repo holds no
credentials, so they are checked **by hand** around running
`supabase/entries-return-note.sql`. Report the results as manually verified, not
automated. Nothing in `node --test tests/` covers this file.

Everything runs in the SQL Editor. Section 3 needs two accounts that already
exist, and finds them itself, so no id, key or password is written anywhere:

- a **Reviewer**: on the reviewers list;
- a **Contributor**: has a Username and is not on the reviewers list.

**After running the SQL, do not press Return on the live site until issue #67
(the screens) is deployed.** The deployed code still calls `review_entry` with
two arguments: Publish keeps working, Return is refused.

## 1. Before running the SQL: count the Returned entries, save the old function

These entries will have no Return note. Write the number in the results table.

```sql
select count(*) as returned_entries
from public.entries
where status = 'returned';
```

The undo block puts `review_entry` back as `review-gate.sql` wrote it, but that
text was never compared with the live function. Copy what this returns and keep
it outside the repository until #67 is merged: if you ever undo, restore this
text instead.

```sql
select pg_get_functiondef('public.review_entry(uuid, text)'::regprocedure);
```

## 2. Run the SQL, then check what it created

Run `supabase/entries-return-note.sql`, leaving out the commented undo block.
Then run these one at a time.

```sql
select grantee, privilege_type
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'entries'
  and column_name = 'return_note' and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;
-- expect: two rows, anon SELECT and authenticated SELECT. No INSERT, no UPDATE.
```

```sql
select
  to_regprocedure('public.review_entry(uuid, text)') is null as old_function_gone,
  has_function_privilege('anon', 'public.review_entry(uuid, text, text)', 'execute') as guest_can_call,
  has_function_privilege('authenticated', 'public.review_entry(uuid, text, text)', 'execute') as signed_in_can_call;
-- expect: true, false, true
```

## 3. The rules hold (one script)

Paste the whole block and run it once. It adds two test entries as the
Contributor, acts as the Reviewer and as a guest, and **always ends in an
error**: the last step raises the report as an error message on purpose,
because an error cancels the whole transaction. Nothing is kept.

Expect an error that reads `Return note checks:` followed by one line per check,
every one ending in `PASS`. Any other error means a step failed before the
report: read its message and stop. `42725 function public.review_entry(...) is
not unique` means the two-argument function is still there (check 9). The
numbers on each line are the checks listed in issue #66's brief.

```sql
begin;

-- Who plays each part. Read as the dashboard's own role, because nobody can
-- read the reviewers list through the API.
select
  set_config('test.reviewer',
    coalesce((select user_id::text from public.reviewers limit 1), ''), true),
  set_config('test.contributor',
    coalesce((select user_id::text from public.usernames
              where user_id not in (select user_id from public.reviewers)
              limit 1), ''), true);

set local role authenticated;

do $$
declare
  as_reviewer text := json_build_object('sub', current_setting('test.reviewer'), 'role', 'authenticated')::text;
  as_contributor text := json_build_object('sub', current_setting('test.contributor'), 'role', 'authenticated')::text;
  khmer text := E'សូមបន្ថែមឈ្មោះជាងកាត់ដេរ\nនិងឆ្នាំដែលបានកាត់ដេរ';
  entry uuid;
  returned_entry uuid;
  answer boolean;
  row_status text;
  row_note text;
  ok boolean;
  report text := 'Return note checks:';
begin
  if current_setting('test.reviewer') = '' or current_setting('test.contributor') = '' then
    raise exception 'Needs a Reviewer, and a Contributor with a Username who is not a Reviewer';
  end if;

  -- The Contributor adds an entry. It starts Pending.
  perform set_config('request.jwt.claims', as_contributor, true);
  insert into public.entries (owner, title, story, photo_path)
  values ((select auth.uid()), 'Return note test', 'Test', (select auth.uid())::text || '/test')
  returning id into entry;

  -- 7b. A Contributor cannot return an entry.
  answer := public.review_entry(entry, 'returned', 'Please add the tailor');
  report := report || E'\n7b. a Contributor''s Return is refused: ' || case when answer = false then 'PASS' else 'FAIL' end;

  -- 3. A Return with no note, an empty note, a blank note or 501 characters is refused.
  perform set_config('request.jwt.claims', as_reviewer, true);
  ok := public.review_entry(entry, 'returned') = false
    and public.review_entry(entry, 'returned', null) = false
    and public.review_entry(entry, 'returned', '') = false
    and public.review_entry(entry, 'returned', E'  \n\t ') = false
    and public.review_entry(entry, 'returned', repeat('ក', 501)) = false;
  select status, return_note into row_status, row_note from public.entries where id = entry;
  ok := ok and row_status = 'pending' and row_note is null;
  report := report || E'\n3. missing, empty, blank and 501-character notes are refused and change nothing: ' || case when ok then 'PASS' else 'FAIL' end;

  -- 4a. Exactly 500 characters is accepted.
  answer := public.review_entry(entry, 'returned', repeat('ក', 500));
  select status, return_note into row_status, row_note from public.entries where id = entry;
  ok := answer = true and row_status = 'returned' and row_note = repeat('ក', 500);
  report := report || E'\n4a. a 500-character note is accepted: ' || case when ok then 'PASS' else 'FAIL' end;

  -- 8. Editing the Returned entry makes it Pending and keeps the note.
  perform set_config('request.jwt.claims', as_contributor, true);
  update public.entries set status = 'pending' where id = entry;
  select status, return_note into row_status, row_note from public.entries where id = entry;
  ok := row_status = 'pending' and row_note = repeat('ក', 500);
  report := report || E'\n8. an edit back to Pending keeps the note: ' || case when ok then 'PASS' else 'FAIL' end;

  -- 7a. The Contributor cannot write or erase the note. The entry is Pending
  -- here, so the edit policy would allow the row: only the missing column grant
  -- can refuse it, with "permission denied". (A policy refusal is also 42501,
  -- but says "violates row-level security", and would not prove the grant.)
  begin
    update public.entries set return_note = null where id = entry;
    ok := false;
  exception when insufficient_privilege then
    ok := sqlerrm like 'permission denied%';
  end;
  report := report || E'\n7a. a Contributor cannot change return_note (permission denied): ' || case when ok then 'PASS' else 'FAIL' end;

  -- 2, 4b, 6. A second Return replaces the note, trimmed at its ends only, Khmer exactly as sent.
  perform set_config('request.jwt.claims', as_reviewer, true);
  answer := public.review_entry(entry, 'returned', E'  ' || khmer || E' \n');
  select status, return_note into row_status, row_note from public.entries where id = entry;
  ok := answer = true and row_status = 'returned'
    and convert_to(row_note, 'UTF8') = convert_to(khmer, 'UTF8');
  report := report || E'\n2, 4b, 6. a later Return replaces the note, trimmed, Khmer byte for byte: ' || case when ok then 'PASS' else 'FAIL' end;

  -- Back to Pending, as the Contributor would after editing.
  perform set_config('request.jwt.claims', as_contributor, true);
  update public.entries set status = 'pending' where id = entry;

  -- 5a. A Publish that sends a note is refused.
  perform set_config('request.jwt.claims', as_reviewer, true);
  answer := public.review_entry(entry, 'published', 'Lovely');
  select status, return_note into row_status, row_note from public.entries where id = entry;
  ok := answer = false and row_status = 'pending' and row_note = khmer;
  report := report || E'\n5a. a Publish with a note is refused: ' || case when ok then 'PASS' else 'FAIL' end;

  -- 5b. A Publish without a note clears the note.
  answer := public.review_entry(entry, 'published');
  select status, return_note into row_status, row_note from public.entries where id = entry;
  ok := answer = true and row_status = 'published' and row_note is null;
  report := report || E'\n5b. a Publish clears the note: ' || case when ok then 'PASS' else 'FAIL' end;

  -- A Published entry cannot be given a note.
  answer := public.review_entry(entry, 'returned', 'Too late');
  select status, return_note into row_status, row_note from public.entries where id = entry;
  ok := answer = false and row_status = 'published' and row_note is null;
  report := report || E'\n5c. a Return on a Published entry is refused: ' || case when ok then 'PASS' else 'FAIL' end;

  -- 9. The two-argument function is gone.
  ok := to_regprocedure('public.review_entry(uuid, text)') is null;
  report := report || E'\n9. review_entry(uuid, text) no longer exists: ' || case when ok then 'PASS' else 'FAIL' end;

  -- A second entry, left Returned with a note, for the guest check below.
  perform set_config('request.jwt.claims', as_contributor, true);
  insert into public.entries (owner, title, story, photo_path)
  values ((select auth.uid()), 'Return note test 2', 'Test', (select auth.uid())::text || '/test')
  returning id into returned_entry;
  perform set_config('request.jwt.claims', as_reviewer, true);
  perform public.review_entry(returned_entry, 'returned', khmer);

  perform set_config('test.report', report, true);
  perform set_config('test.published', entry::text, true);
  perform set_config('test.returned', returned_entry::text, true);
end $$;

-- 10. As a guest: no Return note anywhere.
reset role;
select set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
set local role anon;

do $$
declare
  report text := current_setting('test.report');
  seen integer;
  ok boolean;
begin
  select count(*) into seen from public.entries where return_note is not null;
  ok := seen = 0;
  select count(*) into seen from public.entries where id = current_setting('test.returned')::uuid;
  ok := ok and seen = 0;
  select count(*) into seen from public.entries
    where id = current_setting('test.published')::uuid and return_note is null;
  ok := ok and seen = 1;
  report := report || E'\n10. a guest sees the Published entry with no note, and not the Returned one: ' || case when ok then 'PASS' else 'FAIL' end;

  raise exception '%', report;
end $$;

rollback;
```

## 4. On the live site, after #67 is deployed

The screens are #67's to check: its pull request carries the walk-through
(Return with a note, see it as the Contributor, edit, Publish, see it gone).
Until then, do not press Return on the live site.

## If a check fails

Run the undo block at the end of `supabase/entries-return-note.sql`, and report
which check failed.

## Results (manually verified)

| Date | Sections | Result |
|---|---|---|
| | 1: Returned entries before the SQL ran | Not yet run |
| | 2: the SQL ran; grants and function as expected | Not yet run |
| | 3: every check PASS | Not yet run |
