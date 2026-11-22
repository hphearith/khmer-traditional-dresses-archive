---
version: alpha
name: Sign and Salon
description: Inside Apsara Mode Tailor in Phnom Penh. The shop's white sign with raised wine Khmer and wide gold capitals, then the house dress in a gold-lined white frame on a plaster wall over a marble wainscot.
colors:
  wine: "#8E1A24"
  wine-deep: "#721219"
  gold: "#A8803A"
  gold-text: "#7E5F24"
  gold-line: "#C9A866"
  plaster: "#F3F2EF"
  plaster-shade: "#E6E4DF"
  mount: "#FFFFFF"
  rail: "#FAFAF9"
  stone: "#8D897F"
  shop-ink: "#24211E"
  shop-muted: "#5E5A55"
typography:
  sign-khmer:
    fontFamily: "'Noto Serif Khmer', 'Noto Sans Khmer', Arial, 'Khmer OS Battambang', sans-serif"
    fontSize: clamp(30px, 6.4vw, 76px)
    fontWeight: 800
    lineHeight: 1.6
    letterSpacing: 0em
  sign-display:
    fontFamily: "Archivo, Arial, sans-serif"
    fontSize: clamp(16px, 3.6vw, 42px)
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: 0.02em
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: clamp(28px, 3vw, 38px)
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.06em
  headline-khmer:
    fontFamily: "'Noto Serif Khmer', 'Noto Sans Khmer', sans-serif"
    fontSize: 0.92em
    fontWeight: 700
    lineHeight: 1.7
    letterSpacing: 0em
  title:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.08em
  title-khmer:
    fontFamily: "'Noto Serif Khmer', 'Noto Sans Khmer', sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.7
    letterSpacing: 0em
  lead:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.1em
  caption:
    fontFamily: "Arial, 'Noto Sans Khmer', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
rounded:
  none: 0px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 40px
  4xl: 56px
  5xl: 72px
  section: 96px
  gutter: 40px
  gutter-tablet: 24px
  gutter-phone: 16px
components:
  button-primary:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.mount}"
    rounded: "{rounded.none}"
    padding: 10px 24px
    height: 50px
  button-primary-hover:
    backgroundColor: "{colors.wine-deep}"
    textColor: "{colors.mount}"
  button-secondary:
    backgroundColor: "{colors.mount}"
    textColor: "{colors.shop-ink}"
    rounded: "{rounded.none}"
    padding: 10px 24px
    height: 50px
  button-secondary-hover:
    backgroundColor: "{colors.plaster}"
    textColor: "{colors.shop-ink}"
  tab:
    textColor: "{colors.shop-muted}"
    rounded: "{rounded.none}"
    padding: 8px 0
    height: 48px
  tab-selected:
    textColor: "{colors.shop-ink}"
  filter-selected:
    textColor: "{colors.wine}"
  input-search:
    backgroundColor: "{colors.mount}"
    textColor: "{colors.shop-ink}"
    rounded: "{rounded.none}"
    height: 52px
  photo-mount:
    backgroundColor: "{colors.mount}"
    rounded: "{rounded.none}"
    padding: 8px
  hero-frame:
    backgroundColor: "{colors.mount}"
    rounded: "{rounded.none}"
    padding: 12px
    width: 400px
  status-tag-pending:
    backgroundColor: "{colors.plaster}"
    textColor: "{colors.shop-ink}"
    rounded: "{rounded.none}"
    padding: 0 12px
  status-tag-published:
    backgroundColor: "{colors.mount}"
    textColor: "{colors.shop-ink}"
    rounded: "{rounded.none}"
    padding: 0 12px
  status-tag-returned:
    backgroundColor: "{colors.wine}"
    textColor: "{colors.mount}"
    rounded: "{rounded.none}"
    padding: 0 12px
  empty-state:
    backgroundColor: "{colors.mount}"
    textColor: "{colors.shop-ink}"
    rounded: "{rounded.none}"
  footer:
    backgroundColor: "{colors.shop-ink}"
    padding: 40px 0 48px
