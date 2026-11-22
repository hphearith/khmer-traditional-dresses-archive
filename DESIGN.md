---
version: alpha
name: The Tailor’s Archive
description: An editorial textile archive with warm paper, oxblood ink, and generous space for Khmer and English.
colors:
  wine: "#702F36"
  wine-hover: "#542229"
  ink: "#292620"
  muted: "#686057"
  paper: "#F7F3EB"
  surface: "#FFFCF6"
  fabric: "#EAE1D3"
  line: "#D5CABB"
  control: "#877A6B"
  gold: "#967445"
  focus: "#285F69"
typography:
  display:
    fontFamily: "Georgia, 'Noto Serif Khmer', serif"
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: -0.035em
  heading:
    fontFamily: "Georgia, 'Noto Serif Khmer', serif"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "Georgia, 'Noto Serif Khmer', serif"
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.3
  khmer-heading:
    fontFamily: "'Noto Serif Khmer', 'Noto Sans Khmer', 'Khmer OS', serif"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  lead:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
  khmer:
    fontFamily: "'Noto Sans Khmer', 'Khmer OS', sans-serif"
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: 0px
  nav:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.12em
  caption:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: 0px
  control: 4px
  pill: 999px
spacing:
  micro: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-mobile: 56px
  section: 80px
  gutter-mobile: 16px
  gutter-tablet: 24px
  gutter-desktop: 40px
  container: 1200px
  reading: 640px
components:
  page:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  button-primary:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: 48px
    padding: 8px 16px
  button-primary-hover:
    backgroundColor: "{colors.wine-hover}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: 48px
    padding: 8px 16px
  button-secondary-hover:
    backgroundColor: "{colors.fabric}"
    textColor: "{colors.ink}"
  filter:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    height: 48px
    padding: 8px 16px
  filter-active:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.surface}"
  home-tab:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    height: 48px
    padding: 8px 16px
  home-tab-active:
    textColor: "{colors.ink}"
  language-toggle:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.nav}"
    height: 44px
    padding: 0 8px
  language-toggle-active:
    textColor: "{colors.ink}"
  search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: 56px
    padding: 12px 16px
  suggestion:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    height: 48px
    padding: 8px 16px
  suggestion-active:
    backgroundColor: "{colors.fabric}"
  garment-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  image-well:
    backgroundColor: "{colors.fabric}"
    rounded: "{rounded.none}"
    padding: 16px
  status-pill-pending:
    backgroundColor: "{colors.fabric}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 2px 14px
  status-pill-published:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.focus}"
    rounded: "{rounded.pill}"
    padding: 2px 14px
  status-pill-returned:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: 2px 14px
  return-note:
    backgroundColor: "{colors.fabric}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 12px 16px
  empty-state:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 48px 24px
  source-banner:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.surface}"
    padding: 48px 0
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: 12px 24px
---

# Design System: The Tailor’s Archive

## Overview

**Creative North Star: "The Tailor’s Archive"**

The site is a personal textile collection laid out like a tailor’s reference book. It uses warm paper, fine ink rules, large literary titles, cloth set on fabric mats, and bilingual catalogue labels. The tailor-shop connection comes from the curator’s own source statement in `collection.config.js`, never from invented heritage. The archive’s job is educational: browsing, searching, reading, and understanding where each dress comes from. Nothing sells. There are no prices, carts, appointments, or testimonials.

Density is calm rather than sparse. The hero and the source banner are given room. The catalogue is medium density, so records can be compared. Entry cards and forms are compact and practical. Variety comes from section format: an asymmetric introduction, a regular grid, and one full-bleed oxblood banner. Consistency comes from the type, the 4px-based spacing scale, and predictable controls. Khmer and English are equal content. Every string can appear in either language, and Khmer is never decoration.

This file is the source of truth for visual styling. The frontmatter tokens are normative, and their names match the custom properties on `:root` in `app/globals.css` (`colors.wine` is `--wine`, `colors.paper` is `--paper`, and so on). Change this document before introducing a new visual value. Archive identity is read from `collection.config.js`, records come from `data/garments.js`, and Interface strings come from `lib/uiText.js`. “The Tailor’s Archive” names the visual system, not the collection.

