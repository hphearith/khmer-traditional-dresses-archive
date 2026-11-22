---
version: alpha
name: The Shopfront
description: Apsara Mode Tailor's window seen from the street. A blue enamel sign with yellow Khmer lettering, a red-and-white awning, and a row of lit glass cabinets with one dress in each.
colors:
  blue: "#1D3A8F"
  blue-deep: "#142B6E"
  blue-tint: "#E6EAF5"
  yellow: "#F4C531"
  red: "#C8232C"
  wall: "#E7EAEE"
  bay: "#D5D9DF"
  white: "#FFFFFF"
  shop-ink: "#16181D"
  shop-muted: "#464B57"
typography:
  sign-khmer:
    fontFamily: "'Noto Serif Khmer', 'Noto Sans Khmer', 'Khmer OS', serif"
    fontSize: clamp(30px, 4.6vw, 60px)
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: 0em
  sign-display:
    fontFamily: "'Big Shoulders', 'Arial Narrow', sans-serif"
    fontSize: clamp(30px, 4.2vw, 56px)
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: 0.01em
  headline:
    fontFamily: "'Big Shoulders', 'Arial Narrow', sans-serif"
    fontSize: clamp(32px, 3.6vw, 44px)
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: 0.01em
  title:
    fontFamily: "'Big Shoulders', 'Arial Narrow', sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: 0.01em
  title-khmer:
    fontFamily: "'Noto Serif Khmer', 'Noto Sans Khmer', 'Khmer OS', serif"
    fontSize: 21px
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: 0em
  subtitle:
    fontFamily: "'Big Shoulders', 'Arial Narrow', sans-serif"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.04em
  brand:
    fontFamily: "'Big Shoulders', 'Arial Narrow', sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.08em
  statement:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.5
  lead:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  khmer:
    fontFamily: "'Noto Sans Khmer', 'Khmer OS', sans-serif"
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: 0em
  nav:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1.7
    letterSpacing: 0.06em
rounded:
  none: 0px
  plaque: 2px
spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 48px
  section-pad: 56px
  section: 96px
  frame: 8px
  gutter-mobile: 16px
  gutter-tablet: 24px
  gutter-desktop: 40px
  container: 1200px
components:
  page:
    backgroundColor: "{colors.wall}"
    textColor: "{colors.shop-ink}"
    typography: "{typography.body}"
  signboard:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
  sign-panel:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.yellow}"
    rounded: "{rounded.none}"
    padding: 24px 40px 28px
  plaque:
    backgroundColor: "{colors.white}"
    textColor: "{colors.blue}"
    rounded: "{rounded.plaque}"
    height: 48px
    padding: 8px 20px
  plaque-hover:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.blue}"
  plaque-selected:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.yellow}"
    rounded: "{rounded.plaque}"
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.yellow}"
    rounded: "{rounded.plaque}"
    height: 48px
    padding: 8px 20px
  button-primary-hover:
    backgroundColor: "{colors.blue-deep}"
    textColor: "{colors.yellow}"
  home-tab:
    backgroundColor: "{colors.white}"
    textColor: "{colors.blue}"
    rounded: "{rounded.plaque}"
    height: 52px
    padding: 8px 20px
  home-tab-selected:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.yellow}"
  search:
    backgroundColor: "{colors.white}"
    textColor: "{colors.shop-ink}"
    rounded: "{rounded.plaque}"
    height: 52px
  suggestion-active:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.shop-ink}"
  cabinet:
    backgroundColor: "{colors.white}"
    textColor: "{colors.shop-ink}"
    rounded: "{rounded.none}"
    padding: 0 0 8px
  cabinet-bay:
    backgroundColor: "{colors.bay}"
    rounded: "{rounded.none}"
  source-panel:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: 40px 48px
  kerb:
    backgroundColor: "{colors.shop-ink}"
    textColor: "{colors.white}"
    padding: 40px 0 48px
  empty-state:
    backgroundColor: "{colors.white}"
    textColor: "{colors.shop-ink}"
    rounded: "{rounded.plaque}"
---

# Design System: The Shopfront

## Overview

**Creative North Star: "The Shopfront"**

