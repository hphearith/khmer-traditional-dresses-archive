import assert from "node:assert/strict";
import test from "node:test";
import { filterEntries } from "../lib/entrySearch.js";

// Contributor entries in the shape readCommunityEntries returns.
const entries = [
  { id: "a", title: "My wedding sampot hol", story: "Ordered for my sister's wedding in Siem Reap.", credit: "@sokha", maker: "Aunt Srey", place: "Battambang", materials: "Silk" },
  { id: "b", title: "សំពត់ផាមួងរបស់ម្តាយ", story: "ម្តាយខ្ញុំបានកាត់ដេរសម្រាប់ពិធីបុណ្យ", credit: "Dara", maker: "ម្ចាស់ហាង សុភាព", place: "ភ្នំពេញ", materials: "សូត្រមាស" },
  { id: "c", title: "Pchum Ben blouse", story: "A plain cotton blouse.", credit: "@vanna", maker: null, place: null, materials: null },
];

const search = (query) => filterEntries(entries, query).map((entry) => entry.id);

test("an empty search shows every entry", () => {
  assert.deepEqual(search(""), ["a", "b", "c"]);
  assert.deepEqual(search("   "), ["a", "b", "c"]);
});

test("a word in the title finds the entry, whatever its letter case", () => {
  assert.deepEqual(search("WEDDING"), ["a"]);
});

test("title, story, Credit, maker, place and materials are all searched", () => {
  assert.deepEqual(search("blouse"), ["c"]); // title
  assert.deepEqual(search("sister's"), ["a"]); // story
  assert.deepEqual(search("@vanna"), ["c"]); // Credit
  assert.deepEqual(search("srey"), ["a"]); // maker
  assert.deepEqual(search("battambang"), ["a"]); // place
  assert.deepEqual(search("silk"), ["a"]); // materials
});

test("a search that matches nothing returns no entries, and empty fields never match", () => {
  assert.deepEqual(search("zzz"), []);
  assert.deepEqual(search("null"), []);
  assert.deepEqual(search("undefined"), []);
});

test("every word must match, in any order and any field", () => {
  assert.deepEqual(search("sampot wedding"), ["a"]);
  assert.deepEqual(search("srey wedding battambang"), ["a"]);
  assert.deepEqual(search("wedding blouse"), []);
});

test("a quoted phrase stays together", () => {
  assert.deepEqual(search('"wedding in siem"'), ["a"]);
  assert.deepEqual(search('"siem wedding"'), []);
});

test("Khmer text is found in every searched field", () => {
  assert.deepEqual(search("ផាមួង"), ["b"]); // title
  assert.deepEqual(search("បុណ្យ"), ["b"]); // story
  assert.deepEqual(search("សុភាព"), ["b"]); // maker
  assert.deepEqual(search("ភ្នំពេញ"), ["b"]); // place
  assert.deepEqual(search("សូត្រមាស"), ["b"]); // materials
});

test("a Khmer phrase stays together", () => {
  assert.deepEqual(search('"ម្តាយខ្ញុំ"'), ["b"]);
  assert.deepEqual(search('"ខ្ញុំម្តាយ"'), []);
});

test("Khmer and English words can be searched together", () => {
  assert.deepEqual(search("ភ្នំពេញ dara"), ["b"]);
  assert.deepEqual(search("សូត្រមាស blouse"), []);
});
