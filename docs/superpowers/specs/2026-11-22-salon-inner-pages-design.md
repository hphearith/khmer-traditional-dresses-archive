# Sign and Salon for every page: design

Date: 2026-11-22. Follows PR #140 (the home page) and PR #142 (stone contrast).

## Intent

The home page is the inside of Apsara Mode Tailor (Sign and Salon, `DESIGN.md`). Every other page still wears the older `globals.css` look: cream ground, Georgia, a darker wine, rounded controls, no shop header. A reader who opens a record or logs in walks out of the shop. The curator wants the whole archive inside the salon, and the sign's Khmer to look the same on every phone.

## Goals

- Every page renders in Sign and Salon: plaster ground, the salon's tokens, square controls, wine and gold in their roles.
- Every inner page has the same header: the coving, the nav row, and a **slim sign strip** (the curator chose option B).
- The sign's Khmer uses a served Noto Serif Khmer instead of whatever the device has.
- The shared tokens leave `home.css`, so no page depends on the home page's stylesheet.

## Non-goals

- No new interface text. Every label already exists in `lib/uiText.js`. If a page seems to need a new label (Khmer especially), stop and ask the curator; agents do not write Khmer.
- No behaviour changes: forms, redirects, reads, review rules and drafts work exactly as now. Nothing in `lib/` changes, except where noted.
- Deleting the old `globals.css` rules once nothing uses them. That is a separate cleanup issue after the last migration.
- The flag toggle, the accepted marble vein, and the home page's composition stay as they are (decisions in the earlier handoff).

## Anti-goals

- A page that looks migrated but breaks Khmer: clipped subscripts, Khmer below English on the sign, `lang` lost.
- Salon tokens used piecemeal on a page that is not fully migrated (`DESIGN.md` forbids it).
- One giant PR that cannot be reviewed.

## Constraints

- `AGENTS.md`: JavaScript, no new packages, components roughly 80 lines or less, one issue per branch cut from `main`, `node --test tests/` after every change.
- `next/font/google` ships with `next`, so it adds no package. Fonts are downloaded at build time and served from our own site.
- `DraftToast` and `LanguageToggle` render in `app/layout.js`, outside any page, so `.shop` scoping cannot reach them; they are styled through `body:has(.shop)`.
- `globals.css` collides with salon rules (`.section-head`, `footer`, `h1 [lang="km"]`, `.filter` radius and more). Override inside `.shop`; never edit `globals.css` for a salon change.

## Approaches

1. **Chosen: a shared salon layer that pages opt into.** `app/salon.css` holds the tokens and everything shared. A `<Shop>` component wraps a page in `.shop` with the font variables and draws the header. Pages move over one group per PR, and pages not yet moved are untouched because every rule stays scoped to `.shop`.
2. Rewrite `globals.css` as the salon in place. It is one-shot and leaves no scoping, but it moves all twelve pages in one PR, which is unreviewable and breaks pages between steps.
3. A stylesheet per page. It is simple per page, but the header and controls would be copied twelve times and drift.

## Design

### Order: four issues and four PRs, each merged before the next branch is cut

1. **Sign Khmer font.** In a shared module `app/fonts.js`, load Noto Serif Khmer with `next/font/google` (subset `khmer`, weights 700 and 800, `display: "swap"`). The module also takes over Archivo and Marcellus from `app/page.js`. `--km-sign` uses the served face first, with the self-hosted Noto Sans Khmer as fallback. Report the measured transfer size in the PR; if the Khmer files exceed about 80 KB together, stop and ask the curator before merging.
2. **Shared layer and the record pages.**
   - Create `app/salon.css`: tokens on `body:has(.shop)`, the face tokens on `.shop`, focus, selection, links, the language-toggle placement, coving, nav row, brand, buttons, fields, empty states, status pill and Return note. Remove those rules from `home.css`.
   - Add `components/Shop.js` (the wrapper with the fonts) and `components/ShopHeader.js` (coving, nav row, slim strip). The home page uses `Shop` but keeps its full sign.
   - Move `/garments/[id]`, `/entries/[id]` and `not-found`.