The archive is Apsara Mode Tailor's shop window seen from a Phnom Penh street. A blue enamel sign board runs full-bleed across the top, its Khmer name painted in yellow above the English. A red-and-white scalloped awning hangs under it, and the section tabs hang from the awning's edge as painted plaques. Below, on a cool tile wall, a row of glass cabinets framed in blue holds one dress each, lit by a yellow lamp strip. The shop's own statement about where its knowledge comes from is a red painted panel, and the page ends on a dark kerb. The look comes from the curator's real source (a family tailor shop, every dress photographed there), never from invented heritage. Nothing sells: no prices, carts or appointments.

The world refuses the museum collection page it replaced: cream ground, a serif headline beside a hero photo, a grid of matted cards. Density is a shop window's: the sign is bold and brief, the counter (heading, count, filters, search) is compact, and the cabinets carry the page. On phones the window becomes a row you swipe along.

The tokens above are normative. In code they are custom properties declared on `body:has(.shop)` in `app/home.css` (`colors.blue` is `--blue`, `colors.shop-ink` is `--shop-ink`, `spacing.frame` is `--frame`), and every rule there is scoped under `.shop`. Archive identity is read from `collection.config.js`, records from `data/garments.js`, and Interface strings from `lib/uiText.js`. Today only the home page (`app/page.js`) wears this system; see **Pages still on The Tailor's Archive** below.

**Key Characteristics:**
- Three paints on a tile wall: enamel blue owns the sign, frames and plaques; yellow is lettering and lamplight; red is the awning, the category label and the source panel.
- Big Shoulders condensed sign-writer caps for Latin display. Noto Serif Khmer bold for Khmer display, always above and larger on the sign.
- Painted plaques with 2px corners and, when chosen, a fine yellow rule inside the edge. Square cabinets with an 8px blue frame.
- Depth is light, not shadow: a glowing lamp strip and a warm spill over each photograph.
- Photographs are shown whole on the cabinet's grey back wall, never cropped or recoloured.

## Colors

Enamel-sign paints on a cool tile wall: one blue, one yellow, one red, with ink and greys for reading.

### Primary
- **Enamel Sign Blue** (`blue`): the whole sign board, the 8px cabinet frames and the bay's lower rule, every plaque border and its text, the filled (chosen) plaque, the search field and suggestion borders, the read link, the other-language suggestion, the Khmer or English card subtitle, the focus outline on light ground, and selected text on light ground.
- **Deep Enamel** (`blue-deep`): hover for the primary plaque button only.
- **Blue Wash** (`blue-tint`): hover fill for unchosen plaques and the active or hovered suggestion row.

### Secondary
- **Sign Yellow** (`yellow`): the painted Khmer name on the sign, the brand line, the sign panel's heavy rule, the letters and inner rule of a chosen plaque, the selected language underline, the lamp strip on each cabinet, and the focus outline and selection on blue, red or ink ground. Yellow is never text on white or on the wall.

### Tertiary
- **Signal Red** (`red`): the awning stripe, the source panel, the card category label, the text caret in fields, link hover underlines on card titles, and the focus outline on a chosen (blue) plaque.

### Neutral
- **Tile Wall** (`wall`): the page ground under everything below the sign.
- **Cabinet Bay** (`bay`): the grey back wall each photograph stands on, and suggestion dividers.
- **Glass White** (`white`): the cabinet body, unchosen plaques, fields, the empty state, the stripes between red, and text on blue and red.
- **Shop Ink** (`shop-ink`): reading text, headings and card titles on light ground, and the kerb's background.
- **Shop Grey** (`shop-muted`): counts, hints, provenance values, materials, credits and placeholders.

### Named Rules
**The Three Paints Rule.** Blue, yellow and red are the only paints. A fourth accent, a tinted photograph, or a gradient used as a control surface breaks the shop. The awning stripe and the lamp spill are the shop's own fittings, not UI gradients.

**The Yellow-on-Dark Rule.** Yellow appears only on blue, red or ink. On white or the wall it fails contrast and is not used.

**The Words-First Rule.** Colour never carries meaning alone. A chosen plaque is filled blue with yellow letters and an inner yellow rule, and it also carries `aria-selected` or `aria-pressed`. The chosen language is also bold and underlined. A Status pill always shows its word. An error is always a sentence.

## Typography

**Display Font:** Big Shoulders (with Arial Narrow, then sans-serif), Latin only
**Body Font:** Arial (with Noto Sans Khmer, then sans-serif)
**Khmer Fonts:** Self-hosted Noto Sans Khmer for interface text and form controls. The Shopfront uses installed Noto Serif Khmer for editorial display, with Noto Sans Khmer as its fallback.

