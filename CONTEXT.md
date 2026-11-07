# Khmer Living Archive

A public archive documenting Khmer traditional dresses. It holds two kinds of entry: a small curated set describing types of dress, and entries that account holders contribute about specific dresses they commissioned.

## Language

**Entry**:
Anything published in the archive. Umbrella term for both an Official record and a Contributor entry.
_Avoid_: Post, item, listing

**Official record**:
A curated Entry describing a type of dress (for example Sampot Hol), written by the archive's owner (named as curator in `collection.config.js`) and published with the website itself. Contributors cannot add to, edit, or own these.
_Avoid_: Garment entry, catalogue entry, static entry

**Contributor entry**:
An Entry in which one Contributor tells the story of one specific dress they ordered or had custom made. The Contributor owns it.
_Avoid_: Post, contributor post, submission, community post

**Garment**:
A type of dress, such as Sampot Hol or Av Pak. Only Official records describe garments; a Contributor entry is about a particular dress, never "a garment".
_Avoid_: Using "garment" for a single commissioned dress

**Reviewer**:
A Contributor on the reviewers list. A Reviewer can publish or return Pending Contributor entries, and nothing more. Being the archive's owner does not make someone a Reviewer, and being a Reviewer does not make someone the owner. A Reviewer's own Contributor entries follow the same rules as anyone's.
_Avoid_: Curator, admin, moderator, approver

**Contributor**:
Anyone with a confirmed account. Contributors can create, edit, and delete their own Contributor entries. Visitors without an account can only read.
_Avoid_: User, member, author

**Username**:
The unique public name a Contributor chooses, written in English characters only and shown with a leading "@". It can be changed, but not again until a waiting period has passed. Never an email address.
_Avoid_: Display name, handle, nickname

**Credit**:
The name shown on a Contributor entry: the optional "credited as" text the Contributor writes on that entry, or their Username if it is left blank.
_Avoid_: Byline, author name

**Provenance**:
The origin of a specific dress: who made it, where, when, and for what occasion. Optional on a Contributor entry.
_Avoid_: History, background

**Local draft**:
The text a Contributor has typed into an entry form and not yet saved, kept in that browser on that device only until the entry is saved. It is not an Entry and it is never sent anywhere. A saved entry that is not yet public is Pending (see Entry lifecycle), not a Local draft.
_Avoid_: Draft (in code and docs; the screen text says "Draft saved"), autosave, backup

**Source**:
The archive-level origin of the owner's knowledge: the tailor the archive documents, configured as `source` in `collection.config.js`. Not the same as Provenance, which belongs to one dress.
_Avoid_: Provenance (for the archive as a whole)

## Entry lifecycle

**Pending**:
A Contributor entry waiting for a Reviewer's decision. Only its Contributor and Reviewers can see it. Every new entry starts Pending, and so does every entry a Contributor edits.
_Avoid_: Draft, submitted, unpublished, in review

**Published**:
A Contributor entry a Reviewer has published. Visible to everyone.
_Avoid_: Approved, live, accepted

**Returned**:
A Contributor entry a Reviewer has sent back to its Contributor. Only its Contributor can see it. Editing and saving it makes it Pending again, in its original place in the Review queue.
_Avoid_: Rejected, declined, hidden

**Review queue**:
Every Pending Contributor entry, oldest submission first, as a Reviewer sees it. A Returned entry that is edited goes back to the place its first submission gave it.
_Avoid_: Inbox, moderation queue, backlog

**My entries**:
The view of the Community in which a signed-in Contributor sees every one of their own Contributor entries, whatever its status, each with a Status pill. It is the one place a Contributor reviews their own entries. Guests never see it.
_Avoid_: My posts, dashboard

**Status pill**:
The small capsule-shaped label on an entry in My entries that names where the entry stands: Pending, Published or Returned.
_Avoid_: Badge, chip, tag
