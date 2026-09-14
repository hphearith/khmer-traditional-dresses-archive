---
version: alpha
name: The Tailor’s Archive
description: An editorial textile archive with warm paper, oxblood ink, and generous space for Khmer and English.
colors:
  primary: "#702F36"
  primary-hover: "#542229"
  ink: "#292620"
  secondary: "#686057"
  neutral: "#F7F3EB"
  surface: "#FFFCF6"
  fabric: "#EAE1D3"
  border: "#D5CABB"
  control-border: "#877A6B"
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
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.9
    letterSpacing: 0px
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
  container: 1200px
  reading: 640px
components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: 48px
    padding: 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.surface}"
  filter:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    height: 48px
  filter-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
  search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: 56px
    padding: 16px
  garment-card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  image-well:
    backgroundColor: "{colors.fabric}"
    rounded: "{rounded.none}"
  source-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    padding: 32px
---

## Overview

This file is the source of truth for all visual styling. Tokens are normative; the rules below define their application. Change this document before introducing new visual values. Archive identity must be read from `collection.config.js`; records must come from `data/garments.js`. The design name above describes the visual system, not a replacement collection name.

The direction is a personal textile collection laid out like a tailor’s reference book: warm paper, fine ink rules, large literary titles, cloth studies, and bilingual catalogue labels. The tailor-shop connection comes from the curator’s existing source statement. Preserve the educational archive purpose: browsing, searching, reading, and understanding provenance. No prices, cart, appointments, testimonials, or invented heritage claims.

### Current template audit

Source inspection: `app/page.js`, `app/layout.js`, the four active garment components, `lib/garmentSearch.js`, collection configuration, and all eight records. `EntryCard.js` is an unused placeholder timeline, not part of the rendered page. This is a source-based audit, not a claim of browser inspection.

| Aspect | Existing template | Proposed direction |
| --- | --- | --- |
| Page structure | Title, description, two metadata cards, search/filter/grid, course footer | Masthead, asymmetric introduction, catalogue, provenance banner, five-step making-process map, restrained footer |
| Grid | Auto-fill columns with a 280px minimum | Three catalogue columns; two on tablet, one on mobile; split editorial sections |
| Container | 960px content maximum plus 24px padding on each side under content-box sizing | 1200px content maximum with separate fluid outer gutters |
| Spacing | Mixed 6–80px values; repeated 20px card padding | 4px base; 8/12/16/24/32/48/56/80px rhythm |
| Typography | System sans, Courier labels, 44px bold title | Georgia titles, practical sans controls, dedicated Khmer fallback and generous leading |
| Color | Slate #14181F, panel #1C222C, mint #2EE6A8 | Ivory paper, dark ink, oxblood emphasis, decorative brass |
| Borders | Outlined metadata and garment cards | Fine section rules; outlined controls; open catalogue captions |
| Corners | 10px cards, 8px controls, pill categories | Square media and sections; 4px controls |
| Shadows | Strong autocomplete shadow; otherwise flat | Flat surfaces; subtle shadow only on temporary overlays |
| Images | Shared placeholder SVG, 16:10 cover crop | Portrait 4:5 full-garment wells; wide contextual images; honest missing-photo states |
| Density | Every entry is a fully boxed image and paragraph | Spacious introduction, medium-density catalogue, compact provenance; descriptions progressively disclosed |
| Navigation | Category buttons; no masthead navigation | Visible in-page Collection and About links, plus skip link |
| Buttons | Mint active category; monospace labels | Oxblood selected/primary controls; outlined secondary; underlined text actions |
| Interaction | Live AND search, quoted phrases, five suggestions, category intersection | Preserve search semantics; visible focus, pressed filters, live count, clear recovery, native disclosures |
| Responsive | Intrinsic wrapping; no explicit type breakpoints | Explicit 640px/1000px changes; fluid type; stacked sections; no forced horizontal scroll |

### Preview and status

