# Notifications

This archive does not notify Contributors about their Contributor entries. There is no email when an entry is Published or Returned, and there is no in-app mark when an entry's status has changed since the Contributor last looked.

## Why this is out of scope

A Contributor already has one place to see where their entries stand: **My entries**. Every entry there carries a Status pill (Pending, Published or Returned), and a Returned entry also says to edit and save it to send it for review again. The confirmation a Contributor sees after submitting a new entry sends them there:

> Your post has been submitted for review. Check My entries to see when it is published or returned.

Building either kind of notification would add more than it gives this archive:

- **Email** needs something to send it, such as a Supabase database webhook, an Edge Function or an outside mail service. That means setup outside the code, run by a person in a dashboard. It also means secrets kept in `.env.local` and Vercel (AGENTS.md rule 3), and probably a new dependency, which AGENTS.md rule 1 does not allow.
- **An in-app mark** needs the archive to store what each Contributor has already seen. That is new data about Contributors, on top of the entries themselves, kept for nothing more than a reminder that My entries already provides.

If the archive ever needs to reach Contributors outside the site, that is a new decision to make on purpose, not a small addition to the review flow.

## Prior requests

- #44: "The 'you will be notified' promise has nothing behind it". Fixed by rewording the confirmation to point to My entries (#63). Options 2 (email) and 3 (an in-app mark) from that issue are what this file rules out.
