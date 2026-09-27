# Latest Session Work

Implemented Supabase signup email confirmation before the deferred catalogue
migration. The saved database plan is `supabase_migration_plan.md`; no live schema,
policy, or garment data changed.

## Detailed Current State

Signup and confirmation resend use the current browser origin plus
`/auth/callback`, supporting the configured production and localhost URLs. The
callback removes provider details from the browser URL, exchanges a PKCE code for
an SSR cookie session, and passes through `/login?verify=1`; middleware redirects a
valid session to `/`, while an unpersisted session receives the existing cookie
recovery message. Invalid, expired, reused, and other-browser links provide safe
login and resend recovery without exposing provider details.

The callback GET and exchange POST are dynamic and send private no-store,
no-referrer, expiry, pragma, and nosniff headers. Resend uses neutral messages,
handles returned Supabase errors, and applies a 60-second cooldown. The default
Supabase email template remains unchanged because editing requires custom SMTP.
`AuthForm` waits until the first client effect before rendering credential fields,
so password-manager DOM changes cannot conflict with server-rendered form markup.

## Verification

- `node --test tests/auth-confirmation.test.mjs` passed all focused cases.
- `npm run build` passed and classified both callback routes as dynamic.
- Independent local production HTTP checks verified the five required response
  headers and no Next.js static-cache markers.
- A synthetic local Auth service verified safe success/failure bodies, session
  cookie propagation, and no token material in response bodies.
- A repeated-effect harness verified one exchange request, stable pending UI, URL
  cleanup, and one success redirect.
- Protected configuration and dependency files are unchanged; `git diff --check`
  passed. No remote Auth request or database mutation was made.
- After a reported `/signup` hydration mismatch, focused tests and the production
  build passed with the restored mount guard. The executor also verified that the
  initial production HTML contains no credential inputs. Independent browser-level
  extension reproduction was unavailable in the sandbox.

## Pending Work

The deployed Vercel site still returns 404 for `/auth/callback` because this change
has not been deployed. After deployment, create a fresh test account and verify the
real email link, automatic sign-in, refresh persistence, resend, and expired-link
recovery. Then continue with `supabase_migration_plan.md`, confirming the owner UUID
and public source credit before importing the eight entries.
