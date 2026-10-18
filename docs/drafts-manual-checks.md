# Local draft saved, manual checks (issue #18)

A draft lives in the browser's `localStorage`, never in the database, so there
is no SQL and no access rule to check. The pure rules (`lib/draft.js`: the draft
key, the store, blocked storage, `hasUnsavedWork`) are automated
(`node --test tests/draft.test.mjs`). Everything that needs a real browser and a
signed-in account is checked **by hand** with the steps below. Nothing below has
been run yet: report results as manually verified, not automated.

Use the dev server (`npm run dev`), a confirmed account A, a second confirmed
account B, and the browser's DevTools → Application → Local storage. A draft key
looks like `draft:<user id>:new` or `draft:<user id>:edit:<entry id>`.

## 1. A new entry (as A, `/contribute`)

1. Type a title and part of a story in Khmer and English. Nothing is shown while
   typing, and the key `draft:<ID_A>:new` appears in Local storage.
2. Reload the page: the text is back, and a red bold message just above the Photo
   field says the draft was restored and the photo and consent box must be given again.
3. Click "Back to the Community": on the Community tab a "Draft saved" popup
   shows near the bottom of the screen, then fades away after a few seconds. Go
   back to `/contribute`: the text is back. Do the same with the browser's Back
   button, and again after reloading the form first (these are full page loads,
   unlike the link). Then leave by typing another address in the same tab: the
   popup must not appear later on `/`. In DevTools → Session storage the note
   `draft-kept-at` is gone as soon as the popup shows. Leaving with nothing typed
   shows no popup.
4. Close the tab, open `/contribute` in a new one: the text is back.
5. Compare the Khmer in the fields with what was typed, including a space at the
   end and a line break: unchanged.
6. Paste text that takes the story over 5,000 characters: the paste is refused,
   and after a reload the draft holds the text from before the paste.
7. With a Khmer keyboard, fill the Credited as field to its 50-character limit,
   then type one more syllable. The extra text is taken back when the syllable
   ends. Reload: the field holds the text at the limit, not the longer text.
8. Clear every field by hand: the key is removed, and leaving shows no popup.
9. Type again, choose a photo, tick the box and Save entry: you reach the
   Community tab, the key `draft:<ID_A>:new` is gone, and `/contribute` opens empty.

## 2. An edit, kept apart from the new entry (as A)

1. Type something in `/contribute` (do not save). Open **Edit** on one of A's
   entries and change the title: a second key `draft:<ID_A>:edit:<ENTRY>` appears
   and the new-entry key is untouched.
2. Reload the edit page: the changed title is back. Open `/contribute`: it still
   holds the new-entry text, not the edit.
3. Edit a second entry: it gets its own key and shows no text from the first.
4. Change the title back to what is stored: the edit key is removed.
5. Change the title again, Save changes: you reach the Community tab, the edit
   key is gone, and reopening Edit shows the saved title.
6. A save that fails (go offline, then Save): the form says so, and the draft and
   its key stay.

## 3. Another account on the same browser

Sign out of A while a draft exists, sign in as B, open `/contribute`: the form is
empty and shows no red message. Sign back in as A: A's draft is back.

## 4. Storage blocked

In a private window with "Block all cookies" (or the browser's site settings
set to block site data), open `/contribute` and `/contribute/<ENTRY>/edit`:

- the form is shown and no "Draft saved" popup appears when leaving;
- a complete entry still saves.

## 5. The cookie and storage page

Open `/cookies`: the section "Local drafts on this device" says what is kept (the text
fields and the year), where (this browser, under a name that includes the account), that
nothing is sent anywhere until saving, that saving removes it, and that blocked
storage only means no drafts. It also mentions the short note in session storage
that lets the next page say "Draft saved". Open `/` as a guest: Local storage and Cookies in
DevTools stay empty.

## Verified so far

| Date | Section | What was checked | Result |
| --- | --- | --- | --- |
| not yet | 1 | New entry: saves as typed, restores after reload / back / closed tab, "Draft saved" popup on leaving, red restore message by the photo, Khmer unchanged, refused paste and over-limit Khmer syllable not saved, cleared on save | Not run |
| not yet | 2 | Edit drafts kept apart from the new-entry draft and from each other, dropped when unchanged, cleared on save, kept on a failed save | Not run |
| not yet | 3 | A second account does not see the first account's draft | Not run |
| not yet | 4 | Blocked storage: forms work, no popup | Not run |
| not yet | 5 | `/cookies` section is accurate; guest home page stores nothing | Not run |