---

# Design System: Sign and Salon

## Overview

**Creative North Star: "Sign and Salon"**

The archive is the inside of Apsara Mode Tailor in Phnom Penh, the curator's family shop, where every dress in the collection was photographed. The page opens under the shop's white sign: the Khmer name in raised wine-red lettering, the English below it in wide gold capitals, the drawn gold tape measure, scissors and chalk at its left, a perforated grey soffit strip beneath. Below the sign is the salon: a white plaster wall, a white dado rail, and a marble wainscot (white with grey and gold veins) along the foot of the wall. The house dress, Av Chang Pong, stands in a gold-lined white frame against it. The look comes from the curator's real source, never from invented heritage, and nothing sells: no prices, carts or appointments.

The world was pinned by the curator in their own words ("more in line with my mother's fancy tailor shop", "A's sign with B's Salon"). It rejects the museum collection page and the enamel shopfront that made the tailor shop "look like it's a barber shop". Density is a salon's: the sign is brief and large, the counter (heading, count, filters, search) is compact, and the dresses carry the page, each one on a white mount over a grey plinth. On phones the dresses become a row you swipe along.

The tokens above are normative. In code they are custom properties declared on `body:has(.shop)` in `app/salon.css` (`colors.wine` is `--wine`, `colors.gold-line` is `--gold-line`), the web faces are set on `.shop` through `next/font/google` in `app/fonts.js` (`--font-wide`, `--font-salon`, `--font-serif-khmer`), and every rule is scoped under `.shop`. A page joins the salon by wrapping itself in `components/Shop.js`, which adds the `.shop` wrapper with the fonts, brings `app/salon.css`, draws the inner-page header and closes with the footer; `app/home.css` holds only the home page's own rules. **Scope today: the home page, the Official record and Contributor entry pages, not-found, and the account pages (log in, sign up, email confirmation, choose and change username, cookies).** The rest still render on `app/globals.css`'s older styles; see **Pages not yet in the salon** under Components.

**Key Characteristics:**
- A white sign face with raised wine Khmer above wide gold English, the Khmer always on top and larger.
- White plaster, a white dado rail and a veined marble wainscot as the only surfaces; an ink footer closes the page.
- Gold is line and lettering: frame lines, underlines, the sign's English, the drawn tools, the marble's veins.
- Every photograph whole, on a white mount with a gold inner line, standing off the wall on a soft shadow.
- Square everywhere. Selection is a wine underline and bold weight, never a pill or a fill.
- One motion moment: the house dress rises into its frame once on load.

## Colors

Warm white plaster and stone greys carry the room; wine and gold are the sign's two paints, and they stay in their roles.

### Primary
- **Av Chang Pong Wine** (`wine`): the silk of the house dress. The sign's Khmer lettering, the primary button, the selected underline on tabs, filters and views, the selected filter's text, the Returned tag, the focus outline, the caret, and link underlines on hover.
- **Deep Wine** (`wine-deep`): the primary button's hover only.

### Secondary
- **Sign Gold** (`gold`): structural gold lines that mark state: the search field's focus border, the Pending tag's border, the chosen language's underline, the secondary button's hover border.
- **Gold Lettering** (`gold-text`): gold that must be read as text. The sign's English, the brand in the nav, card subtitles, suggestion hints, and the drawn tools' stroke (`tools-gold.svg`). It holds about 5:1 on plaster and white.
- **Frame Gold** (`gold-line`): the hairline gold. Frame and mount inner lines, the tab rule, link underlines at rest, the empty-state and suggestion borders, the text-selection highlight, and the phone scrollbar. Decorative and structural only; never text.

