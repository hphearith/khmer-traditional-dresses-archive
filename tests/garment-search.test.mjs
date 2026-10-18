import assert from "node:assert/strict";
import test from "node:test";
import { filterGarments } from "../lib/garmentSearch.js";

// Official records in the shape of data/garments.js.
const garments = [
  { id: "hol", nameEn: "Sampot Hol", nameKh: "សំពត់ហូល", category: "lower", material: "Chong Kiet Tie-Dyed Silk (សូត្រចងគៀត)", description: "A renowned wrap skirt." },
  { id: "chang", nameEn: "Sampot Chang Kben", nameKh: "សំពត់ចងក្បិន", category: "lower", material: "Khmer Golden Silk (សូត្រមាស)", description: "Twisted between the legs." },
  { id: "pak", nameEn: "Av Pak", nameKh: "អាវផាក", category: "upper", material: "Cotton", description: "A fitted blouse." },
];

const ids = (list) => list.map((garment) => garment.id);
const search = (query, activeTab = "all") => ids(filterGarments(garments, { activeTab, query }));

test("an empty search shows every garment", () => {
  assert.deepEqual(search(""), ["hol", "chang", "pak"]);
  assert.deepEqual(search("   "), ["hol", "chang", "pak"]);
});

test("the Official search reads English name, Khmer name, material and description", () => {
  assert.deepEqual(search("av pak"), ["pak"]);
  assert.deepEqual(search("សំពត់ហូល"), ["hol"]);
  assert.deepEqual(search("cotton"), ["pak"]);
  assert.deepEqual(search("blouse"), ["pak"]);
});

test("matching ignores letter case", () => {
  assert.deepEqual(search("SAMPOT hol"), ["hol"]);
});

test("every word must match, in any order and any field", () => {
  assert.deepEqual(search("sampot silk"), ["hol", "chang"]);
  assert.deepEqual(search("silk sampot golden"), ["chang"]);
  assert.deepEqual(search("sampot cotton"), []);
});

test("a quoted phrase stays together", () => {
  assert.deepEqual(search('"sampot hol"'), ["hol"]);
  assert.deepEqual(search('"hol sampot"'), []);
});

test("a Khmer word and an English word can be searched together", () => {
  assert.deepEqual(search("សំពត់ golden"), ["chang"]);
});

test("an unclosed quote counts as an ordinary word", () => {
  assert.deepEqual(search('"sampot hol'), ["hol"]);
});

test("the category tab narrows the keyword results", () => {
  assert.deepEqual(search("", "upper"), ["pak"]);
  assert.deepEqual(search("sampot", "lower"), ["hol", "chang"]);
  assert.deepEqual(search("sampot", "upper"), []);
});
