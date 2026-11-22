# Sign and Salon for every page: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task by task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every page of the archive into Sign and Salon, with a shared salon layer and a served serif Khmer for the sign.

**Architecture:** `app/salon.css` holds the tokens and shared rules, all scoped to `.shop` or `body:has(.shop)`. `components/Shop.js` wraps a page in `.shop` with the `next/font` variables from `app/fonts.js`, and draws `ShopHeader` (coving, nav row, slim sign strip) and `ShopFooter`. Pages opt in one group per PR.

**Tech stack:** Next.js 15 App Router, React 19, plain CSS, `next/font/google`.

**Spec:** `docs/superpowers/specs/2026-11-22-salon-inner-pages-design.md`

## Global constraints

- JavaScript only. No new packages. `package.json`, `next.config.mjs` and `.gitignore` stay untouched.
- No new interface text. Labels come from `lib/uiText.js`. Agents write no Khmer.
- Every salon rule is scoped to `.shop` or `body:has(.shop)`. Never edit `globals.css` for a salon change.
- Components stay roughly 80 lines or less, one per file in `components/`.
- One issue per PR, on a branch `<n>-<slug>` cut from an up-to-date `main`. The PR body says `Closes #n` and uses the `mattpocock-skills:pr` template. Merge with `gh pr merge --merge --delete-branch` once the checks below pass.
- After every change, `node --test tests/` shows `fail 0`.

## Review focus

The tests cover `lib/` only, so each of these is checked by capture rather than by a unit test:

- Khmer at 390px: subscripts clipped or colliding in the strip, headings and labels. Check the Khmer captures of every page.
- English interface (`lang=en` cookie): the sign strip still shows the Khmer first and larger. Capture each page in English too.
- Old rules from `globals.css` leaking into salon pages (`h1 [lang="km"]`, `footer`, `.empty h2`, `.button` radius, `input` radius). Check the computed `border-radius` of buttons and inputs.
- Signed-in-only pages (`/contribute`, `/review`, `/choose-username`, `/change-username`) redirect a guest to `/login`. Capture them through a guest redirect, and read their markup for structure.
- `DraftToast` on pages not yet moved keeps its old look. On salon pages it uses the salon style.

## Per-PR check (the "ship gate")

1. `node --test tests/`: `fail 0`.
2. Playwright captures at 390×844 and 1440×900, in Khmer and English, of each page in scope. No horizontal scroll (`scrollWidth <= innerWidth`), no clipped Khmer, a visible focus ring on the first link.
3. `grep` that no new `lang="km"` literal text was added.
4. Update the "Pages not yet in the salon" section of `DESIGN.md`, and its tokens if any changed.
5. Commit, push, open the PR, merge, `git switch main && git pull --ff-only`.

---

### Task 1: Serve Noto Serif Khmer for the sign (issue, PR 1)

**Files:** create `app/fonts.js`; modify `app/page.js` (import the fonts instead of defining them), `app/home.css` (`--km-sign`), `DESIGN.md` (typography and Known issues). Commit the spec and this plan with this PR.

**Produces:** `app/fonts.js` exports `wide`, `salon` and `serifKhmer` (next/font objects) and `fontVariables` (string: the three `.variable` class names joined by spaces). The Khmer font's CSS variable is `--font-serif-khmer`.

- [ ] File the issue, then branch `<n>-serve-sign-khmer-font`.
- [ ] `serifKhmer = Noto_Serif_Khmer({ subsets: ["khmer"], weight: ["700", "800"], variable: "--font-serif-khmer", display: "swap" })`.
- [ ] In `app/page.js`, the `.shop` div uses `fontVariables`. In `app/home.css`, set `--km-sign: var(--font-serif-khmer), var(--khmer-sans)` on `.shop`, next to the face tokens (next/font sets the variable on `.shop`).
- [ ] Build (`next build`) or dev-load `/`, and sum the transfer sizes of the Khmer woff2 files. If they exceed about 80 KB, stop and ask the curator.
- [ ] Capture the sign at 390 and 1440 in both languages. Its Khmer must render in the served serif (check `document.fonts`), and the subscripts must still clear the English.
- [ ] Ship gate.

### Task 2: Shared salon layer and record pages (issue, PR 2)

