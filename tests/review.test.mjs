import assert from "node:assert/strict";
import test from "node:test";
import { decideOnEntry, readIsReviewer, readReviewQueue } from "../lib/review.js";

const ok = (data) => ({ data, error: null });

// A stand-in for the Supabase client. It records every call the code makes and
// answers from canned results: is_reviewer's answer, and one { data, error }
// per table.
function fakeSupabase({ isReviewer, tables = {} }) {
  const calls = [];
  const selected = [];
  const from = (table) => {
    const query = {
      select: (columns) => (selected.push([table, columns]), query),
      eq: (column, value) => (calls.push([table, "eq", column, value]), query),
      in: (column, values) => (calls.push([table, "in", column, values]), query),
      order: (column, options) => (calls.push([table, "order", column, options]), query),
      then: (resolve) => resolve(tables[table]),
    };
    return query;
  };
  const rpc = (name, args) => (calls.push(["rpc", name, args]), Promise.resolve(isReviewer));
  const storage = { from: () => ({ getPublicUrl: (path) => ({ data: { publicUrl: `https://photos/${path}` } }) }) };
  return { calls, selected, client: { from, rpc, storage } };
}

const ENTRY_ROW = { id: "e1", owner: "owner-a", title: "សំពត់ហូល", story: "Made by my aunt.", credited_as: null, photo_path: "owner-a/p.jpg", created_at: "2026-10-25T10:00:00.123456+00:00" };
const NAMES = [{ user_id: "owner-a", username: "sokha" }];

const entryCalls = (calls) => calls.filter(([table]) => table === "entries");

test("a Reviewer's queue is the Pending entries, oldest submission first", async () => {
  const { calls, client } = fakeSupabase({ isReviewer: ok(true), tables: { entries: ok([]) } });
  const { access } = await readReviewQueue(client);
  assert.equal(access, "reviewer");
  assert.deepEqual(entryCalls(calls), [
    ["entries", "eq", "status", "pending"],
    ["entries", "order", "created_at", { ascending: true }],
  ]);
});

test("any answer from is_reviewer other than exactly true means not a Reviewer, and no entries are read", async () => {
  for (const answer of [false, null, undefined, "true", 1, {}]) {
    const { calls, client } = fakeSupabase({ isReviewer: ok(answer), tables: { entries: ok([ENTRY_ROW]), usernames: ok(NAMES) } });
    const result = await readReviewQueue(client);
    assert.equal(result.access, "not-reviewer", String(answer));
    assert.deepEqual(result.entries, [], String(answer));
    assert.deepEqual(calls, [["rpc", "is_reviewer", undefined]], `${String(answer)}: only the Reviewer check is made`);
  }
});

test("a failed Reviewer check is a failure, not 'not a Reviewer', and no entries are read", async () => {
  const boom = { code: "PGRST000", message: "Supabase is asleep" };
  // Even an answer of true is not trusted when the call also reports an error.
  for (const answer of [null, true]) {
    const { calls, client } = fakeSupabase({ isReviewer: { data: answer, error: boom }, tables: { entries: ok([ENTRY_ROW]), usernames: ok(NAMES) } });
    const result = await readReviewQueue(client);
    assert.equal(result.access, "failed", String(answer));
    assert.deepEqual(result.entries, [], String(answer));
    assert.equal(result.error, boom, String(answer));
    assert.deepEqual(calls, [["rpc", "is_reviewer", undefined]], `${String(answer)}: only the Reviewer check is made`);
  }
});

test("a queue read that fails is a failure with no entries, never an empty queue", async () => {
  const boom = { code: "57014", message: "timeout" };
  const failures = {
    "the entries read": { entries: { data: null, error: boom } },
    "the Credit lookup": { entries: ok([ENTRY_ROW]), usernames: { data: null, error: boom } },
  };
  for (const [name, tables] of Object.entries(failures)) {
    const { client } = fakeSupabase({ isReviewer: ok(true), tables });
    const result = await readReviewQueue(client);
    assert.equal(result.access, "failed", name);
    assert.deepEqual(result.entries, [], name);
    assert.equal(result.error, boom, name);
  }
});

