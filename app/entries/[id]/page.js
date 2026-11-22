import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import collection from "../../../collection.config.js";
import Bilingual from "../../../components/Bilingual.js";
import EntryRecord from "../../../components/EntryRecord.js";
import { isEntryId } from "../../../lib/entryPages.js";
import { getLanguage } from "../../../lib/getLanguage.js";
import { readEntry } from "../../../lib/readEntries.js";
import { createClient } from "../../../lib/supabase/server.js";
import { TEXT, archiveMetadataText, submittedText } from "../../../lib/uiText.js";
import { readVisitor } from "../../../lib/visitor.js";

export const dynamic = "force-dynamic";

// One read per request, shared by the tab title and the page.
const loadEntry = cache(async (id) => {
  const supabase = await createClient();
  const user = await readVisitor(supabase);
  return readEntry(supabase, id, user?.id);
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!isEntryId(id)) return {};
  const { entry } = await loadEntry(id);
  return entry ? archiveMetadataText(collection, await getLanguage(), entry.title) : {};
}

// One page per Contributor entry, such as /entries/0b9c7a52-…. It reads with
// the visitor's own access, so the database decides who may see it.
export default async function EntryPage({ params }) {
  const { id } = await params;
  if (!isEntryId(id)) notFound();
  const { entry, error } = await loadEntry(id);
  if (error) console.error("Reading a Contributor entry failed:", error);
  if (!entry && !error) notFound();

  return (
    <main className="container record-page" data-record-title={entry?.title}>
      <Link className="back-link" href="/?tab=community"><Bilingual text={TEXT.page.backToCommunity} inline /></Link>
      {error ? (
        <div className="empty" role="alert">
          <h1 className="record-title"><Bilingual text={TEXT.community.loadFailed} /></h1>
          <p><Bilingual text={TEXT.community.loadFailedHelp} /></p>
        </div>
      ) : (
        <EntryRecord entry={entry} submitted={submittedText(entry.created_at)} />
      )}
    </main>
  );
}