**Character:** Big Shoulders is condensed sign-writer capitals, set uppercase, so headings read as painted lettering on a shopfront. Arial keeps reading text and controls plain. Khmer follows the same split: serif bold where the sign or a heading speaks, sans in reading text.

Big Shoulders is loaded in `app/page.js` through `next/font/google` with the Latin subset and the `opsz` axis. The Khmer subset of Noto Sans Khmer is served from `public/fonts/` with its SIL Open Font License. Both fonts are served from the archive.

### Hierarchy
- **Sign Khmer** (700, `clamp(30px, 4.6vw, 60px)`, 1.6): the archive's Khmer name in yellow on the sign, first line of the `h1`.
- **Sign Display** (800, `clamp(30px, 4.2vw, 56px)`, 0.95, 0.01em, uppercase): the archive's English name in white, second line of the `h1`, 12px below the Khmer. Below 640px it is a fixed 26px with no tracking, 6px below the Khmer, so the name fits one line on a 390px phone.
- **Headline** (800, `clamp(32px, 3.6vw, 44px)`, 1.05, 0.01em, uppercase): section `h2`, including the source panel. Khmer inside it is Noto Serif Khmer 700 at 0.72em with 1.6 line height and no case change.
- **Title** (700, 24px, 1.15): cabinet `h3`. English garment titles are uppercase with 0.01em tracking. A Khmer title is Noto Serif Khmer 700 21px/1.6. Contributor entry titles use 1.7 line height to accommodate mixed scripts.
- **Subtitle** (700, 17px, 1.3, 0.04em, uppercase): the other-language name under an English-led title, in blue. Under a Khmer-led title the subtitle is Noto Serif Khmer 400 16px/1.7.
- **Statement** (400, 24px, 1.5, Arial; 20px on phones): the curator's source statement on the red panel, capped at 34ch. Khmer in it is Noto Serif Khmer 22px/1.8 (19px on phones).
- **Lead** (400, 17px, 1.7; 15px/1.6 on phones): the description on the sign, white at 86%, capped at 72ch.
- **Body** (400, 16px, 1.7): materials, provenance and reading text. Khmer pages use a 17px body and at least 1.6 line height. Long stories and notes use 1.9.
- **Brand** (700, 16px, 1.2, 0.08em, uppercase): the archive brand at the sign's top left, in yellow. Its Khmer is 14px bold with no tracking. The kerb name uses the same voice at 18px/1.3 and 0.06em in white.
- **Nav** (400, 14px): sign links and the signed-in email.
- **Label** (700, 13px, 0.06em, uppercase): the card category in red, placed under the names. Khmer in it is 14px with no tracking and no case change.

### Named Rules
**The Khmer-Over-English Sign Rule.** On the sign the Khmer name always sits above the English and is set larger, whichever Interface language is active: 60px against 56px at the top of the range, 4.6vw against 4.2vw between, and the 30px Khmer floor against a 26px English below 640px. Between 640px and 652px both names sit on their 30px floors and are the same size; the Khmer leads from 652px up. This is how a Cambodian shop sign is painted, and it does not swap with the toggle.

**The Khmer-Is-Content Rule.** Anything Khmer carries `lang="km"`. Khmer is never uppercased, tracked, truncated, or given a fixed height. Uppercase and tracking on Latin display do not carry into it (every Khmer override resets `letter-spacing` to 0 and `text-transform` to none). Use at least 1.6 line height for Khmer, with more room for dense reading text. Keep normal word breaking, allow wrapping when needed, and disable hyphenation.

**The Optical-Size Rule.** Khmer glyphs look larger than Latin glyphs at the same size, so in a mixed heading the Khmer is set smaller than its English partner: 0.72em in a Shopfront `h2`, and 14px Khmer beside the 16px brand. The sign is the deliberate exception (see the Sign Rule): there Khmer leads.

**The Hanging-Marks Rule.** Khmer subscript consonants hang below the baseline, so Khmer links put their underline 0.55em below (`a:lang(km)` in `globals.css`). English links put it 5px below.

## Layout

The page is one centred column: `min(1200px, calc(100% - 2 × gutter))`, with gutters of 40px on desktop, 24px on tablets and 16px on phones (the `.container` and `--gutter` from `globals.css`). The sign, awning, source panel and kerb run full-bleed with their content in that column.

