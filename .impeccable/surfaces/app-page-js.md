---
version: 1
slug: "app-page-js"
primary_target: "app/page.js"
related_targets: ["components/GarmentCard.js","components/ContributorEntryCard.js","components/HeroImage.js"]
---

# Home page (app/page.js)

Scope: the home page only (#139, after #130 and #131). Mode: Experience, led by the dresses. Audience: people interested in Khmer dress, phone first, plus the ICT 340 graders. Job: see the collection, search and filter it, open a record, and reach the Community and the account links. Content: only the audited strings in lib/uiText.js, collection.config.js and data/garments.js. No new copy. Constraints: other pages stay as they are. Khmer uses the device's Noto fonts. Two Latin web fonts through next/font, approved by the curator for this surface: Archivo, wide, only for the sign's English, and Marcellus for the other English display text. The flag language toggle stays (docs/adr/0005).

## Direction contract

THESIS: The home page is the inside of Apsara Mode Tailor in Phnom Penh. The shop's white sign hangs over the door, and the house dress stands in a gold frame against a plaster wall above a marble wainscot. This page rejects two things: the museum collection page, and the enamel shopfront that "make[s] the tailor shop look like it's a barber shop".

OWN-WORLD: A white sign face, raised wine-red Khmer (#8E1A24, the Av Chang Pong silk) and wide gold capitals, over a warm grey perforated soffit. The wall is white plaster. Gold appears only as lettering, frame lines and the drawn tape measure, scissors and chalk. The marble is white with grey and gold veins. Each photo sits in a white mount with a gold inner line on a grey plinth. Selection is shown by a wine underline, never by a pill. The footer is ink. Latin type is Archivo at 125% width on the sign and Marcellus capitals elsewhere. Khmer is Noto Serif Khmer, set above the English and larger.

STORY: The visitor recognises a real Phnom Penh tailor's salon, believes it because every dress was photographed in that room, and then browses: filter, search, open a dress, or step into the Community.

FIRST VIEWPORT: Nav first: the brand in gold-dark, the links, and the flag toggle on the right. Then the full-width sign with the gold tools at left and the name at display scale, Khmer above English. The soffit strip sits under it. On the plaster below, the description, heroNote and the wine "Browse the collection" button (the primary action) sit at left. At right is the Av Chang Pong photo, about 400px wide in its gold-lined white frame, captioned with heroCaptionText, standing over the marble wainscot. On phones the order is sign, photo, then text and button.

FORM: seed: none (pinned). The curator's words: "the design direction to go more in line with my mother's fancy tailor shop"; "most if not all tailor shops show the dresses or shirts out in the front … Try bringing that back"; "A's sign with B's Salon … I much like B's color scheme better"; and, on prototype D, "this works". The signature moment: the hero dress rises into its frame once on load. Cards respond to pointer and focus by lifting the mount's shadow, and the photo itself is never animated.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
