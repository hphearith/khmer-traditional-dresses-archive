# Project Structure

Describe stable layout, ownership, and integration boundaries concisely; omit
generated inventories and details better owned by module documents.

## Directory Layout

- `app/`: Next.js App Router entry points (`layout.js`, `page.js`, `login/`,
  `signup/`, `cookies/`) and the global responsive stylesheet (`globals.css`).
- `components/`: archive UI components and auth UI, including the client-side
  archive controller, search and suggestions, filters, garment cards, process
  map, and `AuthPage`/`AuthForm`.
- `data/`: static archive records in `garments.js`.
- `lib/`: framework-independent search helpers and Supabase browser/server/
  middleware helpers.
- `middleware.js`: root session refresher delegating cookie handling and
  authenticated auth-path redirects to `lib/supabase/middleware.js`.
- `public/images/garments/`: image assets; the current records use
  `placeholder.svg`.
- `agent_docs/`: durable project context for coding-agent handoffs.
- `collection.config.js`: archive identity and provenance configuration.

## Modules and Responsibilities

- `app/layout.js` sets document metadata from the collection config and loads
  global styling; `app/page.js` renders the editorial shell, configured
  heading, curator/source details, archive, and process map.
- `app/login/page.js` and `app/signup/page.js` select the shared auth page;
  `AuthForm` signs users in or up with Supabase, performs a full-navigation
  cookie-persistence check through `?verify=1`, and offers guest fallback; the
  archive page provides the server-side logout action.
- `app/cookies/page.js` explains cookie-free guest browsing, necessary
  contributor session storage, and the absence of optional analytics or
  advertising cookies.
- `app/globals.css` defines the paper/oxblood visual system, responsive layout,
  focus states, and presentation for the page and archive components.
- `components/GarmentsArchive.js` owns category/query state and combines both
  filters before rendering results or an empty state.
- `components/GarmentSearch.js` provides query input and keyboard selection;
  `components/GarmentSuggestions.js` renders the accessible suggestion list;
  `components/GarmentFilter.js` provides category tabs; and
  `components/GarmentCard.js` renders one record with pending-media handling
  and a native description disclosure.
- `components/ProcessMap.js` renders the five explicitly provisional making
  stages as an ordered archive outline; it has no record or search dependency.
- `lib/supabase/client.js` and `server.js` create browser and server clients;
  `lib/supabase/middleware.js` validates JWT claims, persists refreshed
  cookies and headers, permits guests at `/`, and redirects signed-in
  auth-page requests to `/` after clearing query parameters.
- `data/garments.js` is the current static record set. `lib/garmentSearch.js`
  defines parsing, matching, and faceted filtering shared by archive search
  and autocomplete.

## Main Interfaces and Integration Boundaries

`collection.config.js` exports the default collection object consumed by the
App Router layout and page. `data/garments.js` exports the record array to
`GarmentsArchive`, while the archive passes each record to `GarmentCard` and
passes query/category callbacks to its control components. Supabase auth uses
the configured environment variables and shares cookies between browser,
server, and middleware clients; the archive root remains public. No
contributor-only routes currently exist, so future protection should target
those explicit routes rather than `/`. `ProcessMap` is a static presentation
section until documentary process material exists. Public image paths are
resolved under `/images/garments/`; the current placeholder sentinel produces
an explicit pending illustrative state.

## Tests and Supporting Assets

No test files or test script are present in the repository. `README.md`
contains local-run and Vercel deployment instructions. `DESIGN.md` and
`public/design-preview.html` document the visual direction and standalone
reference preview; `public/images/garments/placeholder.svg` remains the
available record image sentinel.
