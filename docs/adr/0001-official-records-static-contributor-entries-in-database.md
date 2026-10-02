# Official records stay static; Contributor entries live in the database

The 8 Official records stay in `data/garments.js` and change only through website deployments. They describe types of dress, which outsiders cannot meaningfully contribute to, so a database would add cost without benefit. Contributor entries (a person's story of one commissioned dress) are the contribution the archive's accounts exist for, so they are database-backed and owned by their Contributor. The two kinds are shown in separate tabs on `/` and never share a table, search, or ownership model.

## Considered Options

- **Migrate the 8 Official records into Supabase** (the original plan). Rejected: nothing would own or edit them except the Curator, and contributors have nothing to add to a description of a dress type. The migration was retired.
- **Mix both kinds in one table with a `kind` column.** Rejected: ownership, editing, and publishing rules differ completely, and Official search (`lib/garmentSearch.js`) would have to learn about contributor data.

## Consequences

- The course skeleton's "own-your-entries" (Sprint 2) and "submit-review-publish" (Sprint 3) features apply to Contributor entries only.
- The Sprint 1 brief says "Sprint 2 changes how entries are stored", which assumes the collection's own entries move into storage. This design keeps them in code and satisfies "you own only your own entries" through Contributor entries instead. That reading is the Curator's and has not been confirmed with the instructor.
- Adding or correcting an Official record requires a code change and deploy.