### Neutral
- **White Plaster** (`plaster`): the wall, the page ground, and the hover fill for secondary buttons and suggestions.
- **Plaster Shade** (`plaster-shade`): the cove's lower edge, the shadow line above the rail, dividers between suggestions.
- **Mount White** (`mount`): photo mounts, the hero frame, inputs, the suggestion list, empty states, and text on wine.
- **Dado Rail** (`rail`): the 8px white rail that caps every marble band.
- **Stone** (`stone`): the hairline on fields and secondary buttons. It holds 3:1 against white and plaster, the minimum for a control edge, so don't lighten it.
- **Shop Ink** (`shop-ink`): body text, headings, and the footer ground.
- **Shop Muted** (`shop-muted`): secondary text: notes, captions, counts, unselected tabs, the email in the nav.

The marble itself is `public/images/salon/marble.svg` (a light grey field with grey and gold veins, `preserveAspectRatio="xMidYMid slice"`), drawn as `background: url(...) center / cover`, so it is cropped to fit and never stretched. Where words sit on it (the knowledge band, and the phone band behind the salon copy), a 40% plaster veil goes over it first so the veins sit back behind the text. The hero wainscot carries no words and has no veil.

### Named Rules
**The Two Paints Rule.** Wine and gold are the sign's paints. Wine marks action and choice; gold draws lines and letters. Neither is ever a panel or a large fill.

**The Gold Is a Line Rule.** Gold never fills a surface, button or tag. It is lettering, a hairline, an underline, a border or a vein. The text-selection highlight is the one gold field, and it is the browser's, not the page's.

**The Word Carries It Rule.** Colour never carries meaning alone. A chosen tab, filter or view is wine-underlined (3px) and set bold; a status tag always shows its word, and the paint only repeats it.

## Typography

**Sign Display Font:** Archivo at 125% width (`font-stretch: 125%`), weight 800, with Arial. Only for the sign's English.
**Salon Display Font:** Marcellus, weight 400, with Georgia. Every other English heading, name and small capital label.
**Khmer Display Font:** Noto Serif Khmer at 700 and 800, Khmer letters only, served from the site through `next/font` in `app/fonts.js` (`--font-serif-khmer`, one variable file of about 81 KB), so every phone shows the same serif. It falls back to the self-hosted Noto Sans Khmer subset (`--khmer-sans`) while it loads.
**Body Font:** Arial with Noto Sans Khmer (`--sans` in `globals.css`).

**Character:** A sign painter's wide gold capitals over a dressmaker's engraved Roman capitals, with Khmer in a serif that holds its own at display size beside both.

### Hierarchy
- **Sign Khmer** (800, `clamp(30px, 6.4vw, 76px)`, 1.6): the archive's Khmer name on the sign. Wine, raised by a hard 1–2px edge in a darker wine and a soft cast shadow.
- **Sign Display** (800, `clamp(16px, 3.6vw, 42px)`, 1.1, 0.02em, uppercase, 125% width): the English name under it, in gold lettering with a dark-gold edge. Tracking drops to 0 on phones.
- **Headline** (400, `clamp(28px, 3vw, 38px)`, 1.3, 0.06em, uppercase): section headings in Marcellus. Khmer inside a headline is Noto Serif Khmer 700 at 0.92em, line-height 1.7, no tracking.
- **Title** (400, 20px, 1.4, 0.08em, uppercase): dress names on cards. A Khmer title is 700 22px/1.7. Community entry titles keep their own case (Marcellus with Khmer sans, 0.02em, 1.7).
- **Lead** (400, 21px, 1.6, max 44ch): the salon description. Khmer 19px/1.9; 18px and 17px on phones.
- **Body** (400, 16px, 1.7): everything else.
- **Label** (400, 15px, 0.1em, uppercase, Marcellus): the brand in the nav, card subtitles (14px), the footer name (17px). Card category labels are Arial 13px, 0.06em, uppercase. Khmer inside any label drops the tracking and the case.
- **Caption** (400, 14px): figure captions, nav links, card subtitles in Khmer (500 16px/1.8).

### Named Rules
**The Khmer on Top Rule.** On the sign the Khmer name always sits above the English and is set larger, whichever interface language is chosen, like a Cambodian shop sign.

