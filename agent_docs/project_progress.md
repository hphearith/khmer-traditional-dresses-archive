# Project Progress

The site still reads eight static garment entries. Supabase now handles accounts
with an implemented email-confirmation callback and resend recovery. The auth
form's extension-triggered hydration mismatch is repaired locally.

## Goal

Deploy and manually validate signup confirmation against the live Supabase
project, then continue with the saved catalogue migration plan.

## Overall Progress

Public guest browsing, cookie-backed contributor accounts, confirmation-code
exchange, expired-link recovery, and resend are implemented. The user enabled
Confirm Email and configured the production Site URL and local and production
`/auth/callback` redirects. No catalogue migration has been performed.

## Current Position

Heavy deployment `email-confirmation-20260927` passed focused tests, a production
build, synthetic Auth exchange checks, repeated-effect checks, and local production
HTTP checks. The callback is dynamic and sends no-store/no-referrer headers. The
default email template remains unchanged because Dashboard editing requires custom
SMTP. Follow-up deployment `auth-hydration-repair-20260927` restored the form's
post-mount render guard; focused tests and the production build pass. Database
schema, grants, and policies remain unverified.

## Next Milestone

Deploy the app and use a fresh signup email to verify delivery, confirmation,
automatic sign-in, refresh persistence, resend, and expired-link recovery. The
current Vercel deployment does not yet contain `/auth/callback`. After that check,
start `supabase_migration_plan.md`; it requires a real owner UUID and approved
public source credit. Submit/review/publish remains Sprint 3 work.