**Key Characteristics:**
- Warm paper ground, ink text, and a single oxblood voice for actions, selection, and the source banner.
- Georgia for English titles and Noto Serif Khmer for Khmer titles. Arial and Noto Sans Khmer for everything practical.
- Square editorial surfaces and image wells, with 4px controls. The Status pill is the one capsule.
- Flat throughout. Hierarchy comes from rules, spacing, and fabric matting. The only shadow is on the autocomplete.
- Photographs are shown whole on a fabric mat, never cropped or recoloured.

## Colors

The palette is warm paper and ink with one oxblood accent, plus decorative brass and a teal reserved for focus.

### Primary
- **Oxblood Wine** (`wine`): the one voice of the system. It fills primary buttons, the selected filter, the selected entry view and the Returned pill. It draws the active tab and language underline, the Khmer card subtitle, error and alert text, the text-cursor caret, and selected text (`::selection`). It is also the full-bleed source banner.
- **Deep Wine** (`wine-hover`): hover for primary buttons only.

### Tertiary
- **Brass Thread** (`gold`): decorative. It draws the border of the Pending pill and one of the three dormant cloth studies. It is 4.2:1 on surface, so it is never small text.
- **Worktable Teal** (`focus`): the 3px focus outline (offset 3px) on every focusable element, and the text and border of the Published pill. Nothing else is teal.

### Neutral
- **Warm Paper** (`paper`): the page ground, garment cards, and the toast’s text.
- **Ivory Surface** (`surface`): inputs, suggestion lists, empty states and the delete confirmation. Ivory is also the text on oxblood, and the focus outline and selection colour inside the source banner.
- **Pressed Ink** (`ink`): reading text, headings, the selected tab or toggle, and the toast background. It is 13.6:1 on paper.
- **Faded Ink** (`muted`): secondary text, such as counts, hints, captions, bylines, card categories, unselected tabs and filters, and placeholders. It is 5.6:1 on paper and 4.8:1 on fabric.
- **Cotton Fabric** (`fabric`): the mat behind every photograph and cloth study, hover fill for secondary controls and suggestions, the Pending pill, and Return notes.
- **Ruled Line** (`line`): 1px decorative rules: the masthead, under tabs and filters, under each card, the footer, and suggestion dividers.
- **Seam Line** (`control`): 1px outlines on interactive boundaries (inputs, filters, secondary buttons, entry views) and the inset frame inside the hero image well. It is 3.8:1 on paper, which meets the 3:1 boundary target.

### Named Rules
**The One Voice Rule.** Oxblood is the only accent. A second accent colour, a gradient UI surface, or a tinted photograph breaks the system.

**The Words-First Rule.** Colour never carries meaning alone. A selected filter is also bold and `aria-pressed`. The active tab and language are also bold and underlined. A Status pill always shows its word. An error is always a sentence.

**The Errors-in-Wine Rule.** Error and alert text uses `wine`, as `.entry-confirm-error` and the sign-in verification alert already do. The browser’s `red` (3.6:1 on paper) fails AA and is not a token.

## Typography

**Display Font:** Georgia (with Noto Serif Khmer, then serif)
**Body Font:** Arial (with Noto Sans Khmer, then sans-serif)
**Khmer Fonts:** Noto Serif Khmer for headings, and Noto Sans Khmer or Khmer OS for everything else

**Character:** Georgia gives English titles the voice of a printed catalogue. Arial keeps controls familiar. Khmer follows the same split, serif in headings and sans elsewhere, so a heading sounds like a heading in either script. No fonts are fetched: the stacks use installed fonts and the browser’s Khmer fallback.

