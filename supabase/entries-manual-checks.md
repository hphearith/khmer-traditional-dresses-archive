# Contributor entries: manual checks (issues #13 and #14)

These rules live in the database, and the repo holds no credentials, so they
are checked **by hand** after running `supabase/entries.sql` in the Supabase
SQL Editor, and for editing, `supabase/entries-edit.sql` after it. Report the
results as manually verified, not automated.

You need two confirmed test accounts that each have a Username (A and B), and
their ids from Authentication → Users. Replace `<ID_A>` and `<ID_B>`. Section 2
also needs `<ENTRY_ID_A>` and `<ENTRY_ID_B>`: the ids of one **throwaway test
entry** each account owns (Table Editor → entries). Changes are aimed at those
ids so a mistaken request cannot retitle real entries.

## 1. The table refuses bad data (SQL Editor)

The SQL Editor runs as an admin, so these test the table's own rules, not the
access rules.

```sql
insert into public.entries (owner, title, story) values ('<ID_A>', 'សំពត់ហូល for my sister', 'ខ្ញុំបានកុម្មង់ at a tailor.');
-- expect: success

insert into public.entries (owner, title, story) values ('<ID_A>', '   ', 'story');
-- expect: ERROR violates check constraint "entries_title_length"

insert into public.entries (owner, title, story) values ('<ID_A>', repeat('ក', 120), 'story');
-- expect: success (120 Khmer characters is 360 bytes but 120 characters)

insert into public.entries (owner, title, story) values ('<ID_A>', repeat('ក', 121), 'story');
-- expect: ERROR violates check constraint "entries_title_length"

insert into public.entries (owner, title, story) values ('<ID_A>', 'title', repeat('a', 5001));
-- expect: ERROR violates check constraint "entries_story_length"

insert into public.entries (owner, title, story, credited_as) values ('<ID_A>', 'title', 'story', '');
-- expect: ERROR violates check constraint "entries_credited_as_length"
--         (no value is stored as null, never as an empty string)

insert into public.entries (owner, title, story, materials) values ('<ID_A>', 'title', 'story', repeat('a', 201));
-- expect: ERROR violates check constraint "entries_materials_length"

insert into public.entries (owner, title, story, year) values ('<ID_A>', 'title', 'story', 1899);
-- expect: ERROR violates check constraint "entries_year_earliest"

insert into public.entries (owner, title, story, year) values ('<ID_A>', 'title', 'story', extract(year from now())::int + 2);
-- expect: ERROR year ... is in the future

select title, octet_length(title), char_length(title) from public.entries where owner = '<ID_A>';
-- expect: the Khmer title exactly as typed above
```

Clean up afterwards: `delete from public.entries where owner = '<ID_A>';`

## 2. Access rules (from a terminal)

Use the project URL and the **publishable** key from your own `.env.local`
(never paste them into a committed file). For a signed-in request, copy that
account's access token from the browser (DevTools → Application → Cookies, or
log `session.access_token` once in the console) into `$TOKEN_A`. Never commit it.

```bash
# Guest can read
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?select=id,title,owner" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
# expect: 200 and the entries

# Guest cannot create
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Content-Type: application/json" \
  -d '{"owner":"<ID_A>","title":"guest try","story":"x"}'
# expect: 401 permission denied

# A creates as A
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" -d '{"owner":"<ID_A>","title":"as myself","story":"x"}'
# expect: 201

# A cannot create as B
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" -d '{"owner":"<ID_B>","title":"forged","story":"x"}'
# expect: 403 new row violates row-level security policy

# A cannot set the id or the timestamps
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"owner":"<ID_A>","title":"t","story":"x","created_at":"2000-01-01T00:00:00Z"}'
# expect: 401/403 permission denied for table entries

# A can change one of A's own entries (Prefer asks for the changed row back).
# Use a throwaway test entry: <ENTRY_ID_A> is its id (look it up in Table Editor
# → entries; the "as myself" entry created above works). Never filter on owner
# here, that retitles every entry A has.
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?id=eq.<ENTRY_ID_A>" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Prefer: return=representation" -H "Content-Type: application/json" -d '{"title":"changed"}'
# expect: 200 with that one entry, titled "changed", and a newer updated_at

# A cannot change B's entry: no row matches, so nothing changes.
# <ENTRY_ID_B> is one of B's test entries.
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?id=eq.<ENTRY_ID_B>" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Prefer: return=representation" -H "Content-Type: application/json" -d '{"title":"changed"}'
# expect: 200 with [] (a refused change is not an error); B's entry is unchanged

# A cannot hand an entry to B (the refusal comes before any row is touched,
# but filter on the one test entry anyway)
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?id=eq.<ENTRY_ID_A>" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" -d '{"owner":"<ID_B>"}'
# expect: 401/403 permission denied (owner is not a column a Contributor may update)

# A guest cannot change anything
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?id=eq.<ENTRY_ID_A>" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Content-Type: application/json" \
  -d '{"title":"guest change"}'
# expect: 401/403 permission denied
```

