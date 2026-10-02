# Khmer Living Archive

A public archive documenting Khmer traditional dresses. It holds two kinds of entry: a small curated set describing types of dress, and entries that account holders contribute about specific dresses they commissioned.

## Language

**Entry**:
Anything published in the archive. Umbrella term for both an Official record and a Contributor entry.
_Avoid_: Post, item, listing

**Official record**:
A curated Entry describing a type of dress (for example Sampot Hol), written by the Curator and published with the website itself. Contributors cannot add to, edit, or own these.
_Avoid_: Garment entry, catalogue entry, static entry

**Contributor entry**:
An Entry in which one Contributor tells the story of one specific dress they ordered or had custom made. The Contributor owns it.
_Avoid_: Post, contributor post, submission, community post

**Garment**:
A type of dress, such as Sampot Hol or Av Pak. Only Official records describe garments; a Contributor entry is about a particular dress, never "a garment".
_Avoid_: Using "garment" for a single commissioned dress

**Curator**:
The person who owns and runs the archive (configured in `collection.config.js`). Authors the Official records, and can hide or delete any Contributor entry. Is also a Contributor, whose own entries follow the same rules as anyone's.
_Avoid_: Owner, admin, moderator

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

**Source**:
The archive-level origin of the Curator's knowledge: the tailor the archive documents, configured as `source` in `collection.config.js`. Not the same as Provenance, which belongs to one dress.
_Avoid_: Provenance (for the archive as a whole)

**Making-process map**:
The Curator's outline of the stages of making a dress, documented from the tailor's account. It belongs to the archive, not to any single Entry.
_Avoid_: Process steps, timeline

## Entry lifecycle

**Draft**:
A Contributor entry visible only to its Contributor, not yet public.
_Avoid_: Pending, unpublished

**Published**:
A Contributor entry visible to everyone, with no approval step before it goes live.
_Avoid_: Approved, live

**Hidden**:
A Published Contributor entry the Curator has taken down from public view. The Contributor still owns it.
_Avoid_: Deleted, removed, rejected
