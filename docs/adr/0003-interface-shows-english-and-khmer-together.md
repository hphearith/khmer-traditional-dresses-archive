# The interface shows English and Khmer together; a language switcher comes later

Interface text (labels, hints, error messages, buttons) is written as an `{ en, km }` pair in `lib/uiText.js` and drawn by `components/Bilingual.js`, which shows English with the Khmer beneath it, or on one line for buttons, nav links and tab names. There is no language switcher yet. Guest browsing must stay cookie-free and store nothing (spec #9, story 43), so a `lang` cookie is ruled out, and showing both languages needs no state at all: it renders the same on the server and in the browser. A switcher is wanted later; `Bilingual` is the one place that decides how the languages appear, so adding one changes that component and not the screens that use it.

## Considered Options

- **A switcher kept in `localStorage`.** Rejected for now: the server cannot read it, so every page would render in English and then flip after load, and every server component that shows text would have to change. It also adds a new kind of storage to disclose on the cookies page.
- **A `?lang=km` parameter in the address.** Rejected for now: it renders correctly on the server, but every link, redirect, form action and email-confirmation callback would have to carry it.

## Consequences

- Nothing new is stored in the browser, so the cookies page needs no change.
- Screens are longer, because every piece of text is shown twice. Placeholders and `aria-label`s cannot be stacked, so they use one combined string (`combined()` in `lib/bilingual.js`); the page `<title>` stays English.
- The existing English wording is unchanged, so the tests that check it still hold.
- Out of scope for now, and still English only: the Official record descriptions (`data/garments.js` has Khmer names only), the making-process map, and the cookies page. Contributor entry text is never translated.
- Every Khmer string was drafted by the AI and has to be read by a Khmer reader before it is committed.
