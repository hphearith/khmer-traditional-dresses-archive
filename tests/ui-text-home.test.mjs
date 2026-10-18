import assert from "node:assert/strict";
import test from "node:test";
import { isPair } from "../lib/bilingual.js";
import collection from "../collection.config.js";
import { bylineText, countText, emptyEntriesText, emptyGarmentsText, identityText } from "../lib/uiText.js";

const KHMER = /[ក-៿]/;

test("the archive's name, description and source each have a Khmer text in collection.config.js", () => {
  const identity = identityText(collection);
  for (const field of ["name", "description", "source"]) {
    assert.equal(isPair(identity[field]), true, field);
    assert.match(identity[field].km, KHMER, field);
    // The English is what the config says, untouched.
    assert.equal(identity[field].en, collection[field], field);
  }
});

test("a config without a Khmer text is refused instead of showing half an identity", () => {
  assert.throws(() => identityText({ name: "A", description: "B", source: "C", nameKm: "ក" }), /Khmer/);
});

test("the count line keeps today's English and carries both numbers in Khmer", () => {
  const text = countText(3, 8);
  assert.equal(text.en, "showing 3 of 8 entries");
  assert.match(text.km, /3.*8/);
  assert.match(text.km, KHMER);
});

test("the garment empty state names the category in both languages and keeps the search as typed", () => {
  const expected = {
    all: "No garments match “sampot”. Try a different name or material.",
    lower: "No lower body garments match “sampot”. Try a different name or material.",
    upper: "No upper body garments match “sampot”. Try a different name or material.",
    ensemble: "No ensembles match “sampot”. Try a different name or material.",
  };
  for (const [tab, en] of Object.entries(expected)) {
    const text = emptyGarmentsText(tab, "  sampot ");
    assert.equal(text.en, en, tab);
    assert.match(text.km, /sampot/, tab);
    assert.match(text.km, KHMER, tab);
  }
});

test("the entry empty state keeps today's English and carries a Khmer search through unchanged", () => {
  const query = "សំពត់ហូល";
  const text = emptyEntriesText(` ${query} `);
  assert.equal(text.en, `No entries match “${query}”. Try a different word, or search in English or Khmer.`);
  assert.equal(text.km.includes(`“${query}”`), true);
});

test("the source line names the curator in both languages", () => {
  const text = bylineText("Heng Phearith");
  assert.equal(text.en, "Source recorded by Heng Phearith");
  assert.match(text.km, /Heng Phearith/);
  assert.match(text.km, KHMER);
});