### Hierarchy
- **Display** (400, `clamp(40px, 5.5vw, 72px)`, 1.08, -0.035em): the page `h1` on the home hero. Khmer inside it is set at 0.75em with 1.5 line height.
- **Heading** (400, `clamp(32px, 3.5vw, 40px)`, 1.2): section `h2`. Khmer inside it is set at 0.8em with 1.5 line height. Form and auth pages use the 40px top of the range as their `h1`.
- **Title** (400, 26px, 1.3): card and entry `h3`, the empty-state heading, and the source statement (26px/1.5 serif on the banner).
- **Lead** (400, 18px, 1.7): the hero description, in `muted`, capped at 42ch. The Khmer card subtitle also takes 18px, in `wine`.
- **Body** (400, 16px, 1.7): reading text, capped at 640px. Contributor stories and Return notes use 1.9 line height so Khmer marks have room.
- **Caption** (400, 14px, 1.6): counts, hints, materials, bylines, figure captions, `summary` links, suggestions, and the footer.
- **Nav** (400, 14px): masthead links and the language toggle. Khmer header text is 13px with 1.5 line height (see the rule below).
- **Label** (700, 12px, 0.12em, uppercase): English card categories and the brand line. Khmer inside a label takes the 14px caption step, with no tracking and no case change.

### Named Rules
**The Khmer-Is-Content Rule.** Anything Khmer carries `lang="km"`. Khmer is never uppercased, tracked, truncated, or given a fixed height. English display tracking does not carry into it (the base rule resets `letter-spacing` to 0). Body Khmer uses 1.9 line height, and Khmer in headings uses 1.5.

**The Optical-Size Rule.** Khmer glyphs look larger than Latin glyphs at the same size, so Khmer inside headings and the header is set smaller than its English partner: 0.75em in `h1`, 0.8em in `h2`, 13px in the masthead and nav. This is the one place a 13px size is allowed.

**The Hanging-Marks Rule.** Khmer subscript consonants hang below the baseline, so Khmer links and `summary` text put their underline 0.55em below. English links put it 5px below.

**The Cascade-Order Rule.** `body [lang="km"]` comes before the role rules in `globals.css`, so that same-specificity rules for `nav`, `h1`, `h2` and labels win by coming later. Do not wrap it in `:where()`. That lets `button { font: inherit }` pull the Khmer language toggle into Arial.

## Layout

The page is one centred column of sections: `min(1200px, calc(100% - 2 × gutter))`, with gutters of 40px on desktop, 24px on tablet and 16px on phones. Every element uses `box-sizing: border-box`, every grid child has `min-width: 0`, and nothing uses a fixed viewport height.

**Home page sequence:**
1. The language bar, right-aligned above every page.
2. The masthead: a bordered brand mark, the archive name, and in-page links on a 1px bottom rule. There is no menu and no oversized logo.
3. The hero: a split of `1.1fr 1fr` with a 48px gap and 56px/80px block padding. On the left are the title, the lead, the browse button and a note. On the right is a square fabric well holding the photograph.
4. The Official / Community tabs, with 40px below the tab rule.
5. The catalogue: a heading with its live count, the search row, wrapping filters closed by a rule with 32px below, then the grid. The Community tab follows the same rhythm, with its count closed by the same rule.
6. The source banner: full-bleed oxblood, 80px from its neighbours, with a 48px gap between a `1fr 1.6fr` split.
7. The footer: a top rule, 14px muted text, and the course note capped at 640px.

**Form and account pages** (log in, sign up, contribute, edit, choose or change username, review, cookies) are a single centred column, 440px wide for auth and 640px for entry forms. They have 48px of block padding on the paper ground and use the same buttons and fields as the home page. Form fields sit on a 24px grid gap.

**Rhythm:** headings have 24px before their content, images 16px before their caption, related label and value pairs 4–8px, and adjacent controls at least 8px. Catalogue gaps are 48px between rows and 24px between columns. Open cards have no padded outer box. Padding belongs inside image wells and controls.

### Responsive behaviour

| Width | Catalogue | Everything else |
| --- | --- | --- |
| Below 640px | One column, 16px gutters | The hero stacks with a 1:1 well. Tabs share the width equally. The search Reset button drops below the hint at full width and is hidden while there is nothing to reset. Filters grow to fill their rows. The masthead wraps. Sections are 56px apart and the banner has 32px padding. The footer stacks. |
| 640–999px | Two columns, 24px gutters; a lone last card is centred at half width | The hero and the source banner stack. The hero well becomes 3:2. The hero copy is capped at 640px. |
| 1000px and up | Three columns, 40px gutters, 1200px cap; a lone last card sits in the centre column | Two-column hero and source banner. |