`public/design-preview.html` is a standalone concept: open it directly in a browser, or visit `/design-preview.html` on the running Next.js site. It embeds a snapshot read from the configuration and eight real records so it works offline without module fetching. It is not another editable source of archive content: regenerate its snapshot after content changes. Its embedded search functions are copied from the existing search module.

The preview demonstrates search, all four category filters, counts, clearing, native entry disclosures, focus states, responsive layout, and a five-step making-process map. Process headings and order are explicitly proposed, awaiting the tailor’s documentation; they are not verified instructions or records. Autocomplete is retained as a production requirement below but is not simulated in this preview. Existing application components remain unchanged pending design review.

There are no authentic garment photographs in the repository. The preview uses labeled abstract CSS cloth studies, not garment reconstructions or purported historical motifs. Photography slots described below are future image guidance, not evidence that photos or permissions exist.

## Colors

Use neutral paper for most of the page, surface ivory for inputs and small labels, and ink for reading. Secondary text must remain comfortably readable. Oxblood establishes the primary action, selected filter, and a single full-width provenance banner. Brass is decorative, never small text on ivory. Use fabric as a warm media mat.

Use border for decorative separators and control-border for input outlines that identify interactive boundaries. Focus is a 3px teal outline with 3px offset. Never communicate selection or errors through color alone: combine color with pressed state, weight, border, and readable text. Target WCAG AA contrast: 4.5:1 normal text and 3:1 large text and meaningful control boundaries. Do not tint or recolor documentary photographs to fit this palette.

## Typography

Use the frontmatter stacks without remote font dependencies. Georgia supplies the English editorial voice; Arial makes controls familiar. Use installed Noto Sans Khmer or Khmer OS where available, otherwise the browser’s Khmer fallback. A later approved font asset may improve consistency; do not add a package or silently fetch fonts.

The display size is the desktop maximum. Set it to `clamp(40px, 5.5vw, 72px)`. Section headings use `clamp(32px, 3.5vw, 40px)`. Entry titles stay 26px, body 16px, lead 18px, captions 14px, and small English labels 12px. Limit prose to 640px and lead text to about 42 characters per line. Use at most regular and bold weights.

Khmer names appear immediately after English titles, at 18px/1.9, with `lang="km"`. Never uppercase, add tracking, truncate combining marks, or impose fixed text heights on Khmer. Apply the Khmer stack to mixed-script materials as needed. English display tracking must not inherit into Khmer. At 200% zoom, text and controls must reflow without clipping.

## Layout

### Page sequence and variation

1. A thin masthead rule, archive identifier, and two visible anchor links. No oversized logo or complicated menu.
2. An approximately 55/45 split introduction: collection name and description on the left, a textile composition or credited contextual photograph on the right. Keep the Browse collection anchor near the description. The visual is contextual, not a sales hero.
3. A catalogue heading and live result count, followed by labeled full-width search and four wrapping category buttons. Display records in a regular grid so comparison remains easy. Each card has a portrait image well, category, both names, material, and expandable description.
4. A full-bleed oxblood provenance banner. Present the exact source statement as source information, not a fabricated quotation; pair it with curator metadata and generous space.
5. “03 / The making process”: a five-step ordered archive of how a particular garment is made. Alternate a photo/video box on the left with its description on the right, then a description on the left with the next box on the right. Connect consecutive boxes with a thin right-angled zigzag line. Show steps 1–5 explicitly. Until real documentation exists, label stage headings/order as proposed and media/notes as pending; do not present a universal Khmer garment-making method.
6. A simple ruled footer identifying the archive and its educational context.

These formats have different jobs: introduction orients, cards support comparison, banner highlights provenance, and the process map preserves the sequence of making. Do not turn them all into rounded card sections or vary the record grid unpredictably. When real photographs exist, pair full-garment documentation with close-up or worktable photographs in the process map.

### Grid, widths, and rhythm

