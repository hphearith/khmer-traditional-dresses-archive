import assert from "node:assert/strict";
import test from "node:test";
import { changeWasSaved, characterCount, entryColumns, formValuesFromEntry, getDeleteFailureMessage, getEntryMessage, getSaveFailureMessage, isOwnedBy, isWithinLimit, resolveCredit, validateEntry, yearOptions } from "../lib/entry.js";

const YEAR = { currentYear: 2026 };

test("only the signed-in owner owns an entry; another account or a guest does not", () => {
  assert.equal(isOwnedBy("owner-a", "owner-a"), true);
  assert.equal(isOwnedBy("owner-a", "owner-b"), false);
  for (const guest of [null, undefined, ""]) {
    assert.equal(isOwnedBy("owner-a", guest), false, String(guest));
  }
});

test("an update counts as saved only when the database handed back the changed row", () => {
  assert.equal(changeWasSaved([{ id: "e1" }]), true);
  // A refused update is not an error: the API answers with no rows.
  for (const rows of [[], null, undefined]) {
    assert.equal(changeWasSaved(rows), false, String(rows));
  }
});

test("an insert or update names exactly the eight writable columns and never the owner", () => {
  const { entry } = validateEntry({ title: "My wedding sampot", story: "Made by my aunt.", year: "2019" }, YEAR);
  assert.deepEqual(entryColumns({ ...entry, owner: "someone-else" }), {
    title: "My wedding sampot",
    story: "Made by my aunt.",
    credited_as: null,
    occasion: null,
    year: 2019,
    maker: null,
    place: null,
    materials: null,
  });
});

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