**Home page sequence:**
1. **The sign board:** full-bleed blue. Its top row carries the yellow brand on the left and the sign links on the right; the language toggle sits on the same row, 8px from the top. Below it, the painted sign panel with the Khmer name, the English name and the lead. 24px of blue below.
2. **The awning:** 36px high (28px on phones), hung directly under the sign.
3. **The tabs:** two plaques with a 12px gap, pulled 14px up over the scallops (12px on phones), with 24px below.
4. **The counter:** on wide screens a two-column grid with a 40px gap: heading, provenance and count with the filters under them on the left, search on the right. The filters keep 32px below. On phones it reads heading, filters, search, then the cabinets, so the first cabinet reaches the first screen; the search hint shows only while the field has focus.
5. **The window:** cabinets with 40px between rows and 24px between columns. The Community tab's count closes with 32px before its cabinets.
6. **The source panel:** full-bleed red, 96px below the window (56px on phones), 56px block padding (32px on phones). Inside, the framed panel splits heading and statement.
7. **The kerb:** full-bleed shop ink, 40px/48px padding, a `1fr 1.6fr` split of the name and the course note (stacked below 1000px), the note capped at 640px.

**Rhythm:** headings 24px before their content, related pairs 4–8px, adjacent controls 12px (tabs, filters) and at least 8px elsewhere. Cabinet content has 16px side padding; the photograph runs edge to edge inside the frame.

### Responsive behaviour

| Width | Window | Everything else |
| --- | --- | --- |
| Below 640px | A single swipeable row. Each cabinet is 78% of the row wide and snaps to its start; the row bleeds to the screen edge with gutter padding and a thin blue scrollbar. | The filters become one unwrapped row that scrolls sideways the same way. Sign links wrap under the brand. Sign panel padding 16px/20px; the English sign name drops to 26px untracked. Tabs 15px with 8px side padding. |
| 640–999px | Three columns. | Sign links take their own row under the brand. Sign panel padding 32px/36px. The kerb stacks. |
| 1000px and up | Four columns, 1200px cap. A short last row starts at the left, like a window's last cabinets. | Counter in one row; the sign's top row keeps 200px clear on the right for the language toggle. |

### Named Rules
**The Window Rule.** Every dress is in its own cabinet in one row of the window: four, three, or a swipe row. Cabinets in a row match in structure; the last cabinet of a short row is not centred or stretched.

**The No-Sideways-Page Rule.** The page never scrolls sideways. The only horizontal scrolling is inside the phone filter row and the phone cabinet row, each of which bleeds to the screen edge on purpose and scrolls on its own. Long Khmer wraps by the browser's word breaking, and controls never shrink below 44px.

## Elevation & Depth

The shop is lit, not lifted. Surfaces are flat colour; depth comes from the sign's blue mass, the 8px frames, the grey bay behind each photograph, and the cabinet lamps. Each cabinet has a 5px yellow lamp strip along its top edge that glows downward, and a warm spill over the top of the photograph: a normally blended amber wash, `linear-gradient(rgba(255, 190, 40, 0.34), rgba(255, 190, 40, 0.14) 40%, rgba(255, 190, 40, 0))`, at 0.85 opacity at rest and 1 when lit. Both brighten when the cabinet is hovered or holds focus. The one true drop shadow belongs to the floating search suggestions.

### Shadow Vocabulary
- **Lamp glow at rest** (`box-shadow: 0 4px 14px rgba(244, 197, 49, 0.5)`): the lamp strip on every cabinet.
- **Lamp glow lit** (`box-shadow: 0 6px 26px 4px rgba(244, 197, 49, 0.85)`): the lamp strip on a hovered or focused cabinet.
- **Overlay** (`box-shadow: 0 8px 24px rgba(22, 24, 29, 0.16)`): the search suggestions list only.

### Named Rules
**The Lamplight Rule.** Only the cabinet lamp glows, and it glows yellow. Cards, plaques, panels and the sign cast no shadow. A shadow other than the lamp means "floating above the page", and only the suggestions list floats.

## Shapes

Painted and framed. Plaques (tabs, filters, entry views, buttons), fields, the suggestions list and the empty state have 2px corners and a 2px blue border. Cabinets, the bay, the sign panel, the source panel, the awning and the kerb are square. Cabinet frames are 8px (`frame`), and the bay closes with the same 8px rule under the photograph. Photographs sit in a 3:4 portrait bay.