Use universal `box-sizing: border-box`. Content width is `min(1200px, calc(100% - 2 * gutter))`; gutters are 40px desktop, 24px tablet, and 16px mobile. Catalogue gaps are 24px. Desktop editorial splits have 48px between columns. Reading width is 640px. Do not use fixed viewport heights.

Use 80px section separation on desktop, 56px on mobile. Heading-to-content spacing is 24px; image-to-caption 16px; related labels and values 4–8px. Controls have at least 8px between targets. Open cards have no padded outer box; padding belongs inside image wells and controls. The source banner uses 48px vertical padding (32px mobile).

### Responsive behavior

| Width | Catalogue | Editorial and navigation |
| --- | --- | --- |
| Below 640px | One column, 16px outer gutters | Introduction stacks; process steps stack box then description beside a vertical rail; nav/filters wrap; 56px section spacing |
| 640–999px | Two columns, 24px outer gutters | Introduction/source stack; process map retains two alternating columns with a 48px gap; masthead remains visible |
| 1000px and above | Three columns, 40px outer gutters, 1200px cap | Two-column introduction/source banner; alternating two-column process map |

All grid children use `min-width: 0`; long labels wrap. Image ratios persist while widths remain fluid. Do not horizontally scroll categories, hide essential labels, shrink controls below 44px, or require hover to read information. Validate at 320, 390, 768, 1024, and 1440px, keyboard-only, and 200% zoom before implementing the production redesign.

## Elevation & Depth

The page, cards, buttons, and banners have no shadow. Contrast, spacing, rules, and image matting establish hierarchy. A future autocomplete panel alone may use `0 8px 24px rgba(41, 38, 32, 0.12)` at z-index 20, with a 1px border and 4px radius. Cloth studies can use gradients inside the artwork; gradients are not UI surface decoration.

## Shapes

Use square editorial panels and image wells. Buttons and fields have a consistent 4px radius. Categories are small rectangular buttons, not pills. Use 1px solid separators; selected secondary actions may add a 2px bottom rule. Fine dashed rules may occur inside illustrative cloth labels only. No scalloped frames, faux temple ornaments, or generic motifs labeled as authentic Khmer patterns.

## Components

### Navigation and buttons

Masthead links go to real section IDs. Include a skip-to-collection link revealed on focus. Use 48px minimum-height buttons, 16px horizontal padding, and 16px text. Primary actions use oxblood and ivory; hover deepens oxblood. Secondary actions are paper with a control-border outline; hover uses fabric. Text actions are underlined and have a 44px hit area. Filters use `aria-pressed`, with selected fill and bold text. Do not use tab roles unless implementing actual tab panels.

### Search and feedback

Use an explicit visible label, 56px field, 16px input text, and helper text explaining English/Khmer, materials, and quoted phrases. Keep category and keyword filtering conjunctive, with existing AND-term semantics. Update results without moving focus; announce the count through a polite live region. A clear/reset button resets both query and category and returns focus to search. Empty results name the problem and expose the reset action. There is no loading animation for this local eight-record dataset.

For production autocomplete, preserve the existing five-result limit and Arrow Up/Down, Enter, and Escape behavior. Add the correct combobox/listbox/option relationships, expanded state, active descendant, and accessible labels. Popup suggestions must not depend on mouse-only handlers. Do not place noninteractive list items in the keyboard path as pretend buttons.

### Catalogue cards and density

Cards are flat articles with a fine bottom rule. Show category, English title, Khmer title, and complete material; do not line-clamp archival text. Use native `details`/`summary` labeled “Read entry” to expose the existing description. The summary has a 44px minimum target, visible disclosure indicator, and focus styling. Expand in place without making the entire card clickable. No invented detail routes or account controls.

### Making-process map

Use a semantic ordered list of five steps, not a progressbar or a completion checklist. This is an archive sequence, not an interactive task wizard. Keep DOM order as step number/media then description for every step; use CSS grid placement to alternate the visual columns. Do not make static media placeholders look clickable or imply that any stage is completed.

