# Changing a Username: manual checks (issue #21)

The wait rule lives in the database, and the repo holds no credentials, so it
is checked **by hand** after running `supabase/change-username.sql` in the
Supabase SQL Editor. Report the results as manually verified, not automated.
The pure parts (the 30-day arithmetic, reading the answer, the messages) are
covered by `tests/username-change.test.mjs`.

You need two test accounts that each have a Username, for example `test_a`
(account A) and `test_b` (account B). Note both ids from Authentication → Users.

## 1. The first choice starts no wait

1. Give a test account its Username by signing up (usernames.sql) or through `/choose-username` (claim-username.sql).
2. In Table Editor, `public.usernames` shows `changed_at` **empty** for it.
3. Log in as it and open `/change-username` (or "Change Username" in the header of `/`). Expect the form, not a waiting message.

## 2. A change succeeds and starts the wait

1. As account A, type `Fresh_Name1` and press "Change Username". Expect a box, not a save yet: "Are you sure you want to change your Username to @fresh_name1?" and "You cannot change it again for 30 days, until about <date 30 days from today>." The Username box is locked. "Go back" returns to the form with what you typed, and `public.usernames` is unchanged.
2. Press "Change Username" again, then "Yes, change it". Expect to land on `/?tab=community`.
3. `public.usernames` now has `fresh_name1` for A and `changed_at` set to about now.
4. Every Community entry A wrote **without** "credited as" now says "Shared by @fresh_name1". An entry with "credited as" text still shows that text.
5. Open `/change-username` again. Expect no form, and: "You changed your Username recently. You can change it again from <date> at <time> UTC." The date is 30 days after `changed_at`.

## 3. Refused inside the wait, even by a direct call

Use the project URL and **publishable** key from your own `.env.local`, and
account A's access token (never paste any of them into a committed file).

```bash
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/change_username" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer <A_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" -d '{"candidate":"another_one"}'
# expect: {"status":"too-soon","allowed_at":"<30 days after changed_at>"}
# and public.usernames is unchanged
```

Also try writing the table directly: expect a refusal, because the API has no write access to it.

```bash
curl -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/usernames?user_id=eq.<ID_A>" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer <A_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" -d '{"changed_at":null}'
# expect: 401/403 permission denied (nobody can reset their own wait)
```

A guest call (no `Authorization` header) to `rpc/change_username`: expect 401/403.

## 4. After 30 days

In the SQL Editor, pretend the wait is over for account A only:

```sql
update public.usernames set changed_at = now() - interval '30 days' where user_id = '<ID_A>';
```

Then, as A, change the Username again. Expect success, `changed_at` reset to
about now, and the entries showing the newest name. One second *less* than 30
days (`interval '30 days' - interval '1 second'`) should still be refused.

## 5. Rules for the new Username

As an account whose wait is over (step 4), submit each and expect no change
to `public.usernames`:

- `ab`, `so kha`, `សុខា`, `@name`: refused in the form with the matching message.
- `Test_B`, `TEST_B`, `test_b` (account B's name, any capitalisation): "That Username is already taken".
- Your own current name: "That is already your Username." and `changed_at` is **not** touched (not a change, so it starts no wait).

Via `curl` with a malformed name (for example `{"candidate":"Bad Name!"}`):
expect `{"status":"invalid"}`.

## 6. Accounts without a Username, and guests

1. An account with no row in `public.usernames`: `/change-username` sends it to `/choose-username`. A direct `rpc/change_username` call answers `{"status":"no-username"}`.
2. A guest opening `/change-username` goes to `/login`. The home page for a guest still sets no Supabase cookies.