Also run Lab 7's console attack script unchanged against the `entries` table:
expect every forged or guest write to be refused.

An account with **no** Username (make one with "Auto Confirm" and no metadata)
cannot create an entry even with its own id as owner: expect the same
row-level security refusal. It cannot change an entry either: after giving the
account an entry in the SQL Editor (`owner` set to its id), a PATCH on that
entry with its token answers 200 with `[]` and the title is unchanged.

## 3. End to end through the app

1. As a guest, open `/contribute`: you are sent to `/login`.
2. Log in as an account with no Username and open `/contribute`: you are sent to `/choose-username`.
3. Log in as A and open `/contribute`. Press "Save entry" on the empty form:
   a message appears under Title and under Story, focus moves to Title, and
   nothing is sent (DevTools → Network shows no request to `/rest/v1/entries`).
4. Type past the limit in Title: typing stops at 120 and the counter reads
   "120 of 120 characters · Limit reached." Paste 5,000 characters into Title:
   nothing is pasted (the whole paste is refused, never cut). Repeat with
   Khmer text in Title and Story. The Year field is a list, not a box: it
   offers the current year down to 1900 and "Not sure", so a bad year can only
   be sent by a direct call (section 2).
5. Save with only a title and a story: you land on `/?tab=community` and the
   entry is first, credited `Shared by @<A's Username>`.
6. Save another with every field filled, in Khmer and English mixed, with
   credited-as `គ្រួសារសុខា`: it is first, credited `Shared by គ្រួសារសុខា`, with
   every Provenance line shown and the Khmer exactly as typed.
7. Save one with credited-as of only spaces: credited with the @Username.
8. Save one titled `<script>alert(1)</script>`: the title is shown as text and
   no pop-up appears.
9. While saving, the button reads "Saving…" and cannot be pressed again.
10. Failure messages. In each case the button comes back, your text is still
    in the form, the console shows the real error, and the page never shows it:
    - DevTools → Network → Offline, then save: at once, "You appear to be
      offline. Your text is still here: reconnect, then save again."
    - Throttle to a connection that stalls (a custom profile with a very low
      speed works), then save: after about 15 seconds, "That is taking too
      long. Your text is still here: check your connection, then save again."
    - Stay logged in on the page for over an hour with the tab in the
      background, go Offline, then save: the same "offline" message at once,
      not a disabled button with nothing shown (a stale session used to make
      the save wait about 25 seconds).
    - With the network on, a refusal from the database (for example an account
      with no Username): "This account cannot save entries right now…".
    A request cut off at 15 seconds may still have reached the database, so
    check the Community tab before saving the same text again.
11. In a private window with no cookies, open `/?tab=community`: every entry
    shows, newest first, and DevTools → Application → Cookies is empty.
12. Open the Community tab at phone width (375px) with a long Khmer story:
    no sideways scrolling, and Khmer marks are not clipped or split.
13. With no rows in `public.entries`, the Community tab shows "No entries yet".
14. Editing (issue #14). As A, choose "Edit" on one of A's entries: the form
    opens with the saved text, the Year list shows the saved year, and each
    counter shows the saved length. Change the title and choose "Save changes":
    you land on `/?tab=community`, the entry keeps its place in the list, and
    the Khmer story is unchanged.
15. "My entries" appears on the Community tab only while logged in, and shows
    only A's entries. "Edit" appears on A's entries and on no one else's. A
    guest sees neither "My entries" nor any "Edit".
16. As a guest, open `/contribute/<any entry id>/edit`: you are sent to `/login`.
17. As B, open `/contribute/<an entry id of A's>/edit` by typing the address:
    the page says "You can only change entries you wrote" and shows no form.
18. A change the database refuses. As A, open an entry's edit page, delete that
    entry in the SQL Editor (test data only), then choose "Save changes": "That
    change wasn't saved" appears, the text stays in the form, you are not sent
    to the Community tab, and the console shows the real error. In a tab where
    you have logged out, the same save says "You are no longer logged in".

## 4. Account removal

Delete test account A in Authentication → Users. Expect every row with
`owner = <ID_A>` to disappear from `public.entries` (`on delete cascade`).

## Results (manually verified)

These were checked by hand by the student, not by an automated test.

| Date | Issue | Check | Result |
| --- | --- | --- | --- |
| 2026-10-09 | #14 | Section 2: A can change one of A's own entries; A cannot change B's entry; A cannot hand an entry to B; a guest cannot change anything; an account with no Username cannot change an entry | Pass |
| 2026-10-09 | #14 | Section 3, steps 14-18: edit opens with the saved values and keeps its place in the list; "My entries" and "Edit" appear only for the signed-in owner; a guest is sent to `/login`; B sees "You can only change entries you wrote"; a refused save says "That change wasn't saved" | Pass |

## Before issue #16

Entries made now have no photo. Delete them before running #16's SQL, which
makes the photo required.
