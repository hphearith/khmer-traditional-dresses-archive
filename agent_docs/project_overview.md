# Project Overview

Keep the current project-wide model concise. Reference technology, structure,
diary, or module documents instead of duplicating their detail.

## Purpose

An ICT 340 Khmer Living Archive documenting the creation of Khmer traditional
dresses. The configured curator is Heng Phearith; the stated source is the
curator's mother, a tailor with more than 20 years of experience.

## Scope

The current page presents an editorial, browseable archive of eight static
garment entries, with English and Khmer names, materials, descriptions,
categories, and explicitly pending illustrative media. It also includes
provenance information and a five-stage making-process outline whose headings,
notes, and media await the tailor's documentation. Contributor sign-up, login,
and logout are implemented while guest browsing remains public and cookie-free.
The official records stay in `data/garments.js` and are published through
website code deployments. A separate pool for contributors' own ordered or
custom-made dress posts is unimplemented, with planning paused while its
requirements are decided.

## Architecture

Next.js App Router renders `app/layout.js`, `app/page.js`, and the auth routes;
the page reads archive identity from `collection.config.js` and composes the
editorial shell, provenance section, and provisional process map around the
interactive archive. `app/globals.css` owns the responsive visual system. The
archive controller is the client component `components/GarmentsArchive.js`;
static data lives in `data/garments.js`; shared search and category-filter
rules live in `lib/garmentSearch.js`. Supabase SSR clients provide contributor
auth state, and root `middleware.js` delegates claim validation and cookie
refresh to `lib/supabase/middleware.js`: guests may view `/` without an auth
cookie, while authenticated `/login` or `/signup` requests go to `/` with
query parameters cleared. Signup and resend use the current origin's
`/auth/callback`; that dynamic, no-store callback exchanges the confirmation
code through the SSR cookie bridge before checking session persistence. Invalid
or unusable links offer login and resend recovery. The default confirmation
email template remains locked unless custom SMTP is configured. Auth forms
verify cookie persistence with a full `?verify=1` navigation and offer guest
fallback if storage is blocked. The `/cookies` page documents necessary account
storage and the absence of optional analytics/advertising cookies. See
`project_structure.md` and `project_core_tech.md` for boundaries and constraints.

## Main Workflows

- Browse all garments or filter by lower body, upper body, or ensemble.
- Search English/Khmer names, material, and description with AND matching;
  quoted phrases remain a single search term and autocomplete supports
  keyboard navigation.
- Read entry descriptions in place, review the configured provenance, and
  follow the explicitly provisional five-stage making-process outline.
- Browse the public archive without an auth cookie; create an account, log in,
  confirm signup by email, resend a confirmation link when needed, or log out
  when contributor session storage is available. The deployed callback still
  requires live verification.
- Read `/cookies` before sign-in; auth forms perform a full-navigation
  persistence check and return to guest browsing when the cookie cannot be
  verified.
- Run locally with `npm install` and `npm run dev`; README.md documents Vercel
  deployment for the course starter.

## Major Decisions

- `collection.config.js` is the single source of archive identity and is
  imported by both metadata and page content.
- The project uses JavaScript, plain React, inline styles/plain CSS, and no
  additional dependencies.
- The archive root is public; cookie-backed Supabase sessions support
  contributor accounts. Official catalogue records remain static and are
  published through website code deployments. Future contributor posts belong
  to a separate, unimplemented pool with no approved schema or workflow.
- Khmer text is first-class content and must remain verbatim.
