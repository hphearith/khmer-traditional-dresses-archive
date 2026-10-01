# Contributor post pool planning

**Status:** Paused while requirements decisions are open.

The eight official records in `data/garments.js` remain curated website content
and are published through website code deployments. They are not migrated,
contributor-owned, or mixed with future posts. Supabase Auth is implemented for
contributor accounts.

Contributor posts about contributors' own ordered or custom-made traditional
dresses are a separate, unimplemented pool. No post schema, table name, SQL,
media storage, access rules, or post workflow has been approved or implemented.

## Decisions to revise before implementation

- **Purpose and audience:** What are posts for, and who should read or contribute
  them?
- **Minimum post fields:** What information must each post contain?
- **Photo/media and consent:** What media may contributors submit, what consent
  is required, and how should media be handled?
- **Ownership, editing, and deletion:** Who owns a post, who may edit or delete
  it, and what happens to it when an account is removed?
- **Draft, review, and publish:** Which states and transitions are needed, and
  who has authority to review and publish?
- **Public visibility and search:** Which posts are public, and how should
  readers discover or search them?
- **Moderation, privacy, and retention:** What moderation and privacy controls
  apply, and what content is retained or removed, and when?

## Resume gate

Begin implementation only after the decisions above are recorded and approved.
Use the approved requirements to define the separate contributor-post data,
access, media, and publication behavior before writing database or application
code.
