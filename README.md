# Khmer Traditional Dresses · សម្លៀកបំពាក់ប្រពៃណីខ្មែរ

Live site: https://khmer-traditional-dresses-archive.vercel.app

## 1. What this is

A public archive of how Khmer traditional dresses are made. It started from my mother, who owns a tailor shop and has been making traditional Khmer dresses for over 20 years. It has two parts. The **Official records** are a curated set of seven types of dress (Sampot Hol, Sampot Phamuong, Av Pak, Sbai, Av Chang Pong, the wedding ensemble and the pagoda ensemble), each with its Khmer name, material, description, maker and place. The **Community** is where anyone with an account tells the story of one specific dress they ordered or had made, with a photo and where it came from. Anyone can browse and search both without an account. Contributors write, edit and delete their own entries, and a Reviewer reads every new or edited entry before it goes public. I built it for ICT 340 at AUPP.

The archive's name, description, curator and source are set in `collection.config.js`, and every page reads them from there.

## 2. Who it's for

People in Cambodia who wear, order or make traditional dress: families getting ready for a wedding or Pchum Ben, tailors and their customers, and students who want the Khmer names and materials in one place. What I did for them:

- **Khmer first.** The interface loads in Khmer. A toggle on every page (🇰🇭 ខ្មែរ / 🇬🇧 English) switches to English, and the server reads the choice from a `lang` cookie, so the page arrives in the chosen language without first showing the other one (`docs/adr/0005`). The default used to be English. I changed it to Khmer because most of the people this is for read Khmer first. Contributor entries are shown exactly as written, and Khmer text is never stripped or "fixed". Usernames are the one exception: they use English letters, digits and underscore only, so two names that look the same can't both exist.
- **Khmer that is checked.** Every Khmer string in the interface was drafted by an AI, so it was audited against Chuon Nath's and Headley's dictionaries and the Ministry of Culture and Fine Arts' 2026 guidance on traditional dress (`docs/research/khmer-audit.md`), and it has to be read by a Khmer reader before it is committed.
- **Phones first.** The layout has breakpoints at 999px and 639px (`app/globals.css`), and below 639px the entry grids drop to one column.
- **Slow connections.** There are no web fonts to download: Khmer uses the phone's own Noto Khmer fonts. Photos load lazily, uploads are limited to JPEG, PNG or WebP under 5 MB, and an entry being written is kept as a Local draft in the browser so a dropped connection doesn't lose it (`lib/draft.js`).
- **Guests store nothing.** Browsing needs no account and sets no cookie, except the language cookie once a guest presses the toggle. The `/cookies` page explains every cookie and what is kept in the browser.
- **Sources are named.** Each Official record names its maker and place. Each Contributor entry carries a Credit (the "credited as" name, or the Contributor's Username) and optional Provenance: who made the dress, where, when, and for what occasion. A Contributor can't upload a photo without ticking a box to confirm they took it or have permission, and that anyone who can be recognised in it agreed to it being shown publicly.

## 3. How it works

- **Next.js 15 (App Router, React 19) on Vercel** for the site. Plain JavaScript, plain CSS, no other libraries.
- **Supabase** for accounts (email and password, with email confirmation), data (Postgres with row-level security) and photos (Storage).
- **The Official records are not in the database.** They live in `data/garments.js` and change only when the site is deployed (`docs/adr/0001`). Everything below is about Contributor entries.

### Tables

| Table | What it holds | Who can read | Who can write through the API |
|---|---|---|---|
| `entries` | One Contributor entry: title, story, credited_as, occasion, year, maker, place, materials, photo_path, status, return_note, owner, timestamps | Published rows: everyone. Pending and Returned rows: their owner and Reviewers | The owner, column by column (see policies). `status` on another person's entry and `return_note`: only `review_entry()` |
| `usernames` | One lowercase Username per account, and when it was last changed | Everyone | Nobody directly. A trigger adds it when the email is confirmed; `claim_username()` and `change_username()` (30-day wait) are the only other ways in |
| `reviewers` | The account ids that may review | Nobody (RLS on, no policies) | Nobody. Only the SQL Editor changes it |
| Storage bucket `photos` | Entry photos at `<user id>/<uuid>.<ext>`; JPEG, PNG, WebP, 5 MB max | Anyone with the link (public bucket) | Each account uploads to and deletes from its own folder only |

The table also checks its own data, so a direct API call can't save what the form refuses: length limits on every text field, a year from 1900 up to the current year, and a photo path that must sit in the owner's own folder.

### The three statuses

- **Pending**: waiting for a Reviewer. Every new entry starts here, and so does every edit, even of a Published entry.
- **Published**: a Reviewer published it. Everyone can see it.
- **Returned**: a Reviewer sent it back with a Return note. Editing and saving it makes it Pending again, back in its original place in the queue.

A Reviewer's own entries skip the queue: saving one, new or edited, publishes it (`docs/adr/0004`).

### Policies on `entries`

- **Read:** `status = 'published'`, or you are the owner, or you are a Reviewer.
- **Add:** you are the owner, you have a Username, and the status is `pending` (or you are a Reviewer).
- **Edit:** your own entry only, you have a Username, and it is saved as `pending` (or you are a Reviewer). `owner`, `id` and the timestamps are not granted for update, so an entry can't be handed to someone else.
- **Delete:** your own entry only, and you have a Username. The app then deletes its photo from Storage.

The SQL that set all of this up is in `supabase/`, one file per issue, each with a manual-checks file recording what was tested and when. `supabase/review-gate.sql` is the Lab 10 brief's text, kept as a record. The live policies were checked against it on 2026-11-07 and differ in the ways that file explains.

## 4. Security decisions

**The gate.** `review_entry(entry_id, decision, note)` is the only way to publish or return another person's entry. It runs inside the database. It first asks `is_reviewer()` and returns `false` for anyone not on the `reviewers` list. It only acts on an entry that is Pending, and it answers `true` only when it actually changed the row. A Return needs a note of 1 to 500 characters, and a Publish must not send one. Guests can't call it at all.

**Why it lives in the database.** The site's key is public, so anyone can open the browser console and call the API directly, skipping every page. Only rules inside the database stand between them and the data. The `/review` page and its Publish button only decide what to *show*. Hiding the button from a non-Reviewer keeps the screen tidy and protects nothing: a stranger who calls `review_entry` from the console gets `false`, and one who tries `update({ status: 'published' })` on their own entry is refused by the edit policy. I chose one function over letting Reviewers update `status` directly because a refused update affects zero rows and raises no error, so a button would look like it worked when it hadn't (`docs/adr/0004`).

**Decisions the briefs left to me:**

- **What a Returned entry says.** The Reviewer's own words, shown exactly as written, Khmer included. A Reviewer can't Return without a note. The Contributor sees it in My entries under a Returned pill, with "Returned: edit and save to send it for review again". The note stays with the entry when it is edited and goes back to Pending, so the Reviewer can see what they asked for. A database trigger wipes it the moment the entry is Published, because Published rows are public and the note was never meant to be (`supabase/entries-return-note.sql`).
- **Reviewers can't take down Published entries.** `review_entry` only moves Pending entries, so once an entry is Published, only its owner can edit or delete it. I kept the Reviewer's power to one decision, made once, before anything is public. A takedown power was planned in `docs/adr/0002` and was never built. Removing a harmful Published entry today means the SQL Editor.
- **What search shows a Contributor about their own pending entries.** The All entries list and its search show Published entries only, the same for a guest, a Contributor or a Reviewer. The page filters on `status = 'published'` even though the database would let an owner see more. A Contributor finds their own Pending and Returned entries in **My entries**, where the same search works across every status and each entry has a Status pill.
- **A Reviewer's own entries need no approval.** This departs from "another person approves the entry". I chose it on 2026-11-07, and it is written down in `docs/adr/0004`.
- **Accounts without a Username can't write.** Every add, edit and delete policy checks for a Username (`supabase/entries-username-rule.sql`).
- **Usernames, not emails.** No email address is ever copied into a public table. Credit comes from the Username or the "credited as" text.

## 5. AI use

I used AI coding agents throughout, working one GitHub issue at a time on a branch, with the rules in `AGENTS.md` (no new packages, no keys in files, small diffs, tests must pass). I reviewed every diff before merging, ran every SQL file myself in the Supabase SQL Editor, and recorded the checks in the `*-manual-checks.md` files.

| Model / tool | What it wrote | What I kept, what I changed | How I checked it |
|---|---|---|---|
| Claude Opus 5.5 (Claude Code) | Planning, discussing, thinking with me until we both agree and are on the same page, and then it drafting the plan | I steered it away from bad decisions and made sure it understood my vision | used a skill from Matt Pocock's skills called 'grill-me' |
| Claude Sonnet 5.5 (Claude Code) | Most of the codebase under the instructions of Opus 5.5 | I got rid of minor security holes regarding reviewer send-backs | Had Opus or non-claude AI model check its written code |
| OpenAI Codex 6.2 SOL | Wrote nothing, checks the code written by Sonnet 5.5  | It mentioned some minor edge cases that I dismissed | I sent feedback back and forth between Claude and Codex |

Git history: 39 commits co-authored by Claude Opus 5.5, 39 by Claude Sonnet 5.5, 1 by Claude Haiku 5.5, out of 141.

Things the AI got wrong that I caught:

- The Lab 10 review gate replaced the add and edit policies with ones that dropped the Username rule, so an account with no Username could add an entry through the API. Found when the live policies were compared with the SQL files, and fixed in `supabase/entries-username-rule.sql`.
- After the review gate, every Contributor edit failed with "permission denied" because `status` had never been granted for update. Postgres suggested granting update on the whole table, which would have opened `owner` and `id`. I granted the one column instead (`supabase/entries-status.sql`).

## 6. Sources and credits

- **My mother**, owner of a tailor shop, who has been making traditional Khmer dresses for over 20 years. She is the archive's source for the Official collection.
- **Apsara Mode Tailor, Phnom Penh**, named as the maker on all seven Official records.
- **Photos of the Official records** (`public/images/garments/`): UNSURE who took each one. Credit each photographer here, or say they were taken by me.
- **Contributor entries** are credited on the entry itself, by the name the Contributor chose, and every photo carries the Contributor's consent.
- **Khmer checking:** Chuon Nath's Khmer dictionary (1967) and Headley's *Cambodian-English Dictionary* (1997) through the SEAlang Library, and the Ministry of Culture and Fine Arts' 2026 guidance on Khmer traditional dress. Full list in `docs/research/khmer-audit.md`.

## 7. Running it locally

You need Node.js and a Supabase project.

```bash
git clone https://github.com/hphearith/khmer-traditional-dresses-archive.git
cd khmer-traditional-dresses-archive
npm ci
npm run dev
```

Then open http://localhost:3000. Run the tests with `node --test tests/`.

Create `.env.local` (it is git-ignored) with these two variables. The same two are set in Vercel.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The publishable key is public by design: it is sent to every browser that opens the site. What keeps the data safe is the row-level security described above, not the key. The secret key is never used by the site and never belongs in this repo.

To set up a new database, run the files in `supabase/` in the SQL Editor in this order: `usernames.sql`, `claim-username.sql`, `change-username.sql`, `entries.sql`, `entries-edit.sql`, `entries-delete.sql`, `photos.sql`, `photos-replace.sql`, then the review gate (`review-gate.sql`, with your own account id and the policy names fixed as its header explains), `entries-status.sql`, `entries-username-rule.sql`, `entries-reviewer-publish.sql` and `entries-return-note.sql`. Read each file's header first: some say not to run them twice.

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: yes, https://khmer-traditional-dresses-archive.vercel.app (read policy plus the `status = 'published'` filter in `lib/readEntries.js`; tested as a guest in the SQL Editor 2026-11-08, `supabase/entries-return-note-manual-checks.md` check 10)
- A stranger cannot publish their own entry through the page or the console: yes, tested 2026-10-25 (`update` refused with 42501, `review_entry` returned `false`) and 2026-11-07 (adding as `published` refused with 42501). See `supabase/entries-status-manual-checks.md` and `supabase/entries-reviewer-publish-manual-checks.md`
- Logged out, the API returns nothing pending or returned: yes, tested 2026-11-08 as `anon` in the SQL Editor (check 10). UNSURE: repeat with a `curl` to the REST API using only the publishable key, and put the date here
- Contributors can edit and delete only their own entries: yes, tested 2026-10-09 (`supabase/entries-manual-checks.md`, Results)
- No secrets anywhere in the repo history: yes, checked 2026-11-17 by searching `git log --all -p` for Supabase key and JWT patterns (no matches) and confirming no `.env` file was ever committed
- At least eight real entries, each with a credited source: UNSURE, 7 Official records in `data/garments.js` plus (count) Published Contributor entries
- Khmer renders on every screen a user meets, including the queue: yes. The `/cookies` page text is still English only; in Khmer only its toggle changes (`docs/adr/0005`)
- Works at phone width: UNSURE, tested on (device or browser width)
- No test entries, lorem ipsum or TODO comments in shipped pages: UNSURE. No TODO or lorem ipsum in `app/`, `components/` or `lib/`; check the live database for test entries
- No console errors on the main pages: UNSURE, check `/`, `/contribute`, `/review` and `/login` in DevTools
- jesseorndorff is a collaborator on this repo: yes (checked through the GitHub API 2026-11-17)
- Supabase project restored and awake on (date)
- Demo video link opens in a private window: UNSURE, (link)
- Reflection pasted in the Canvas submission: UNSURE
- Posted in the Show Your Archive discussion: UNSURE
- Q&A slot booked for (date and time)