test("each queue entry carries its Credit, photo address and submitted time, with a Khmer title unchanged", async () => {
  const rows = [
    ENTRY_ROW,
    { id: "e2", owner: "owner-b", title: "ឈុតអាពាហ៍ពិពាហ៍ <b>2019</b>", story: "ប្រលោមលោក", credited_as: "អ្នកស្រី សុភា", photo_path: null, created_at: "2026-10-26T01:00:00+00:00" },
  ];
  const names = [...NAMES, { user_id: "owner-b", username: "dara" }];
  const { client } = fakeSupabase({ isReviewer: ok(true), tables: { entries: ok(rows), usernames: ok(names) } });

  const { access, entries, error } = await readReviewQueue(client);

  assert.equal(access, "reviewer");
  assert.equal(error, undefined);
  // The order is the database's: the query asked for oldest first.
  assert.deepEqual(entries.map((entry) => entry.id), ["e1", "e2"]);
  assert.equal(entries[0].title, "សំពត់ហូល");
  assert.equal(entries[0].credit, "@sokha");
  assert.equal(entries[0].photo_url, "https://photos/owner-a/p.jpg");
  assert.equal(entries[0].created_at, "2026-10-25T10:00:00.123456+00:00");
  // The "credited as" text wins over the Username, and is shown as written.
  assert.equal(entries[1].title, "ឈុតអាពាហ៍ពិពាហ៍ <b>2019</b>");
  assert.equal(entries[1].credit, "អ្នកស្រី សុភា");
  assert.equal(entries[1].photo_url, null);
  // Only the Credit is shown, never the account behind it.
  assert.equal("owner" in entries[0], false);
});

test("the queue asks for everything its cards show, including when each entry was submitted", async () => {
  // The fake hands back whatever row it is given, so without this a query that forgot
  // created_at would pass every other test and then fail on the page, which dates each card.
  const { selected, client } = fakeSupabase({ isReviewer: ok(true), tables: { entries: ok([]) } });
  await readReviewQueue(client);
  const [[, columns]] = selected.filter(([table]) => table === "entries");
  const asked = columns.split(",").map((column) => column.trim());
  for (const column of ["id", "owner", "title", "story", "credited_as", "photo_path", "created_at"]) {
    assert.equal(asked.includes(column), true, column);
  }
});

// A stand-in for the client when a Reviewer decides. rpc answers with the
// canned { data, error }; every call is recorded, and a table is never available:
// touching one fails the test, because a refused direct update raises no error.
function fakeDecisionClient(answer) {
  const calls = [];
  const client = {
    rpc: (name, args) => (calls.push(["rpc", name, args]), Promise.resolve(answer)),
    from: (table) => { throw new Error(`The decision must not touch the ${table} table.`); },
  };
  return { calls, client };
}

test("a decision asks review_entry with the entry's id and the decision, and never touches the entries table", async () => {
  for (const decision of ["published", "returned"]) {
    const { calls, client } = fakeDecisionClient(ok(true));
    await decideOnEntry(client, "e1", decision);
    assert.deepEqual(calls, [["rpc", "review_entry", { entry_id: "e1", decision }]], decision);
  }
});

test("a decision counts as made when review_entry answers exactly true", async () => {
  const { client } = fakeDecisionClient(ok(true));
  assert.equal(await decideOnEntry(client, "e1", "published"), true);
});

test("any answer from review_entry other than exactly true means the decision was not made", async () => {
  // false is how review_entry refuses (not a Reviewer, or the entry is no longer Pending).
  for (const answer of [false, null, undefined, "true", 1, {}]) {
    const { client } = fakeDecisionClient(ok(answer));
    assert.equal(await decideOnEntry(client, "e1", "published"), false, String(answer));
  }
});

test("an error means the decision was not made, even when data says true", async (t) => {
  t.mock.method(console, "error", () => {});
  const boom = { code: "PGRST000", message: "Supabase is asleep" };
  for (const data of [null, true]) {
    const { client } = fakeDecisionClient({ data, error: boom });
    assert.equal(await decideOnEntry(client, "e1", "returned"), false, String(data));
  }
});

// The home page header shows the Review queue link only when this answers true.
// fakeDecisionClient fits: it answers rpc from a canned result, records every
// call, and fails the test if a table is touched.
const SIGNED_IN = { id: "owner-a" };

test("a signed-in Reviewer sees the link, and only is_reviewer is asked", async () => {
  const { calls, client } = fakeDecisionClient(ok(true));
  assert.equal(await readIsReviewer(client, SIGNED_IN), true);
  assert.deepEqual(calls, [["rpc", "is_reviewer", undefined]]);
});

test("a guest never sees the link, and no call is made for them", async () => {
  for (const guest of [null, undefined]) {
    const { calls, client } = fakeDecisionClient(ok(true));
    assert.equal(await readIsReviewer(client, guest), false, String(guest));
    assert.deepEqual(calls, [], `${String(guest)}: guests trigger no extra call`);
  }
});

test("an error hides the link, even when data says true", async (t) => {
  t.mock.method(console, "error", () => {});
  const boom = { code: "PGRST000", message: "Supabase is asleep" };
  for (const data of [null, true]) {
    const { client } = fakeDecisionClient({ data, error: boom });
    assert.equal(await readIsReviewer(client, SIGNED_IN), false, String(data));
  }
});

test("any answer from is_reviewer other than exactly true hides the link", async () => {
  for (const answer of [false, null, undefined, "true", 1, {}]) {
    const { client } = fakeDecisionClient(ok(answer));
    assert.equal(await readIsReviewer(client, SIGNED_IN), false, String(answer));
  }
});