test("offline and timed-out saves each get their own message, and an error's own text is never shown", () => {
  assert.match(getSaveFailureMessage({ code: "offline", message: "TypeError: Failed to fetch" }), /offline.*text is still here/i);
  assert.match(getSaveFailureMessage({ code: "timeout", message: "AbortError" }), /taking too long.*text is still here/i);
  for (const code of ["offline", "timeout"]) {
    assert.doesNotMatch(getSaveFailureMessage({ code, message: "SECRET-DETAIL" }), /SECRET-DETAIL/);
  }
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

test("typing stops at the limit, counted in characters like the database", () => {
  assert.equal(isWithinLimit("title", "ក".repeat(120)), true);
  assert.equal(isWithinLimit("title", "ក".repeat(121)), false);
  // 😀 is 2 UTF-16 units but one character, so maxLength would stop it at 60.
  assert.equal(isWithinLimit("title", "😀".repeat(120)), true);
  assert.equal(isWithinLimit("story", "a".repeat(5000)), true);
  assert.equal(isWithinLimit("story", "a".repeat(5001)), false);
});

test("the live count matches what validation counts: spaces trimmed, nothing else", () => {
  // អាវប៉ាក់ is 8 characters: the marks ៉ and ់ each count as one.
  assert.equal(characterCount("  អាវប៉ាក់  "), 8);
  assert.equal(characterCount("\tអាវ\n"), 5);
  assert.equal(isWithinLimit("title", `   ${"a".repeat(120)}   `), true);
  assert.equal(isWithinLimit("title", `${"a".repeat(120)} b`), false);
  assert.equal(characterCount(""), 0);
  assert.equal(characterCount(undefined), 0);
});

test("a value the limit stop accepts is never refused by validation, and the reverse", () => {
  for (const [field, limit] of Object.entries({ title: 120, story: 5000, credited_as: 50, occasion: 100, maker: 100, place: 100, materials: 200 })) {
    for (const length of [limit, limit + 1]) {
      const text = "ក".repeat(length);
      const input = { title: "t", story: "s", [field]: text };
      assert.equal(validateEntry(input, YEAR).ok, isWithinLimit(field, text), `${field} at ${length}`);
    }
  }
});

test("a field with no limit always fits", () => {
  assert.equal(isWithinLimit("year", "x".repeat(10000)), true);
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
  assert.match(getEntryMessage("year", "invalid", YEAR), /from 1900 to 2026/);
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

test("editing starts from the stored values: blanks become empty text, and the year becomes its choice", () => {
  const row = {
    id: "e1",
    owner: "owner-a",
    title: "Sampot Hol",
    story: "Made for my sister.",
    credited_as: null,
    occasion: null,
    year: 2019,
    maker: "Ms. Chan Thy",
    place: null,
    materials: "Hand-woven silk",
  };
  assert.deepEqual(formValuesFromEntry(row), {
    title: "Sampot Hol",
    story: "Made for my sister.",
    credited_as: "",
    occasion: "",
    year: "2019",
    maker: "Ms. Chan Thy",
    place: "",
    materials: "Hand-woven silk",
  });
  assert.equal(formValuesFromEntry({ ...row, year: null }).year, "");
});

test("a stored entry opened and saved again without changes writes back the same values, Khmer included", () => {
  const stored = {
    title: "សំពត់ចងក្បិន for my graduation",
    story: "ខ្ញុំបានកុម្មង់អាវប៉ាក់​នេះ at a tailor in Phnom Penh.\nសំពត់ហូល too.",
    credited_as: "គ្រួសារសុខា",
    occasion: "ពិធីមង្គលការ wedding",
    year: 2019,
    maker: "Ms. Chan Thy",
    place: "ភ្នំពេញ",
    materials: "សូត្រ silk​",
  };
  const { ok, entry } = validateEntry(formValuesFromEntry(stored), YEAR);
  assert.equal(ok, true);
  assert.deepEqual(entryColumns(entry), stored);
});

test("a change the database refused says it was not saved, keeps the text, and never repeats a raw error", () => {
  const message = getSaveFailureMessage({ code: "not-saved", message: "SECRET-DETAIL" });
  assert.match(message, /That change wasn't saved/);
  assert.match(message, /Your text is still here/);
  assert.doesNotMatch(message, /SECRET-DETAIL/);
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

test("the year list runs from the current year down to 1900", () => {
  const years = yearOptions(2026);
  assert.equal(years[0], 2026);
  assert.equal(years.at(-1), 1900);
  assert.equal(years.length, 127);
});

test("a stored year inside the list adds nothing", () => {
  assert.deepEqual(yearOptions(2026, "2019"), yearOptions(2026));
  assert.deepEqual(yearOptions(2026, ""), yearOptions(2026));
});

test("a stored year ahead of this browser's clock is still offered, so saving cannot erase it", () => {
  // The database allows the year on the clock in UTC+14, which can be one ahead.
  const years = yearOptions(2026, "2027");
  assert.equal(years[0], 2027);
  assert.equal(years[1], 2026);
  assert.equal(years.length, 128);
});

test("a stored year that is not a whole number adds nothing", () => {
  assert.deepEqual(yearOptions(2026, "abc"), yearOptions(2026));
  assert.deepEqual(yearOptions(2026, "20.5"), yearOptions(2026));
  for (const blank of [null, undefined, " ", 0]) assert.deepEqual(yearOptions(2026, blank), yearOptions(2026));
});

test("a delete is confirmed only when the database handed back the one deleted row", () => {
  // A refused delete is not an error either: the API answers with no rows.
  assert.equal(changeWasSaved([{ id: "e1" }]), true);
  for (const rows of [[], null, undefined, [{ id: "e1" }, { id: "e2" }]]) {
    assert.equal(changeWasSaved(rows), false, String(rows));
  }
});

test("a delete the database refused says that change wasn't saved and that the entry is still there", () => {
  for (const code of ["not-saved", "42501"]) {
    const message = getDeleteFailureMessage({ code, message: "SECRET-DETAIL" });
    assert.match(message, /That change wasn't saved\./);
    assert.match(message, /not been deleted/i);
    assert.doesNotMatch(message, /SECRET-DETAIL/);
  }
});

test("offline and timed-out deletes each get their own message, and neither claims the entry was deleted", () => {
  assert.match(getDeleteFailureMessage({ code: "offline" }), /offline/i);
  assert.match(getDeleteFailureMessage({ code: "timeout" }), /taking too long.*check.*before deleting again/i);
  for (const code of ["offline", "timeout"]) {
    assert.doesNotMatch(getDeleteFailureMessage({ code }), /wasn't saved/i);
  }
});

test("any other failed delete suggests checking the connection and never repeats the raw error", () => {
  for (const error of [new Error("SECRET-DETAIL"), { code: "XX000", message: "SECRET-DETAIL" }, null, undefined]) {
    const message = getDeleteFailureMessage(error);
    assert.match(message, /could not delete/i);
    assert.doesNotMatch(message, /SECRET-DETAIL/);
  }
});
