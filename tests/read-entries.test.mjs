import assert from "node:assert/strict";
import test from "node:test";
import { readCommunityEntries, readMyEntries } from "../lib/readEntries.js";

// A stand-in for the Supabase client: it records every filter a query adds and
// answers with the rows given for that table.
function fakeSupabase(tables) {
  const calls = [];
  const from = (table) => {
    const query = {
      select: () => query,
      order: () => query,
      in: (column, values) => (calls.push([table, "in", column, values]), query),
      eq: (column, value) => (calls.push([table, "eq", column, value]), query),
      then: (resolve) => resolve({ data: tables[table], error: null }),
    };
    return query;
  };
  const storage = { from: () => ({ getPublicUrl: (path) => ({ data: { publicUrl: `https://photos/${path}` } }) }) };
  return { calls, client: { from, storage } };
}

const ROW = { id: "e1", owner: "owner-a", title: "សំពត់ហូល", story: "Made by my aunt.", credited_as: null, photo_path: "owner-a/p.jpg", status: "pending" };
const NAMES = [{ user_id: "owner-a", username: "sokha" }];

test("the Community reads published entries only, even for a viewer who could see more", async () => {
  const { calls, client } = fakeSupabase({ entries: [], usernames: NAMES });
  await readCommunityEntries(client, "owner-a");
  assert.deepEqual(calls.filter(([table]) => table === "entries"), [["entries", "eq", "status", "published"]]);
});

test("My entries reads the signed-in account's own entries, in every status, with the status kept", async () => {
  const { calls, client } = fakeSupabase({ entries: [ROW], usernames: NAMES });
  const { entries, error } = await readMyEntries(client, "owner-a");
  assert.equal(error, null);
  assert.deepEqual(calls.filter(([table]) => table === "entries"), [["entries", "eq", "owner", "owner-a"]]);
  assert.equal(entries[0].status, "pending");
  assert.equal(entries[0].mine, true);
  assert.equal(entries[0].credit, "@sokha");
  // Khmer is shown as stored.
  assert.equal(entries[0].title, "សំពត់ហូល");
});