### Named Rules
**The Lone-Card Rule.** A last card alone in its row is centred under the others, never stranded at the start of the row.

**The No-Sideways Rule.** Nothing scrolls horizontally. Categories wrap, long Khmer wraps by the browser’s own word breaking (`overflow-wrap: anywhere` only for unbreakable runs), and controls never shrink below 44px.

## Elevation & Depth

The system is flat. Page, cards, buttons, tabs, banners and notes have no shadow. Depth comes from tonal layering: paper for the page, ivory for inputs and panels, and fabric for mats and notes. Fine `line` rules and image matting do the rest. Cloth studies use gradients inside the artwork. Gradients are never a UI surface.

### Shadow Vocabulary
- **Overlay** (`box-shadow: 0 8px 24px rgba(41, 38, 32, 0.12)`): the search suggestions list only, at z-index 20, with a 1px `line` border and a 4px radius. It sits 4px below the field.

### Named Rules
**The Flat-By-Default Rule.** A shadow means “this is temporary and floating above the page”. Only the autocomplete qualifies. The toast is ink on paper, not shadowed.

## Shapes

Editorial surfaces are square: image wells, cards, the source banner, empty states, and Return notes (0px). Everything a hand presses has a 4px radius: buttons, filters, entry views, inputs, textareas, the suggestion list, the delete confirmation, the toast, and the photo preview. Lines are 1px solid. Selected tabs carry a 3px bottom rule and the selected language a 2px rule, and nothing else is thicker.

The hero well has an inset 1px `control` frame, 24px in from its edge, and the photograph sits 32px in. Card wells are 4:5 portrait frames with 16px of matting.

### Named Rules
**The One-Capsule Rule.** The Status pill in My entries is the only fully rounded shape (999px). It labels a state and is not a control. Categories and filters are rectangles, never pills.

**The Honest-Ornament Rule.** No scalloped frames, faux temple ornaments, or generic motifs labelled as authentic Khmer patterns. The cloth studies are abstract stripes. Wherever one appears, it is captioned as illustrative and never stands in for a particular garment.

## Components

### Language toggle
- **Character:** a quiet switch, not a banner.
- **Style:** two transparent buttons (🇰🇭 ខ្មែរ and 🇬🇧 English, each named in its own script, with the flags hidden from screen readers), each 44px high with 8px side padding, 14px, in `muted`.
- **Selected:** `aria-pressed="true"`, `ink`, bold, and a 2px `wine` underline. The flag is `inline-block` so Khmer shaping doesn’t break it into “KH”.

### Masthead and navigation
- **Brand:** a 32 × 40px box with a 1px `wine` border around a decorative 26px serif ✳, next to the archive name. Khmer is at 13px.
- **Links:** 14px with a 44px hit area and a 24px gap, wrapping on phones. The `aria-label` follows the Interface language.
- **Skip link:** an ivory chip, hidden above the viewport until it receives focus.

### Buttons
- **Shape:** gently squared (4px), at least 48px high, with 8px/16px padding and a 24px gap between label and arrow.
- **Primary:** `wine` fill with an ivory label. Hover deepens it to `wine-hover`.
- **Secondary:** transparent with a 1px `control` outline and `ink` text. Hover fills it with `fabric`.
- **Busy or disabled:** 0.7 opacity and a `wait` cursor. The label changes to the “please wait” string, so the state isn’t shown by opacity alone.
- **Text actions:** underlined links in `wine` (back links, cookie links, account links) and the native `summary` (“Read entry”), at 14px with a 44px target.

### Home tabs
- **Style:** a row of transparent buttons on a 1px `line` rule, 48px high, in `muted`. Hover fills them with `fabric`.
- **Selected:** `aria-selected="true"`, `ink`, bold, with a 3px `wine` bottom rule that sits on the shared rule. These are real tabs with panels, so tab roles are correct here.