3. **Account pages:** `/login`, `/signup`, `/auth/callback`, `/choose-username`, `/change-username`, `/cookies`.
4. **Making and reviewing:** `/contribute`, `/contribute/[id]/edit`, `/review`, plus `DraftToast`.

### The inner-page header

```
┌──────────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░ coving ░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│ APSARA BRAND (gold)      Collection   About      🇰🇭 🇬🇧  │  nav row, as on home
├──────────────────────────────────────────────────────────┤
│   [tools]  nameKm (wine, serif Khmer)   NAME (gold caps)  │  slim white strip, ~72px
├──────────────────────────────────────────────────────────┤
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ soffit ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│  ← Back to the archive                                   │  page content on plaster
```

- The strip shows the same `collection.nameKm` and `collection.name` as the home sign, in one line on desktop and Khmer above English on phones. The Khmer stays larger and comes first, as `DESIGN.md` requires. The strip is a link to `/`, but not an `<h1>`: each page keeps its own `<h1>`.
- The brand at left links to `/`. Collection goes to `/#collection` and About to `/#about`.
- **My call:** the nav row on inner pages has no account items (email, Review queue, change username, log out). Showing them would add a Supabase read to every page, and those actions live on the home page. Each page keeps its existing back link under the strip.
- The nav labels are the existing `TEXT.home.brand`, `TEXT.home.navCollection` and `TEXT.home.navAbout`.
- **My call:** inner pages get no skip link. The only existing label is "Skip to collection", and a "Skip to content" label would be new Khmer copy for the curator to write. The header is three links and the toggle, and `<main>` is a landmark. If the curator writes the label, adding the link takes one line.
- Footer: the same ink footer as home (`identity.name` + `TEXT.home.footer`), in a `ShopFooter` component that the home page uses too.

### Pages

- **Garment and entry records:** a two-column exhibit on desktop and stacked on phones. The photo is whole, on a white mount with a gold inner line and the mount shadow, like the hero frame. Title in Marcellus or Khmer; facts as a quiet definition list with gold hairlines; the source and byline on the marble band with its rail and veil, as the home "about" uses.
- **Account pages:** the form on a white mount, centred on plaster, at most 440px wide. Fields and buttons follow the salon field and button specs. The cookies note becomes a plaster-shade inset, not a bordered box.
- **Cookies and not-found:** text in a mount on plaster.
- **Contribute and edit:** the form on a white mount, at most 640px wide. Field labels follow the salon label style, and the photo picker becomes a square control. Restored and submitted notices use the salon empty-state style.
- **Review:** queue cards on mounts, square status tags with the word kept, and the Return note form with a salon field.
- **DraftToast:** move its inline styles to a `.draft-toast` class. In `salon.css`, `body:has(.shop) .draft-toast` makes it square and ink with plaster text. Pages not yet moved keep the old look until step 4, when every page is in the salon.

### Inline styles

Each moved component replaces its inline style objects with classes in `salon.css`, so the look lives in one place. `AGENTS.md` allows either pattern; one stylesheet keeps the salon reviewable. Components that pages outside the salon still use keep their old classes until their own step.

### Verification, per PR

- `node --test tests/`, with the summary pasted.
- Playwright captures of each page at 390×844 and 1440×900, in Khmer and English (`lang=en` cookie): no horizontal scroll, no clipped Khmer, focus visible.
- `impeccable` detector on the changed CSS.
- `DESIGN.md` and `.impeccable/design.json` updated: "Pages not yet in the salon" shrinks each step; the shell and the slim strip are documented in step 2.

## Left to the builder

The exact spacing and type sizes inside each page, within `DESIGN.md`'s scales. Splitting components that pass about 80 lines. Whether `ShopFooter` is its own file.