A painted panel is framed the way a sign writer frames lettering: a heavy 3px rule with a fine 1px rule inside it. The sign panel takes a yellow 3px border and a 55% yellow inner rule 12px in (7px on phones); the source panel takes a white 3px border and a 50% white inner rule 12px in (8px on phones). A chosen plaque repeats the idea at small scale with a 70% yellow inner rule 6px in.

The awning is a red and white stripe, 24px per stripe (18px on phones), with one 12px-radius scallop per stripe (9px on phones), cut with a CSS mask.

### Named Rules
**The Painted-Edge Rule.** Nothing a hand presses is rounder than 2px. Categories and filters are plaques, never pills.

**The Honest-Ornament Rule.** The awning, frames and lamps are a shop's fittings. No scalloped temple frames, faux Khmer motifs, or generic patterns labelled as authentic.

## Components

### Sign board
- **Character:** an enamel shop sign, read before anything else.
- **Top row:** the yellow brand (link to the top), then the sign links in white, 14px with a 44px target, underlined at 45% white that turns yellow on hover. A signed-in visitor sees their email in 78% white and a Log out button styled as a link.
- **Language toggle:** joins the sign's top row, positioned absolutely 8px from the top, so it takes no row of its own. Unchosen buttons are 78% white, chosen is white with a yellow 2px underline.
- **Panel:** the framed `h1` (Khmer name, then English name), then the lead. Text selection on the sign flips to yellow with blue text, and the focus outline turns yellow.

### Awning
A decorative `aria-hidden` band under the sign (see Shapes). It holds nothing, and the tabs hang from it.

### Plaques (tabs, filters, entry views, buttons)
- **Shape:** 2px corners, 2px blue border, at least 48px high (tabs 52px at 17px), 8px/20px padding, bold blue text on white.
- **Hover:** `blue-tint` fill.
- **Chosen and primary:** blue fill, yellow letters, a fine yellow rule 6px inside the edge. Primary buttons deepen to `blue-deep` on hover. Their focus outline is 3px red, offset 3px, because a blue outline would vanish against them.
- **Secondary buttons:** the unchosen plaque.

### Search and suggestions
- **Field:** a white field at least 52px high with a 2px blue border and 2px corners, ink text, a red caret, grey placeholder. The Reset plaque sits beside it at the same height. The clear control is blue.
- **Suggestions:** a white list with a 2px blue border, 2px corners and the Overlay shadow. Rows divide with `bay` and fill with `blue-tint` on hover or `aria-selected`. A match in the other language is named in blue.

### Glass cabinet (garment card and Community entry card)
- **Character:** one lit showcase per dress.
- **Frame:** white body inside an 8px blue frame, square, with 8px padding at the bottom. Content takes 16px side padding; the photograph runs to the frame.
- **Lamp:** the 5px yellow strip and the warm spill (see Elevation & Depth). A Community entry without a photograph keeps the lamp strip but has no spill.
- **Bay:** a 3:4 `bay`-grey back wall, the photograph shown whole (`object-fit: contain`), closed by an 8px blue rule, 16px above the title.
- **Text:** the title in the reader's language (a link, red underline on hover), the other-language name in blue, the category label in red, the material with a bold ink term, provenance, and a bold blue "Read entry" link pushed to the cabinet's foot. Owner actions on a Community entry sit below it.
- **Motion:** on first load the lamps come on along the window: each cabinet's lamp fades in over 0.6s and its photograph brightens from 60% over 0.9s, staggered by 0.1s per cabinet up to 0.6s, on `cubic-bezier(0.16, 1, 0.3, 1)`. The photographs are visible from the first frame, only dimmer. Hover or focus brightens the lamp over 0.3s on the same curve. `prefers-reduced-motion` removes the switch-on.

### Source panel
- **Character:** the shop's own sign about where its knowledge comes from, presented as source information, not as a quotation.
- **Style:** a full-bleed red band holding a framed panel (see Shapes) with 40px/48px padding (28px/20px on phones). The heading is a white Headline; the statement is the Statement style; the byline is 90% white. Selection flips to yellow with blue, and focus turns yellow.

### Kerb (footer)
- **Style:** full-bleed `shop-ink`, the archive name in the brand voice in white, and the course note in light grey. Selection is yellow with ink text, focus is yellow.