**Files:**
- Create `app/salon.css` (moved from `home.css`: tokens, the `.shop` face tokens, focus, selection, links, `language-bar` and `language-toggle`, cove, `shop-top`, `shop-brand`, `nav`, `.button` and `.secondary`, `input` and `textarea`, `.empty`, status pill, `.return-note`, `.entry-confirm`, `shop-footer`; plus new strip, record and form rules).
- Create `components/Shop.js`, `components/ShopHeader.js`, `components/ShopFooter.js`.
- Modify `app/page.js` and `app/home.css`; `app/garments/[id]/page.js`, `app/entries/[id]/page.js`, `app/not-found.js`; `components/GarmentRecord.js` and `components/EntryRecord.js` (class names only); `DESIGN.md`.

**Interfaces:**
- `Shop({ children, header = true })`: renders `<div className={"shop " + fontVariables}>`. When `header` is true it draws `<ShopHeader />` before the children, and it always draws `<ShopFooter />` after them. The home page passes `header={false}` and keeps its own nav and full sign.
- `ShopHeader()`: cove, nav row (brand → `/`, Collection → `/#collection`, About → `/#about`), and the strip `<a className="sign-strip" href="/">` holding the tools image, `collection.nameKm` (`lang="km"`) and `collection.name` (`lang="en"`), then the soffit.
- `ShopFooter()`: `identity.name` and `TEXT.home.footer`, as the home page renders them now.
- Each page imports `./salon.css` (with the right relative path). `home.css` keeps home-only rules and is imported after `salon.css` on the home page.

- [ ] File the issue and cut the branch.
- [ ] Move the shared rules to `salon.css` with no change in value. Import it in `app/page.js` before `home.css`. Capture home at 1440 and 390 before and after; the pixels match apart from font antialiasing.
- [ ] Build `Shop`, `ShopHeader` and `ShopFooter`; the home page uses `Shop header={false}`.
- [ ] Wrap the garment, entry and not-found pages in `Shop`. Restyle `.record-page`, the photo mount and the facts list, and set the source on the marble band, all under `.shop`.
- [ ] Ship gate, with captures of `/garments/av-chang-pong`, one published `/entries/<id>` if any is readable, and `/does-not-exist`.

### Task 3: Account pages (issue, PR 3)

**Files:** `app/login`, `signup`, `auth/callback`, `choose-username`, `change-username` and `cookies` pages; `components/AuthPage.js`, `AuthForm.js`, `AuthCredentialFields.js`, `ConsentField.js`, `UsernameField.js`, `ChooseUsernameForm.js`, `ChangeUsernameForm.js`, `ChangeUsernameConfirm.js`, `ConfirmationCallback.js` and `ConfirmationNotice.js`, with inline styles moved to `salon.css` classes; `DESIGN.md`.

- [ ] File the issue and cut the branch.
- [ ] Wrap each page in `Shop`. The form sits on `.mount` (white, square, mount shadow), at most 440px wide. Labels, fields, the consent checkbox and the credential error follow the salon specs. The cookies note becomes a plaster-shade inset.
- [ ] Ship gate, capturing `/login`, `/signup`, `/cookies` and `/auth/callback`. `/choose-username` and `/change-username` are checked through the preview route (below).

### Task 4: Contribute, edit, review, DraftToast (issue, PR 4)

**Files:** `app/contribute/page.js`, `app/contribute/[id]/edit/page.js` and `app/review/page.js`; `components/EntryForm.js`, `EntryField.js`, `YearField.js`, `ProvenanceFields.js`, `PhotoField.js`, `RestoredNotice.js`, `SubmittedNotice.js`, `ReviewQueue.js`, `ReviewQueueCard.js`, `ReviewDecisionButtons.js`, `ReturnNoteForm.js` and `DraftToast.js`, with inline styles moved to classes; `DESIGN.md`, where "Pages not yet in the salon" is emptied and the cleanup follow-up is noted.

- [ ] File the issue and cut the branch.
- [ ] Wrap the three pages in `Shop`; forms on `.mount`, at most 640px wide. Review cards reuse the entry-card mount, the status pill and the Return note.
- [ ] `DraftToast` gets `className="draft-toast"`, keeping only `opacity` inline. Its look goes in `salon.css` as `body:has(.shop) .draft-toast`: square, ink ground, plaster text. Once this PR lands every page imports `salon.css`.
- [ ] Ship gate. The contribute, edit and review pages are checked through a throwaway preview route (below), and the toast by firing `DRAFT_KEPT_EVENT` on `/` in Playwright.

### Checking pages that need a signed-in visitor (Tasks 3 and 4)

These pages redirect a guest, so their look is checked through a throwaway, uncommitted route, `app/salon-preview/[name]/page.js`. It renders the same components inside `Shop` with sample props taken from real Official records (never invented Khmer). Delete it before committing, and confirm `git status` shows no trace of it.
