import assert from "node:assert/strict";
import test from "node:test";
import { getEntryMessage, getSaveFailureMessage, resolveCredit, validateEntry } from "../lib/entry.js";

const YEAR = { currentYear: 2026 };

test("an entry with only a title and a story is accepted, with every optional field omitted", () => {
  assert.deepEqual(validateEntry({ title: "My wedding sampot", story: "Made by my aunt." }, YEAR), {
    ok: true,
    entry: {
      title: "My wedding sampot",
      story: "Made by my aunt.",
      credited_as: null,
      occasion: null,
      year: null,
      maker: null,
      place: null,
      materials: null,
    },
  });
});

test("every optional field is kept when given, and the year becomes a number", () => {
  const input = {
    title: "Sampot Hol for my sister's wedding",
    story: "We chose the pattern together.",
    credited_as: "Sokha's family",
    occasion: "Wedding",
    year: "2019",
    maker: "Ms. Chan Thy",
    place: "Takeo",
    materials: "Hand-woven silk",
  };
  assert.deepEqual(validateEntry(input, YEAR), { ok: true, entry: { ...input, year: 2019 } });
});

test("an empty form reports each required field as required", () => {
  assert.deepEqual(validateEntry({}, YEAR), { ok: false, errors: { title: "required", story: "required" } });
  assert.deepEqual(validateEntry({ title: "   ", story: "Made by my aunt." }, YEAR), {
    ok: false,
    errors: { title: "required" },
  });
});

test("each text field is accepted at its approved limit and refused one character over", () => {
  const limits = { title: 120, story: 5000, credited_as: 50, occasion: 100, maker: 100, place: 100, materials: 200 };
  for (const [field, limit] of Object.entries(limits)) {
    const atLimit = validateEntry({ title: "t", story: "s", [field]: "a".repeat(limit) }, YEAR);
    assert.equal(atLimit.ok, true, `${field} at ${limit}`);
    const over = validateEntry({ title: "t", story: "s", [field]: "a".repeat(limit + 1) }, YEAR);
    assert.deepEqual(over, { ok: false, errors: { [field]: "too-long" } }, `${field} at ${limit + 1}`);
  }
});

test("a 5,000-character title is refused", () => {
  assert.deepEqual(validateEntry({ title: "a".repeat(5000), story: "s" }, YEAR).errors, { title: "too-long" });
});

test("limits count characters, not bytes or UTF-16 units", () => {
  // ក is 3 bytes in UTF-8; 😀 is 2 UTF-16 units. Each is one character.
  assert.equal(validateEntry({ title: "ក".repeat(120), story: "s" }, YEAR).ok, true);
  assert.equal(validateEntry({ title: "😀".repeat(120), story: "s" }, YEAR).ok, true);
  assert.equal(validateEntry({ title: "ក".repeat(121), story: "s" }, YEAR).ok, false);
});

test("a long real Khmer title within 120 characters is accepted unchanged", () => {
  // Every word is a dress or material name from data/garments.js. 117
  // characters but 333 bytes, full of coeng subscripts and vowel signs.
  const title = "សំលៀកបំពាក់ការប្រពៃណី សំលៀកបំពាក់ទៅវត្ត សំពត់ចងក្បិន សំពត់ផាមួង សំពត់ហូល អាវប៉ាក់ អាវចងពង់ ស្បៃ ក្រណាត់ប៉ាក់ សូត្រមាស";
  const checked = validateEntry({ title, story: "s" }, YEAR);
  assert.equal(checked.ok, true);
  assert.deepEqual(Buffer.from(checked.entry.title, "utf8"), Buffer.from(title, "utf8"));
  assert.deepEqual(validateEntry({ title: `${title} សូត្រ`, story: "s" }, YEAR).errors, { title: "too-long" });
});

test("spaces around a value do not count towards its limit", () => {
  const { entry } = validateEntry({ title: `  ${"a".repeat(120)}  `, story: "s" }, YEAR);
  assert.equal(entry.title, "a".repeat(120));
});

test("Khmer text, combining marks and mixed Khmer and English come back byte-for-byte", () => {
  const input = {
    // ្ (coeng) builds the subscript in ក្បិន; ៉ and ់ are marks on ប៉ាក់.
    title: "សំពត់ចងក្បិន for my graduation",
    story: "ខ្ញុំបានកុម្មង់អាវប៉ាក់​នេះ at a tailor in Phnom Penh.\nសំពត់ហូល too.",
    credited_as: "្ស្បៃ",
    occasion: "ពិធីមង្គលការ wedding",
    maker: "Ms. Chan Thy",
    place: "ភ្នំពេញ",
    materials: "សូត្រ silk​",
  };
  const { entry } = validateEntry(input, YEAR);
  for (const field of Object.keys(input)) {
    assert.deepEqual(Buffer.from(entry[field], "utf8"), Buffer.from(input[field], "utf8"), field);
  }
});

