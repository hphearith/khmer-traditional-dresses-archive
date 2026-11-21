import assert from "node:assert/strict";
import test from "node:test";
import { ENTRY_COLUMNS, readCommunityEntries, readMyEntries, readPendingEntries } from "../lib/readEntries.js";

// A stand-in for the Supabase client: it records filters, sorting and selected
// columns, and answers with the rows given for that table. Each entry row
// carries its owner's Username as the database embeds it.
function fakeSupabase(tables) {
  const calls = [];
  const selected = [];
  const from = (table) => {
    const query = {
      select: (columns) => (selected.push([table, columns]), query),
      order: (column, options) => (calls.push([table, "order", column, options]), query),
      in: (column, values) => (calls.push([table, "in", column, values]), query),
      eq: (column, value) => (calls.push([table, "eq", column, value]), query),
      then: (resolve) => resolve({ data: tables[table], error: null }),
    };
    return query;
  };
  const storage = { from: () => ({ getPublicUrl: (path) => ({ data: { publicUrl: `https://photos/${path}` } }) }) };
  return { calls, selected, client: { from, storage } };
}

const ROW = { id: "e1", owner: "owner-a", title: "សំពត់ហូល", story: "Made by my aunt.", credited_as: null, photo_path: "owner-a/p.jpg", status: "pending", usernames: { username: "sokha" } };

test("the Community reads published entries only, newest first, even for a viewer who could see more", async () => {
  const { calls, client } = fakeSupabase({ entries: [] });
  await readCommunityEntries(client, "owner-a");
  assert.deepEqual(calls.filter(([table]) => table === "entries"), [
    ["entries", "eq", "status", "published"],
    ["entries", "order", "created_at", { ascending: false }],
  ]);
});

test("My entries reads the signed-in account's own entries newest first and keeps the status", async () => {
  const { calls, client } = fakeSupabase({ entries: [ROW] });
  const { entries, error } = await readMyEntries(client, "owner-a");
  assert.equal(error, null);
  assert.deepEqual(calls.filter(([table]) => table === "entries"), [
    ["entries", "eq", "owner", "owner-a"],
    ["entries", "order", "created_at", { ascending: false }],
  ]);
  assert.equal(entries[0].status, "pending");
  assert.equal(entries[0].mine, true);
  assert.equal(entries[0].credit, "@sokha");
  // Khmer is shown as stored.
  assert.equal(entries[0].title, "សំពត់ហូល");
});

// The columns the entries table was read with, one name each.
const entryColumns = (selected) => {
  const [[, columns]] = selected.filter(([table]) => table === "entries");
  return columns.split(",").map((column) => column.trim());
};

test("My entries reads each entry's Return note, so a Returned entry can show it", async () => {
  const returned = { ...ROW, status: "returned", return_note: "សូមបន្ថែមឆ្នាំ។\nAdd the year." };
  const { selected, client } = fakeSupabase({ entries: [returned] });
  const { entries } = await readMyEntries(client, "owner-a");
  assert.equal(entryColumns(selected).includes("return_note"), true);
  // Handed to the page exactly as stored.
  assert.equal(entries[0].return_note, "សូមបន្ថែមឆ្នាំ។\nAdd the year.");
});

test("the Community never asks for a Return note", async () => {
  const { selected, client } = fakeSupabase({ entries: [] });
  await readCommunityEntries(client, "owner-a");
  assert.equal(entryColumns(selected).includes("return_note"), false);
  // The shared list stays without it too, since the Community reads exactly that list.
  assert.equal(ENTRY_COLUMNS.split(",").map((column) => column.trim()).includes("return_note"), false);
});

test("each list reads its entries and their Credits in one request, never a second one to usernames", async () => {
  const other = { ...ROW, id: "e2", owner: "owner-b", credited_as: "ម្ដាយខ្ញុំ", usernames: { username: "dara" } };
  for (const read of [readCommunityEntries, readMyEntries, readPendingEntries]) {
    const { selected, client } = fakeSupabase({ entries: [ROW, other] });
    const { entries, error } = await read(client, "owner-a");
    assert.equal(error, null, read.name);
    assert.deepEqual(selected.map(([table]) => table), ["entries"], read.name);
    assert.equal(entryColumns(selected).includes("usernames(username)"), true, read.name);
    // The owner's current Username, unless the entry names its own Credit.
    assert.deepEqual(entries.map((entry) => entry.credit), ["@sokha", "ម្ដាយខ្ញុំ"], read.name);
    // The embedded Username, like the owner's id, never reaches the page.
    assert.equal("usernames" in entries[0] || "owner" in entries[0], false, read.name);
  }
});

test("an owner with no Username gives no Credit, rather than failing the list", async () => {
  const { client } = fakeSupabase({ entries: [{ ...ROW, usernames: null }] });
  const { entries, error } = await readCommunityEntries(client);
  assert.equal(error, null);
  assert.equal(entries[0].credit, null);
});