At 640px and above, each step has two equal columns with a 48px gap. Media boxes are square-cornered fabric surfaces with a 1px border, 24px padding, and 240px minimum height. Show a 12px step label, a decorative 72px number, and a visible photo/video status. Adjacent notes have a 26px title and 16px body copy with a 42ch reading limit. All heights expand with content.

Leave 80px between rows for the connector: a 1px brass line descends from the current box’s center, crosses horizontally halfway down, then descends into the next box’s center. Reverse its direction on alternate rows. Render four decorative, non-focusable connectors, never a trailing connector after step five. Numbering and list semantics communicate sequence independently of the decorative line.

Below 640px, stack each box above its description, retain ascending source order, and replace the zigzag connectors with a left vertical rail and square oxblood markers. Use 24px left inset, 16px box-to-description gap, 48px between steps, and 200px minimum media height. End the rail at the last marker. Do not animate the path, require scrolling sideways, or add fake progress controls.

The preview’s five stage titles are provisional documentation prompts, not archive sample records. Replace them with the tailor’s actual sequence and exact notes when supplied. A documented process must identify the garment it belongs to and retain photo/video credits and source context. Video needs native user-initiated playback, captions, and an accompanying text description; no autoplay. Do not copy one assumed process across all garments.

### Imagery and editorial studies

Catalogue media uses 4:5 aspect ratio. Real full garments use `object-fit: contain` on fabric-colored mats with 16px breathing room; preserve hems, sleeves, and borders. Editorial context may use 3:2 cover crops if essential detail is retained. Store a deliberate focal point when necessary. Give each image dimensions, descriptive alt text, and a caption with photographer/source and permission context when known. Lazy-load below-fold images. Never invent credits.

Missing images display “Photograph pending.” Abstract preview cloth studies are decorative and `aria-hidden`; adjacent visible captions explicitly say they are illustrative. They do not depict or establish the construction, weave, or color of a particular garment. Avoid stock imagery from another culture, AI pictures presented as documentation, image-text overlays that harm readability, and filters that alter textile color.

### Interaction styling

Use 150ms color/border transitions. No parallax, autoplay, entrance animation, hover lift, or zooming cloth images. Every hover affordance has a keyboard focus equivalent. Keep the native cursor on informational cards; pointer only on actions. Respect `prefers-reduced-motion` by removing transitions and smooth scrolling. Focus rings must remain visible on dark banners via an ivory outline. Native disclosures preserve keyboard behavior.

## Do's and Don'ts

- Do preserve the student’s exact bilingual records and configured identity; visibly distinguish documentary content from illustrative composition.
- Do prioritize finding entries before decorative storytelling, keep familiar search/navigation conventions, and group closely related captions.
- Do vary section format while keeping repeated catalogue entries consistent.
- Do check text contrast, keyboard access, focus, image fallbacks, long Khmer text, filtering, empty states, and mobile reflow.
- Do implement future approved styling in plain CSS or existing inline objects, with plain JavaScript React components and no dependencies.
- Do not build contributor accounts, ownership, or publishing flows ahead of their assigned sprint.
- Do not substitute a sales funnel, reduce Khmer to decoration, invent cultural authority, or scatter competing styling values across files.

### Basis and resulting direction

The document follows the YAML token layer and ordered prose sections in the [Google DESIGN.md alpha specification](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md), consulted 2026-09-14. Layout and component decisions are this project’s design choices, not Google-prescribed aesthetics. [Laws of UX](https://lawsofux.com/) informs familiar navigation (Jakob’s Law), adequately sized targets (Fitts’s Law), a small visible set of filters (Hick’s Law), and grouping captions near their images (Law of Proximity).

The resulting direction is an intimate, editorial Khmer dress archive with the quiet precision of a tailor’s worktable: warm, legible, bilingual, and grounded in the collection’s actual source. Visual variety comes from composition and documentary context; consistency comes from typography, spacing, and predictable controls.
