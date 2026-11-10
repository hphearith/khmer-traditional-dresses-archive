# The reader chooses the Interface language, kept in a cookie

This supersedes 0003. The interface shows one language at a time, English or Khmer, and a toggle on every page switches between them. Khmer is the default (the owner's choice, made after the toggle was first built with English as the default). The choice is kept per device in a `lang` cookie (`en` or `km`, anything else read as Khmer) that lasts one month and is set only when the reader presses the toggle, so a guest who never touches it still stores nothing. The server reads the cookie, so every page renders in the chosen language on first load, without first showing the other language. Spec #9 story 43 is relaxed to "guest browsing stores nothing, except a language cookie when the guest picks one", and the cookies page says so.

## Considered Options

- **State held in the page, never stored.** Rejected: the choice is lost on every reload or new tab, and server-rendered pages still arrive in the default language first.
- **`localStorage`.** Rejected for the reason 0003 gave: the server cannot read it, so every page renders in the default language and flips after load.
- **A `?lang=km` parameter in the address.** Rejected for the reason 0003 gave: every link, redirect, form action and email-confirmation callback would have to carry it.
- **Saving the choice on the Contributor's account.** Rejected: it needs a database change and would treat guests and Contributors differently, for little gain.

## Consequences

- Only interface text follows the choice. Official record names and materials still show both languages, Official record descriptions stay English, and Contributor entry text is never translated.
- Placeholders, `aria-label`s and `<html lang>` follow the choice too, so they no longer combine both languages. The page `<title>` stays English.
- The cookies page is still English only, so in Khmer only its toggle changes. Translating it is separate work.
- The toggle shows 🇰🇭 ខ្មែរ and 🇬🇧 English. The flags are hidden from screen readers, and the words are always shown, because flags stand for countries rather than languages and some systems draw them as letters.
- Every Khmer string is still drafted by the AI and has to be read by a Khmer reader before it is committed.