test("only spaces are trimmed: tabs, newlines and zero-width spaces are kept", () => {
  const { entry } = validateEntry({ title: " \tអាវប៉ាក់\n ", story: "​សំពត់ហូល​" }, YEAR);
  assert.equal(entry.title, "\tអាវប៉ាក់\n");
  assert.equal(entry.story, "​សំពត់ហូល​");
});

test("the year is accepted from 1900 to the current year inclusive", () => {
  for (const year of ["1900", "1998", "2026", " 2026 "]) {
    assert.equal(validateEntry({ title: "t", story: "s", year }, YEAR).ok, true, year);
  }
});

test("a year that is not four digits, or outside 1900 to the current year, is refused", () => {
  for (const year of ["1899", "2027", "98", "19980", "19 98", "1998.0", "+998", "-998", "abcd", "១៩៩៨"]) {
    assert.deepEqual(validateEntry({ title: "t", story: "s", year }, YEAR), { ok: false, errors: { year: "invalid" } }, year);
  }
});

test("the current year comes from the clock when it is not given", () => {
  const thisYear = String(new Date().getFullYear());
  assert.equal(validateEntry({ title: "t", story: "s", year: thisYear }).ok, true);
  assert.equal(validateEntry({ title: "t", story: "s", year: String(Number(thisYear) + 1) }).ok, false);
});

test("a missing required field gets a message naming it", () => {
  assert.match(getEntryMessage("title", "required"), /title/i);
  assert.match(getEntryMessage("story", "required"), /story/i);
});

test("an over-long field gets a message giving its limit in characters", () => {
  assert.match(getEntryMessage("title", "too-long"), /title.*120 characters/i);
  assert.match(getEntryMessage("story", "too-long"), /story.*5,000 characters/i);
  assert.match(getEntryMessage("credited_as", "too-long"), /credited as.*50 characters/i);
  assert.match(getEntryMessage("materials", "too-long"), /materials.*200 characters/i);
});

test("an invalid year gets a message giving the allowed range", () => {
  assert.match(getEntryMessage("year", "invalid", YEAR), /digits 0-9 from 1900 to 2026/);
});

test("optional fields left blank, or holding only spaces, are omitted", () => {
  const blank = { credited_as: "", occasion: "   ", year: " ", maker: undefined, place: null, materials: "" };
  const { entry } = validateEntry({ title: "t", story: "s", ...blank }, YEAR);
  for (const field of Object.keys(blank)) assert.equal(entry[field], null, field);
});

test("the Credit is the credited-as text when there is one", () => {
  assert.equal(resolveCredit("Sokha's family", "sokha_88"), "Sokha's family");
  assert.equal(resolveCredit("គ្រួសារសុខា", "sokha_88"), "គ្រួសារសុខា");
});

test("the Credit falls back to the owner's current Username, shown with an @", () => {
  for (const creditedAs of [null, undefined, ""]) {
    assert.equal(resolveCredit(creditedAs, "sokha_88"), "@sokha_88", String(creditedAs));
  }
});

test("a credited-as of only whitespace is treated as absent", () => {
  for (const creditedAs of [" ", "   ", "\t", "\n", " \t\n "]) {
    assert.equal(resolveCredit(creditedAs, "sokha_88"), "@sokha_88", JSON.stringify(creditedAs));
  }
});

test("with neither credited-as nor a Username there is no Credit", () => {
  assert.equal(resolveCredit("", null), null);
});

test("a save the database refuses for the account says how to fix the account, not the connection", () => {
  const message = getSaveFailureMessage({ code: "42501", message: "new row violates row-level security policy" });
  assert.match(message, /log in again/i);
  assert.match(message, /Username/);
  assert.doesNotMatch(message, /connection/i);
});

test("a save the database refuses for its content says to check the fields", () => {
  assert.match(getSaveFailureMessage({ code: "23514", message: "violates check constraint" }), /check each field/i);
});

test("any other failed save suggests checking the connection and never repeats the raw error", () => {
  for (const error of [{ code: "", message: "TypeError: Failed to fetch" }, new Error("boom"), null]) {
    const message = getSaveFailureMessage(error);
    assert.match(message, /connection/i);
    assert.doesNotMatch(message, /fetch|boom/i);
  }
});