### Phone swipe row
- **Style:** below 640px the window is a horizontal row with mandatory snap. Each cabinet is 78% of the row so the next one shows at the edge; the row bleeds to the screen edge and keeps gutter padding as scroll padding; `overscroll-behavior-x: contain` keeps a swipe from moving the page. The filter row uses the same bleed without snapping.

### Interaction
- **Transitions:** background, colour and border change over 150ms on controls (from `globals.css`); the lamp brightens over 0.3s. Nothing else moves: no parallax, no hover lift, no zoom.
- **Focus:** 3px outline offset 3px: blue on light ground, yellow on blue, red or ink ground, red on a chosen plaque. Every hover state has a focus equivalent (`:focus-within` lights a cabinet).
- **Reduced motion:** removes the switch-on animation, every transition and the smooth scroll.

### Pages still on The Tailor's Archive (legacy, not the target)
The home page is the only Shopfront page. The record pages (`/garments/[id]`), entry pages (`/entries/[id]`), sign-in and sign-up, contribute and edit, review, choose and change username, and cookies still use the previous system, "The Tailor's Archive", defined on `:root` in `app/globals.css`. They move to The Shopfront in follow-up issues. Until then, keep work on those pages consistent with it, and do not bring its look onto the home page.

- **Palette:** warm paper ground `#F7F3EB`, ivory surface `#FFFCF6` for inputs and panels, ink `#292620`, faded ink `#686057`, cotton fabric `#EAE1D3` for photo mats and notes, ruled line `#D5CABB`, seam line `#877A6B` for control outlines. One accent, oxblood `#702F36` (hover `#542229`), for primary buttons, selection, errors and the source banner. Brass `#967445` is decorative only; teal `#285F69` is the focus outline and the Published pill.
- **Type:** Georgia with Noto Serif Khmer for titles (display `clamp(40px, 5.5vw, 72px)`/1.08, heading `clamp(32px, 3.5vw, 40px)`/1.2, title 26px/1.3); Arial with Noto Sans Khmer for everything else (16px/1.7 body, 14px captions, 12px bold tracked labels). Khmer in a heading is 0.75em in `h1` and 0.8em in `h2`.
- **Shape and depth:** square editorial surfaces, 4px controls, the Status pill as the one 999px capsule. Flat, with the autocomplete as the only shadow.
- **Rules that hold there:** oxblood is the only accent; errors are sentences in oxblood; photographs whole on a fabric mat; 4px spacing scale; no shadows on cards, buttons or banners.

The Status pill, Return note, delete confirmation and draft toast are still drawn by these legacy rules wherever they appear, including My entries on the home page.

## Do's and Don'ts

### Do:
- **Do** read every colour from a custom property whose name matches a token here (`var(--blue)`, never a hex) and scope Shopfront rules under `.shop` until the other pages move.
- **Do** put the Khmer name above the English on the sign, larger, in yellow, in every Interface language.
- **Do** mark every Khmer string with `lang="km"`, give Khmer at least 1.6 line height and dense body copy 1.9, and set Khmer in a mixed heading smaller than its English partner.
- **Do** mark a choice with words and state as well as paint: blue fill, yellow letters, the inner rule, and `aria-pressed` or `aria-selected`.
- **Do** show every photograph whole on the `bay` grey in a 3:4 bay, inside an 8px blue frame.
- **Do** keep text contrast at 4.5:1 (3:1 for large text and control boundaries), and check the sign, swipe row and counter at 320, 390, 768, 1024 and 1440px and at 200% zoom.
- **Do** implement in plain CSS or the existing inline objects, with plain JavaScript React components and no new dependencies.

### Don't:
- **Don't** put a small label or kicker above a heading. The category label sits under the names.
- **Don't** add new Khmer strings without the curator's review. Interface copy comes from `src/locales/km.json` through `lib/uiText.js`. Archive identity and records keep their own sources.
- **Don't** set yellow text on white or the wall, add a fourth accent, or tint a photograph.
- **Don't** round a plaque, field or panel beyond 2px, or turn filters or categories into pills.
- **Don't** add shadows to cabinets, plaques, panels or the sign. Only the lamp glows and only the suggestions list floats.
- **Don't** crop, zoom or recolour a dress photograph, or animate it beyond the one switch-on.
- **Don't** substitute a sales funnel, reduce Khmer to decoration, or invent cultural authority.
