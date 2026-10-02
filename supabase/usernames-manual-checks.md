# Usernames: manual checks (issue #11)

These rules live in the database, and the repo holds no credentials, so they
are checked **by hand** in the Supabase dashboard after running
`supabase/usernames.sql`. Report the results as manually verified, not as
automated.

## 1. Table rules (SQL Editor)

Run each statement. Use two real test accounts' ids from Authentication → Users.
Replace `<ID_A>` and `<ID_B>`.

```sql
insert into public.usernames (user_id, username) values ('<ID_A>', 'Sokha_88');
-- expect: success

insert into public.usernames (user_id, username) values ('<ID_B>', 'SOKHA_88');
-- expect: ERROR duplicate key value violates unique constraint
--         "usernames_username_lower_key"  (duplicate in another capitalisation)

insert into public.usernames (user_id, username) values ('<ID_B>', 'ab');
-- expect: ERROR violates check constraint "usernames_username_format"

insert into public.usernames (user_id, username) values ('<ID_B>', 'សុខា_88');
-- expect: ERROR violates check constraint "usernames_username_format"

select public.username_available('sOkHa_88');   -- expect: false
select public.username_available('free_name');  -- expect: true
```

Clean up afterwards: `delete from public.usernames where user_id in ('<ID_A>', '<ID_B>');`

## 2. Public read, no public write (as a guest, from a terminal)

Use the project URL and the **publishable** key from your own `.env.local`
(never paste them into a committed file).

```bash
curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/usernames?select=*" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
# expect: 200 and rows with only user_id, username, changed_at

curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/usernames" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"00000000-0000-0000-0000-000000000000","username":"hacker"}'
# expect: 401/403 permission denied (guests cannot write)
```

Repeat the POST with a signed-in user's access token in an `Authorization:
Bearer` header: expect the same refusal. Usernames are only ever written by
the confirmation trigger.

## 3. End to end through the app

1. Sign up at `/signup` with a new email and Username `Test_User1`.
   Expect the "check your email" screen. In Table Editor, `public.usernames`
   has **no** row yet (account not confirmed).
2. Click the confirmation link. In Table Editor, `public.usernames` now has a
   row for that account with `username = Test_User1` and `changed_at` empty.
3. Sign up with a second email and Username `test_user1` (different case).
   Expect "That Username is already taken" before any email is sent.
4. Sign up again with an email that already has an account. Expect the same
   "check your email" screen as a brand-new address: nothing reveals that the
   email is registered.
5. Race on confirmation: sign up two new emails with the same new Username
   (both pass the availability check because neither is confirmed yet), then
   confirm both. Expect the first to get the Username and the second to be
   confirmed with **no** row in `public.usernames` (confirmation must not
   fail). This is the known trade-off recorded in `usernames.sql`.
6. Missing metadata: in Authentication → Users, add a user with "Auto Confirm"
   and no Username metadata. Expect the user to be created and no
   `public.usernames` row (the trigger never blocks account creation).
7. Confirm that `auth.users` data (email) does not appear in any
   `/rest/v1/usernames` response from step 2.

## 4. Account removal

Delete the test account in Authentication → Users. Expect its
`public.usernames` row to disappear (`on delete cascade`).
