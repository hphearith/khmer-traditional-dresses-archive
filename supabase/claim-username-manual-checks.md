# Choosing a Username at next login: manual checks (issue #12)

The write rule lives in the database, and the repo holds no credentials, so it
is checked **by hand** after running `supabase/claim-username.sql` in the
Supabase SQL Editor. Report the results as manually verified, not automated.

## 1. The claim function, as a signed-in account without a Username

Make a test account that has **no** row in `public.usernames` (create it with
"Auto Confirm" in Authentication → Users, with no Username metadata). Log in
to the app as it. Then expect:

1. `/` takes you to `/choose-username` straight after login (also try typing `/login`, `/signup` and `/` while logged in).
2. Submit `ab`, `so kha`, `សុខា`: refused in the form, with the matching message.
3. Submit a Username another account already holds, in any capitalisation: "That Username is already taken".
4. Submit a free Username such as `New_Name1`: you land on `/`. In Table Editor, `public.usernames` has `new_name1` for this account and `changed_at` **empty**.
5. Visit `/choose-username` again: it sends you to `/`.
6. Log in as an account that already has a Username: it goes straight to `/`, never to the step.

## 2. The function cannot be abused (from a terminal)

Use the project URL and **publishable** key from your own `.env.local`
(never paste them into a committed file).

```bash
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/claim_username" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" -d '{"candidate":"guest_try"}'
# expect: 401/403 permission denied (guests cannot call it)
```

Repeat with the Bearer access token of an account **that already has** a
Username and a new name: expect the answer `"already-chosen"` and no change to
the table (it cannot be used to change a Username or skip the 30-day wait).

## 3. Log out and the guest paths

1. On `/choose-username`, press "Log out instead": you land on `/` as a guest and are not sent back.
2. As a guest, `/choose-username` goes to `/login`. The home page and Community tab load with no Supabase cookies set.
3. Cookie fallback: block cookies for the site, log in, and expect the existing `/login?verify=1` message. There is no redirect loop, because without cookies you are a guest everywhere.
