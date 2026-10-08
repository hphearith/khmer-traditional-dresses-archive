# Contributor entries: manual checks (issue #13)

These rules live in the database, and the repo holds no credentials, so they
are checked **by hand** after running `supabase/entries.sql` in the Supabase
SQL Editor. Report the results as manually verified, not automated.

You need two confirmed test accounts that each have a Username (A and B), and
their ids from Authentication → Users. Replace `<ID_A>` and `<ID_B>`.

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

# A cannot change or delete anything yet (editing and deleting are later tickets)
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?owner=eq.<ID_A>" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" -d '{"title":"changed"}'
# expect: 401/403 permission denied
```

Also run Lab 7's console attack script unchanged against the `entries` table:
expect every forged or guest write to be refused.

An account with **no** Username (make one with "Auto Confirm" and no metadata)
cannot create an entry even with its own id as owner: expect the same
row-level security refusal.

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

## 4. Account removal

Delete test account A in Authentication → Users. Expect every row with
`owner = <ID_A>` to disappear from `public.entries` (`on delete cascade`).

## Before issue #16

Entries made now have no photo. Delete them before running #16's SQL, which
makes the photo required.
