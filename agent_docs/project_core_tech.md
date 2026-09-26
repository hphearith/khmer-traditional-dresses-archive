# Project Core Technologies

Record only foundational technologies and constraints that affect project work;
omit dependency inventories and details owned by module documents.

## Languages and Runtimes

JavaScript only. The application runs on the Next.js 15 App Router with React
19 and React DOM 19.

## Frameworks and Libraries

- Next.js `^15.3.2`
- React and React DOM `^19.1.0`
- Supabase SSR and JavaScript clients for cookie-based authentication.
- Plain React components; no CSS framework, component library, or state
  library.

## Build, Test, and Development Tools

The package scripts provide `npm run dev`, `npm run build`, and `npm run
start`. No test runner or test script is configured. Styling uses inline style
objects or plain CSS.

## External Services and Infrastructure

Supabase provides browser/server authentication through environment-configured
clients. Supabase's Confirm Email setting is currently disabled as a temporary
development/course configuration and will be enabled soon, before contributor
authentication is treated as final. `middleware.js` refreshes existing SSR
sessions on `/`, `/login`, and
`/signup`, permits guests to browse `/` without a cookie, and redirects
authenticated auth-page requests to `/` with query parameters cleared. The
`/cookies` page documents necessary first-party session storage for contributor
accounts and confirms that optional analytics/advertising cookies are not used.
README.md documents optional local development and Vercel deployment for the
course project.

## Important Technical Constraints

- Do not add dependencies; the declared runtime dependency set is limited to
  Next.js, React, React DOM, `@supabase/ssr`, and `@supabase/supabase-js`.
- Do not introduce TypeScript (`.ts`/`.tsx`); keep components as plain
  JavaScript functions.
- Read archive identity from `collection.config.js`; do not hard-code its name,
  description, curator, or source elsewhere.
- Keep Supabase credentials in environment variables; never commit their
  values.
- Keep the archive root publicly usable without an auth cookie. Verify login
  and immediate-session signup with a full navigation; if persistence fails,
  show the cookie explanation and guest fallback rather than looping.
- Preserve Khmer text verbatim as first-class content.