### Search and suggestions
- **Field:** a visible 14px bold label, a 56px ivory input with a 1px `control` outline, a 4px radius and 16px text, and a 14px muted hint below. The native clear button is hidden and replaced by a 44px “✕” inside the field.
- **Row:** the label, input and hint are grid cells, so Reset lines up with the input whatever the hint length.
- **Suggestions:** an ivory list floating 4px below (see Overlay). Each row is 48px at 14px, with 1px dividers. Hover or `aria-selected` fills a row with `fabric`. A match in the other language is named on the right in `wine`. The list allows five results and supports Arrow, Enter and Escape.
- **Feedback:** the count is a polite live region. An empty result is a square ivory panel with a 26px serif heading, a muted sentence, and a Reset button.

### Filters and entry views
- **Style:** rectangular 48px buttons with a 1px `control` outline, a 4px radius and a transparent fill. Filters are `muted` and entry views are `ink`. Hover fills them with `fabric`.
- **Selected:** `aria-pressed="true"`, filled `wine` with ivory text. Filters also go bold.

### Garment card (Official record)
- **Character:** an open catalogue entry, not a boxed tile.
- **Structure:** a 4:5 fabric well, a category label in `muted`, a 26px serif title in the reader’s language, the other-language name in 18px `wine`, the complete material (never clamped), the maker and place as a Provenance list (said once above the grid when every record shares them), and a native `details` labelled “Read entry” that expands in place.
- **Edge:** a 1px `line` rule below with 24px padding, and no outer box.
- **Well:** shows the photograph whole (`contain`, 16px matting). The stylesheet also holds an abstract rotated cloth study in wine, brass or faded-ink stripes for a well with no photograph. It is dormant today, because every record has a photograph and the card always marks its well `has-image`. The study’s gradient stops (`#9C5B60`, `#CEAF78`, `#B5AB9B`, and translucent white) are artwork, not tokens.

### Contributor entry card
- **Structure:** the same rule and rhythm as the garment card. Then the dress photograph in a 4:5 fabric frame (`contain`, 16px padding), a 14px muted credit, the title (h3 at 1.7 line height), the story (1.9 line height, line breaks kept), and an optional Provenance list with bold `ink` terms and `muted` values.
- **Text:** `overflow-wrap: anywhere` as a last resort, so an unbroken run never overflows a phone.
- **Owner actions:** secondary Edit and Delete buttons with an 8px gap. Delete opens a full-row ivory confirmation with a 1px `wine` border and a 4px radius. Its error text is in `wine`.

### Status pill
- **Style:** an inline capsule (999px) with a 1px border, 2px/14px padding, 14px bold, and 1.9 line height for Khmer marks. A long pair can wrap.
- **Pending:** a `fabric` fill, `gold` border and `ink` text.
- **Published:** an ivory fill with a `focus` border and text.
- **Returned:** a `wine` fill and border with ivory text.
- **Hint:** a 14px muted sentence 8px below.

### Return note
- **Read-only:** a square `fabric` panel with a 1px `line` border and 12px/16px padding. The heading is 14px bold, and the Reviewer’s words keep their line breaks.
- **Writing one:** the Reviewer’s textarea matches the entry-form fields. A hint and a character counter sit below in 14px muted text.

### Form fields
- **Style:** the search input’s look (1px `control`, 4px, ivory, 12px/16px padding, 16px text). Textareas use 1.9 line height and resize vertically. Labels are bold, 8px above.
- **Hints and counts:** 14px `muted`, 8px below, tied to the control with `aria-describedby`.
- **Required:** the marker is visible before submit. Screen readers rely on `aria-required`.
- **Errors:** a sentence in `wine` below the field, with `aria-invalid` on the control (see The Errors-in-Wine Rule).
- **Limits:** no `maxLength`. The counter counts characters, so a pasted Khmer cluster is never split.

### Source banner
- **Character:** the curator’s source statement presented as source information, not as a fabricated quotation.
- **Style:** a full-bleed `wine` band with ivory text. The statement is a 26px/1.5 serif, capped at 640px, with a 14px byline 24px below.
- **Inside it:** the focus outline turns ivory, and selected text flips to ivory with wine text.

### Draft toast
- **Style:** a small `ink` chip with `paper` text, 12px/24px padding and a 4px radius, fixed 24px above the bottom centre. It has `role="status"` and never takes pointer events.
- **Motion:** it shows for 2.5s, then fades out over 600ms.