**The Khmer Is Text Rule.** Anything Khmer carries `lang="km"`. Khmer is never decoration, never letter-spaced, never uppercased, never transliterated, and Khmer lines get the taller line-height (1.7–1.9) its marks need. No new Khmer copy is added without the curator's review.

**The Whole Gloss Rule.** A Khmer gloss inside an English material line, such as (ក្រណាត់ប៉ាក់), is held on one line (`white-space: nowrap`), so the browser never splits a Khmer word where it cannot find a word break.

**The Two Latin Faces Rule.** Archivo wide is the sign and nothing else. Marcellus is every other English display line. No third display face.

## Layout

A centred container of `min(1200px, 100% - 2 × gutter)`, with the gutter at 40px, 24px below 1000px and 16px below 640px. The page reads top to bottom as a room: a 14px cove at the ceiling, the nav row (brand at left, links, the language toggle at the far right), the full-width sign and its 20px soffit, then the salon, the counter and the dresses, the marble band about the knowledge, and the ink footer.

- **Salon:** two columns, copy and a 400px frame (`1fr / 400px`, 96px gap), aligned to the bottom so the frame stands on the 210px marble wainscot while the copy sits on the plaster above it.
- **Counter:** from 1000px the heading and filters share a row with the search (`head search / filters search`, 48px gap); below that it stacks.
- **Dresses:** four columns (56px row gap, 32px column gap), three below 1000px.
- **Rhythm:** 4/8/12/16/24/32/40/56/72/96px. Sections open with 72–96px; the marble band carries 88px of padding.

### Responsive behaviour
- Below 1000px the nav links take their own row under the brand, clear of the toggle, and the footer stacks.
- Below 900px the salon is one column: the frame first (up to 440px, centred), then the words and the button on a full-bleed marble band that rises 150px behind the frame's foot. That band and the knowledge band set `background-position: 0 0, 78% center` (veil, then marble), so the narrow window shows the part of the drawing where the gold and grey veins cross.
- Below 640px the sign stacks (tools above the name, 64px), the filters become a horizontal scroll row, the counter reads heading, filters, search, and the dresses become a swipe row (76% wide cards, `scroll-snap-type: x mandatory`).

### Known issues
- **Vein behind phone text (accepted).** On phones a gold vein in the marble runs behind the hero copy and the knowledge-section text. It stays readable but reads like a strike-through. The curator saw it and chose to ship it as it is. This is a known trade-off, not a rule: don't copy it on purpose, and don't treat a vein behind text as part of the look.

## Elevation & Depth

Depth is the room's: the frame and the mounts stand off the wall, and the ceiling, rail and soffit are lit from above. Shadows are long, soft and warm (`rgba(40, 30, 20, …)`), always negative-spread so they sit under the object rather than around it. Nothing glows.

### Shadow Vocabulary
- **Hero frame** (`0 18px 40px -18px rgba(40, 30, 20, 0.45)`): the house dress's frame against the wall.
- **Mount at rest** (`0 12px 26px -16px rgba(40, 30, 20, 0.5)`): each card's photo mount.
- **Mount lifted** (`0 22px 36px -16px rgba(40, 30, 20, 0.6)`): the mount when its card is hovered or holds focus, over 0.4s.
- **Suggestion list** (`0 10px 24px -8px rgba(40, 30, 20, 0.3)`): the search suggestions dropping over the dresses.
- **Architecture:** the cove (`0 3px 6px -3px rgba(40, 30, 20, 0.2)`), the soffit's inset (`inset 0 6px 8px -4px rgba(40, 30, 20, 0.35)`), and a 2px plaster-shade line above each dado rail.

### Named Rules
**The Stands Off the Wall Rule.** Only framed and mounted things cast shadows, plus the floating suggestion list. Buttons, tabs, tags, inputs and text panels are flat.

