import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { isPair } from "../lib/bilingual.js";
import { ENTRY_LIMITS, getDeleteFailureMessage, getEntryMessage, getSaveFailureMessage } from "../lib/entry.js";
import { MAX_PHOTO_BYTES, PHOTO_CONSENT, getPhotoFailureMessage, getPhotoMessage } from "../lib/photo.js";
import {
  TEXT, characterCountText, deleteFailureText, entryMessageText, photoFailureText, photoHintText, photoMessageText,
  saveFailureText, sharedByText,
} from "../lib/uiText.js";

const KHMER = /[ក-៿]/;

// Every fixed text in TEXT, including invalid leaves such as an empty object.
function allPairs(group, path = "TEXT") {
  return Object.entries(group).flatMap(([key, value]) => {
    const name = `${path}.${key}`;
    if (!isPair(value) && value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0) {
      return allPairs(value, name);
    }
    return [[name, value]];
  });
}

test("every fixed text has both an English and a Khmer text", () => {
  for (const [path, value] of allPairs(TEXT)) assert.equal(isPair(value), true, path);
});

test("every Khmer text contains Khmer, so an English line is never pasted in as its translation", () => {
  for (const [path, value] of allPairs(TEXT)) assert.match(value?.km, KHMER, path);
});

// Every TEXT.a.b… written in the app's own code, with the file it is in. A path
// stops at the first [, so TEXT.review.pill[status] is read as TEXT.review.pill.
// \b keeps names such as PHOTO_TYPES_TEXT out.
function textReferences() {
  const references = [];
  for (const dir of ["app", "components", "lib"]) {
    const root = new URL(`../${dir}/`, import.meta.url);
    for (const file of readdirSync(root, { recursive: true })) {
      if (!file.endsWith(".js")) continue;
      const source = readFileSync(new URL(file, root), "utf8");
      for (const [, path] of source.matchAll(/\bTEXT((?:\.[A-Za-z_$][\w$]*)+)/g)) {
        references.push([`${dir}/${file}`, `TEXT${path}`]);
      }
    }
  }
  return references;
}

test("every interface text the app uses exists, so no page breaks on a missing or renamed key", () => {
  const references = textReferences();
  // A scan that found nothing would pass every check below.
  assert.ok(references.some(([, path]) => path === "TEXT.home.navLabel"), "the scan finds TEXT.home.navLabel in components/HomeNav.js");
  for (const [file, path] of references) {
    const value = path.split(".").slice(1).reduce((group, key) => (group && Object.hasOwn(group, key) ? group[key] : undefined), TEXT);
    assert.notEqual(value, undefined, `${file}: ${path} is not in TEXT (lib/uiText.js)`);
  }
});

test("entry messages keep today's English and add Khmer for every field and reason", () => {
  const options = { currentYear: 2026 };
  for (const field of Object.keys(ENTRY_LIMITS)) {
    for (const reason of ["required", "too-long"]) {
      const text = entryMessageText(field, reason, options);
      assert.equal(text.en, getEntryMessage(field, reason, options), `${field}:${reason}`);
      assert.equal(isPair(text), true, `${field}:${reason}`);
    }
  }
  const year = entryMessageText("year", "invalid", options);
  assert.equal(year.en, getEntryMessage("year", "invalid", options));
  assert.match(year.km, /1900/);
  assert.match(year.km, /2026/);
});

test("the character limit in a Khmer message is written like the English one", () => {
  const text = entryMessageText("story", "too-long");
  assert.match(text.km, /5,000/);
  assert.match(text.en, /5,000/);
});

test("save failures keep today's English and add Khmer for every code, known or not", () => {
  for (const code of ["42501", "23514", "offline", "timeout", "not-saved", "other", undefined]) {
    const text = saveFailureText(code === undefined ? undefined : { code });
    assert.equal(text.en, getSaveFailureMessage(code === undefined ? undefined : { code }), String(code));
    assert.equal(isPair(text), true, String(code));
  }
});

test("delete failures keep today's English and add Khmer for every code, known or not", () => {
  for (const code of ["42501", "not-saved", "offline", "timeout", "other", undefined]) {
    const text = deleteFailureText(code === undefined ? undefined : { code });
    assert.equal(text.en, getDeleteFailureMessage(code === undefined ? undefined : { code }), String(code));
    assert.equal(isPair(text), true, String(code));
  }
});

test("photo messages keep today's English and add Khmer for every field and reason", () => {
  for (const [field, reason] of [["photo", "required"], ["photo", "type"], ["photo", "size"], ["consent", "required"]]) {
    const text = photoMessageText(field, reason);
    const label = `${field}:${reason}`;
    assert.equal(text.en, getPhotoMessage(field, reason), label);
    assert.equal(isPair(text), true, label);
    assert.match(text.km, KHMER, label);
  }
});

test("photo upload failures keep today's English and add Khmer for every code and status", () => {
  const failures = [{ statusCode: 403 }, { statusCode: "413" }, { status: 415 }, { code: "offline" }, { code: "timeout" }, { statusCode: 500 }, undefined];
  for (const failure of failures) {
    const text = photoFailureText(failure);
    const label = JSON.stringify(failure) ?? "no error details";
    assert.equal(text.en, getPhotoFailureMessage(failure), label);
    assert.equal(isPair(text), true, label);
    assert.match(text.km, KHMER, label);
  }
});

test("the photo consent keeps its exact English wording", () => {
  assert.equal(TEXT.photo.consent.en, PHOTO_CONSENT);
});

test("the photo hint states the size limit in megabytes in both languages", () => {
  const mb = String(MAX_PHOTO_BYTES / 1024 / 1024);
  for (const keepCurrent of [false, true]) {
    const text = photoHintText(keepCurrent);
    assert.match(text.en, new RegExp(`${mb} MB`));
    assert.match(text.km, new RegExp(`${mb} MB`));
  }
});

test("the character counter and the credit line put the number and the name in both languages", () => {
  const counter = characterCountText(1234, 5000);
  assert.match(counter.en, /1,234.*5,000/);
  assert.match(counter.km, /1,234.*5,000/);
  const credit = sharedByText("@mary");
  assert.match(credit.en, /@mary/);
  assert.match(credit.km, /@mary/);
});

test("a credit written in Khmer is carried through unchanged", () => {
  const credit = "កញ្ញា សុភា ​នៅភ្នំពេញ";
  assert.equal(sharedByText(credit).km.includes(credit), true);
  assert.equal(sharedByText(credit).en.includes(credit), true);
});

test("the Khmer maker limit applies to the maker or tailor's name", () => {
  assert.equal(entryMessageText("maker", "too-long").km, "សូមកុំឱ្យឈ្មោះអ្នកធ្វើ ឬជាងដេរលើស 100 តួអក្សរ។");
});

test("permission recovery tells Khmer readers to sign out before signing in again", () => {
  assert.match(saveFailureText({ code: "42501" }).km, /ចាកចេញ រួចចូលគណនីវិញ/);
  assert.match(saveFailureText({ code: "42501" }).km, /ជ្រើសរើសឈ្មោះអ្នកប្រើប្រាស់/);
  assert.match(photoFailureText({ statusCode: "403" }).km, /ចាកចេញ រួចចូលគណនីវិញ/);
});
