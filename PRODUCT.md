# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** people interested in Khmer history and culture. This is not ranked further.
- **Course audience:** this is an ICT 340 course project at AUPP, so the instructor, graders and classmates are real readers of both the site and the code.
- **Roles in the product** (terms defined in `CONTEXT.md`): guests browse and search without an account; Contributors write, edit and delete their own Contributor entries; Reviewers publish or return Pending entries and nothing more.

## Product Purpose

A public archive of how Khmer traditional dresses are made. Its knowledge comes from the curator's mother, who owns Apsara Mode Tailor in Phnom Penh and has made traditional Khmer dress for over 20 years. It has two parts:

- **Official records:** seven curated types of dress (Sampot Hol, Sampot Phamuong, Av Pak, Sbai, Av Chang Pong, the wedding ensemble and the pagoda ensemble), each with Khmer and English names, material, description, maker and place.
- **Community:** Contributor entries, each telling the story of one specific dress someone ordered or had made, with a photo and optional Provenance. Each entry goes through review before it is public.

Its main job is the ICT 340 deliverable. Success means a working archive the curator can explain and defend line by line in review.

## Positioning

Its knowledge comes first-hand from one working tailor shop, not from general reference material. The interface is Khmer first, and its Khmer has been audited against dictionaries and the Ministry of Culture and Fine Arts' 2026 guidance on traditional dress. Every Official record names its maker and place, and every Contributor entry carries a Credit and optional Provenance.

## Operating Context

- The interface loads in Khmer. A toggle on every page switches to English, and the choice is kept in a `lang` cookie read on the server (`docs/adr/0005`). Official record names show in both languages (`docs/adr/0003`).
- Phones first, on slow connections. The archive serves a Khmer subset of Noto Sans Khmer for interface text and Big Shoulders for the Latin sign lettering. Photos load lazily. Uploads are JPEG, PNG or WebP under 5 MB.
- An entry being written is kept as a Local draft in the browser, so a dropped connection doesn't lose it.
- Contributor flow: write → Pending → a Reviewer Publishes it or Returns it with a Return note → edit and resubmit. Every edit, even of a Published entry, goes back to Pending. A Reviewer's own entries publish on save (`docs/adr/0004`).
- Built in sprints, one GitHub issue per branch, with AI coding agents working under `AGENTS.md`.

## Capabilities and Constraints

- **Built:** browse and search both parts; email/password accounts with confirmation; Usernames (English letters, digits and underscore; 30-day wait between changes); own-your-entries; submit → review → publish with Return notes; Status pills in My entries; photo upload with a consent checkbox; a `/cookies` page.
- **Data rules:** Official records live in `data/garments.js` and change only on deploy (`docs/adr/0001`). Contributor entries live in Supabase, and row-level security plus `review_entry()` enforce every permission. The UI only decides what to show.
- **Technical constraints (from `AGENTS.md`):** Next.js 15 App Router, React 19, JavaScript only; plain React with inline style objects or plain CSS, with no CSS frameworks, component libraries or state libraries; no new dependencies; one component per file in `components/`, about 80 lines at most; the archive's identity is read from `collection.config.js`, never hard-coded; build only what the current task asks.
- **Terminology:** `CONTEXT.md` is the glossary (Entry, Official record, Contributor entry, Garment, Credit, Provenance, Pending/Published/Returned, and so on). Use its terms and avoid its listed alternatives.
- **Undecided / not built:** Reviewers can't take down Published entries. Removing one today means the Supabase SQL Editor.

## Brand Commitments

- Name: "Khmer Traditional Dresses · សម្លៀកបំពាក់ប្រពៃណីខ្មែរ". The name, description, curator (Heng Phearith) and source come from `collection.config.js`.
- Khmer text is first-class content. Never strip, transliterate or "fix" it. Contributor entries and Return notes are shown exactly as written.
- Every Khmer interface string must be read by a Khmer reader (the curator) before it is committed (`docs/adr/0003`, `docs/research/khmer-audit.md`).

## Evidence on Hand

- Seven Official records with photos: `data/garments.js`, `public/images/garments/`.
- Contributor entries and their photos in Supabase (live data, not in the repo).
- The Khmer string audit: `docs/research/khmer-audit.md`.
- Decision records: `docs/adr/0001`–`0005`. Manual check records: `supabase/*-manual-checks.md`, `docs/drafts-manual-checks.md`.
- **Absent, and must not be fabricated:** testimonials, usage numbers, press, partner logos, invented Contributor entries, and lorem ipsum. Sample content comes from real entries only.

## Product Principles

1. **Khmer first, never altered.** Khmer is the default language and first-class content, never an edge case.
2. **Sources are named.** Every piece of knowledge says who it came from: maker, place, Credit, Provenance.
3. **Guests store nothing.** Browsing needs no account and no cookie beyond the language choice. Privacy is explained, not assumed.
4. **Light on the reader.** Phones and slow connections come first, so nothing heavy is added for decoration.
5. **Defensible scope.** Build only what the current task asks, in code the curator can explain line by line.

## Accessibility & Inclusion

- Readers on phones and slow connections; Khmer readers using system Noto Khmer fonts.
- A photo can't be uploaded without confirming the uploader took it or has permission, and that anyone recognisable in it agreed to it being shown publicly.
- No formal accessibility standard (such as a WCAG level) has been set. This is an open decision.