**The Raised Letters Rule.** The sign's lettering is the one place a hard text edge is used: 1–2px in a darker shade of the same paint, then a soft cast. It is the sign's material, and it stays on the sign.

## Shapes

Square. Every surface, button, field, tab, tag, frame and empty state has a 0px radius. Frames are drawn with an outline inset into the white: 1px `gold-line` at −6px on the hero frame and −4px on card mounts, so a gold line runs just inside the mount's edge. Photographs are 3:4, shown whole (`object-fit: contain`) inside 8px (cards) or 12px (hero) of white. Under each card mount sits a 10px grey plinth, inset 14px from each side. Bands of marble always start with an 8px white rail.

## Components

### Buttons
- **Shape:** square (0px), 50px tall (52px beside the search field), 10px 24px padding, 12px gap to a 16px stroke arrow.
- **Primary:** wine fill, white bold text, wine border. One per view: "Browse the collection" in the salon, "Write an entry" in the Community tab.
- **Hover / Focus:** fill deepens to `wine-deep`; focus is a 2px wine outline at 3px offset.
- **Secondary:** white fill, stone hairline, ink text at regular weight: the search reset beside the field, Edit on an entry card. Hover warms the fill to plaster and the border to gold.

### Tabs, filters and entry views
- **Style:** text on the wall, no fill, 48px tall, a 3px transparent bottom border; muted at rest, ink on hover.
- **Selected:** a 3px wine underline and bold weight. Tabs turn ink; filters and entry views turn wine. The tab row rests on a 1px `gold-line` rule.

### Search and suggestions
- **Field:** white, 52px, stone hairline, square; focus turns the border gold and adds the wine focus outline; the caret is wine.
- **Suggestions:** a white list in a gold hairline with the suggestion shadow; the hovered or active row fills with plaster.

### Cards (garment card and Community entry card)
- **Corner Style:** square.
- **Mount:** white, 8px padding, gold inner line, mount shadow lifting on hover or focus-within. The photo inside is never cropped, recoloured or animated.
- **Plinth:** a 10px grey step under the mount.
- **Text:** centred. Title (Marcellus capitals or Khmer serif), subtitle in gold lettering, category label, material and provenance in muted text, then a bold wine "read" link at the foot.

### Hero frame
The house dress (Av Chang Pong, an Official record) in a white frame, 12px mount, gold inner line, hero shadow, with its caption in muted 14px under the photo. Under `prefers-reduced-motion: no-preference` it rises 16px into place once on load (1.1s, `cubic-bezier(0.16, 1, 0.3, 1)`, 0.1s delay) while its shadow grows. It is the page's only entrance motion.

### Status tags (My entries)
Small square tags, 0 12px padding, the status word always on them. Pending: plaster with a gold border. Published: white with an ink border. Returned: wine with white text. The Return note is a plaster panel in a gold hairline; the delete confirmation is a white panel in a wine border.

### Empty states
A white card in a gold hairline, centred, with a Marcellus 24px heading (Khmer 700 21px/1.8). Used for no results, an empty list, or a list that failed to load.

### Navigation
- **Brand:** the archive's name in gold lettering, Marcellus capitals 15px with 0.1em tracking, Khmer in serif 700. Links are ink 14px, underlined in `gold-line`, turning wine on hover. Every target is at least 44px tall.
- **Language toggle:** the flag-emoji toggle stays, by `docs/adr/0005`. It sits at the right of the nav row; the chosen language is ink with a gold underline, the other muted.

### Inner-page header
Every page but the home page opens with the same header (`components/ShopHeader.js`): the coving, the nav row (the brand, Collection and About the archive, and the language toggle at the right; account links stay on the home page), then a **slim sign strip**, a link home. The strip is the sign's white face cut down to about 80px: the gold tools at 72px (48px on phones), the Khmer name in raised wine serif 800 at `clamp(22px, 2.6vw, 30px)` above the English in Archivo 125% gold capitals at `clamp(12px, 1.3vw, 15px)`, then the soffit. Khmer above and larger, as on the full sign. An inner page fills the screen, so a short page still ends on the footer.