### Hero image
- **Style:** a square `fabric` well (3:2 on tablets) with the inset `control` frame and the photograph shown whole. The alt text leads with the reader’s language, as the cards do.

### Making-process map (proposed, not built)
This is a plan awaiting the tailor’s own documentation. Nothing on the site implements it yet, and its stage titles are prompts, not records.

- **Semantics:** an ordered list of five steps. It is an archive sequence, not a wizard, progress bar or checklist. The DOM order is media then description for every step, and CSS grid alternates the columns visually.
- **640px and up:** two equal columns with a 48px gap. The media boxes are square `fabric` panels with a 1px border, 24px padding and a 240px minimum height. Each shows a 12px step label, a decorative 72px number and a visible photo or video status. The notes have a 26px title and 16px body capped at 42ch.
- **Connector:** 80px between rows for a 1px `gold` right-angled line from one box’s centre to the next. It reverses on alternate rows, and there are four decorative connectors with none after step five.
- **Below 640px:** each step stacks as box then description beside a left vertical rail with square `wine` markers. Use a 24px inset, a 16px gap, 48px between steps and a 200px minimum media height.
- **Content:** a documented process names the garment it belongs to and keeps its photo and video credits. Video plays only on request, with captions and a text description. One assumed process is never copied across every garment.

### Interaction and motion
- **Transitions:** background, colour and border change over 150ms on buttons, links, inputs and summaries. Nothing else moves: no parallax, autoplay, entrance animation, hover lift or zooming cloth.
- **Scrolling:** in-page links scroll smoothly, and the catalogue and tabs keep 24px of `scroll-margin`.
- **Reduced motion:** `prefers-reduced-motion` removes every transition and the smooth scroll.
- **Cursor:** the pointer appears only on actions. Informational cards keep the native cursor. Every hover state has a focus-visible equivalent.

## Do's and Don'ts

### Do:
- **Do** preserve the student’s exact bilingual records and configured identity, and visibly distinguish documentary content (photographs, records, entries) from illustrative composition (cloth studies).
- **Do** read every colour from a `globals.css` custom property whose name matches a token here, both in CSS and in inline style objects (`var(--wine)`, never a hex or a named colour).
- **Do** put error and alert text in `wine`, worded as a sentence, never colour alone.
- **Do** show photographs whole on a `fabric` mat with 16px of matting, in a 4:5 frame on cards.
- **Do** mark every Khmer string with `lang="km"`, give body Khmer 1.9 line height, and let it wrap by the browser’s own word breaking.
- **Do** prioritise finding entries before decorative storytelling, keep familiar search and navigation conventions, and group closely related captions.
- **Do** vary section format (split hero, regular grid, full-bleed banner) while keeping repeated catalogue entries identical in structure.
- **Do** check text contrast (4.5:1 text, 3:1 large text and control boundaries), keyboard access, focus, image fallbacks, long Khmer text, filtering, empty states, and reflow at 320, 390, 768, 1024 and 1440px and at 200% zoom.
- **Do** implement styling in plain CSS or existing inline objects, with plain JavaScript React components and no dependencies.

### Don't:
- **Don't** put a small label or kicker above a heading. The four on the home page were removed in #100. Labels belong to card categories and the brand.
- **Don't** add a second accent colour, tint a photograph, or use a gradient as a UI surface.
- **Don't** round anything beyond 4px except the Status pill, and don't turn categories or filters into pills.
- **Don't** add shadows to cards, buttons, banners or the toast. Only the autocomplete floats.
- **Don't** use sizes or gaps off the scale (such as 20px, 22px or 28px) in new work. Pick the nearest step.
- **Don't** build contributor accounts, ownership, or publishing flows ahead of their assigned sprint.
- **Don't** substitute a sales funnel, reduce Khmer to decoration, invent cultural authority, or scatter competing styling values across files.

### Basis
The file follows the YAML token layer and ordered prose sections of the [Google DESIGN.md alpha specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md). Layout and component decisions are this project’s design choices, not aesthetics the spec prescribes. [Laws of UX](https://lawsofux.com/) informs familiar navigation (Jakob’s Law), adequately sized targets (Fitts’s Law), a small visible set of filters (Hick’s Law), and captions grouped near their images (Law of Proximity).
