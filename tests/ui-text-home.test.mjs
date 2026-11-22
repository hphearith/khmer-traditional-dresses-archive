import assert from "node:assert/strict";
import test from "node:test";
import { isPair } from "../lib/bilingual.js";
import collection from "../collection.config.js";
import { TEXT, archiveMetadataText, bylineText, countText, emptyEntriesText, emptyGarmentsText, heroCaptionText, identityText } from "../lib/uiText.js";

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
  assert.equal(text.km.includes(`«${query}»`), true);
});

test("the source line names the curator in both languages", () => {
  const text = bylineText("Heng Phearith");
  assert.equal(text.en, "Source recorded by Heng Phearith");
  assert.match(text.km, /Heng Phearith/);
  assert.match(text.km, KHMER);
});

test("the hero caption names the garment in both languages and keeps maker and place as stored", () => {
  const text = heroCaptionText({ nameEn: "Av Chang Pong", nameKh: "អាវចងពង់", maker: "Apsara Mode Tailor", place: "Phnom Penh" });
  assert.equal(text.en, "Av Chang Pong, made by Apsara Mode Tailor in Phnom Penh.");
  assert.equal(text.km, "អាវចងពង់ ផលិតដោយ Apsara Mode Tailor នៅ Phnom Penh។");
});

// Each heading speaks for itself (#100): no small label above the hero, the
// catalogue or the About banner. The Community tab's own name stays.
test("the home page has no labels above its headings", async () => {
  const { TEXT } = await import("../lib/uiText.js");
  assert.equal(TEXT.home.heroLabel, undefined);
  assert.equal(TEXT.home.aboutLabel, undefined);
  assert.equal(TEXT.catalogue.label, undefined);
  assert.ok(TEXT.tabs.community);
});

test("archive metadata follows the interface language and uses the configured identity", () => {
  assert.deepEqual(archiveMetadataText(collection, "km"), {
    title: `${collection.nameKm} — បណ្ណសារខ្មែរមានជីវិត`,
    description: collection.descriptionKm,
  });
  assert.deepEqual(archiveMetadataText(collection, "en"), {
    title: `${collection.name} — Khmer Living Archive`,
    description: collection.description,
  });
});

test("public counts and search examples pair plain Khmer with Latin digits and three dots", () => {
  assert.equal(countText(0, 1).km, "បង្ហាញ 0 ក្នុងចំណោម 1 កំណត់ត្រា");
  assert.equal(countText(1200, 3000).km, "បង្ហាញ 1,200 ក្នុងចំណោម 3,000 កំណត់ត្រា");
  assert.equal(TEXT.catalogue.placeholder.km, "សំពត់ សូត្រ...");
  assert.equal(TEXT.community.placeholder.km, "ចំណងជើង ទីកន្លែង...");
});

test("record metadata preserves the exact title supplied by its author", () => {
  const title = "រឿងរ៉ាវ {{title}}";
  assert.equal(archiveMetadataText(collection, "km", title).title, `${title} — ${collection.nameKm}`);
  assert.equal(archiveMetadataText(collection, "en", title).title, `${title} — ${collection.name}`);
});