### Record page
An Official record or a Contributor entry on its own page: the back link, then the photo beside its text (one column below 1000px, photo first, at most 440px). The photo hangs like the house dress: whole, 12px of white mount, a gold line at −6px and the hero shadow; a Contributor's photo keeps its own shape. The title is Marcellus capitals `clamp(32px, 3.6vw, 46px)` with 0.06em tracking (a Khmer title in serif 700); a Contributor's title keeps its own case. The facts are a two-column list on `plaster-shade` hairlines under a `gold-line` rule. The archive's source closes an Official record on a marble panel behind its 8px rail, under a 72% plaster wash so no vein runs through the words. A page that is only a message (not found, failed to load) is a centred empty-state card.

### Sheet (forms and short pages)
A form or a short text sits on a **sheet**: a white mount, square, 40px padding (28px 20px on phones), the card mount's shadow and a `gold-line` line at −6px, centred on the plaster at 520px (760px for reading pages such as cookies). Its title is Marcellus capitals `clamp(28px, 3vw, 36px)` (Khmer serif 700); an intro in muted text under it. Fields stack 24px apart; labels are ink bold 16px, hints and the password rule muted 14px, errors wine. The submit button is the primary button at full width; a disabled button drops to 60% opacity. A note inside a sheet (the cookies note on log in) is a plaster inset with no border. A question that blocks the form (confirming a Username change) is a white panel in a wine line with a primary and a secondary button. "Log out instead" is a text button: ink, underlined in `gold-line`.

### Footer
Shop ink ground, warm off-white text (`#E9E5DD`), the archive's name in white Marcellus capitals; two columns, one below 1000px. Focus outlines here are `gold-line` so they show on the ink.

### Pages not yet in the salon
Contribute and edit, and review still render on `app/globals.css`'s older system: a cream ground, Georgia with Noto Serif Khmer headings, a fabric photo mat (`--fabric`), a different and darker wine (`--wine` #702F36 there, not the salon's #8E1A24), rounded 4px controls and a 999px status pill. They move to the salon in their own issues. Until then, keep work on those pages consistent with `globals.css`, and do not use these tokens there piecemeal.

## Do's and Don'ts

### Do:
- **Do** set the Khmer name above the English on the sign and larger than it, in every interface language.
- **Do** put `lang="km"` on anything Khmer, give Khmer lines 1.7–1.9 line-height, and drop tracking and uppercase on Khmer inside labels and headings.
- **Do** show every dress photograph whole (`object-fit: contain`) on a white mount with a gold inner line.
- **Do** show a choice with a 3px wine underline and bold weight, and keep the status word on every status tag.
- **Do** keep everything square (0px radius) and keep shadows to framed and mounted things.
- **Do** start every marble band with the 8px white dado rail, and veil the marble in plaster (40%) where text sits on it.
- **Do** keep the marble cropped to fit (`slice`, `cover`), never stretched.
- **Do** keep entrance motion to the hero frame's single rise, and only under `prefers-reduced-motion: no-preference`.
- **Do** read the archive's name, description, curator and source from `collection.config.js`.

### Don't:
- **Don't** crop, recolour, filter or animate a dress photograph.
- **Don't** fill a surface, button or tag with gold, or set running text in `gold-line`.
- **Don't** show a choice or a status by colour alone, or with a pill.
- **Don't** use Archivo anywhere but the sign's English, or add a third display face.
- **Don't** use Khmer as decoration, letter-space it, transliterate it, or add new Khmer copy without the curator's review.
- **Don't** put kicker or eyebrow labels above headings.
- **Don't** replace the flag-emoji language toggle (`docs/adr/0005`).
- **Don't** bring back the museum collection page or the enamel shopfront: no cream-and-serif museum hero, no blue enamel sign, awning or glass cabinets.
- **Don't** add prices, carts, appointments or anything that sells.
