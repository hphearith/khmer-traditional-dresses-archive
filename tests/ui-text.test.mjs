import assert from "node:assert/strict";
import test from "node:test";
import { isPair } from "../lib/bilingual.js";
import { ENTRY_LIMITS, getDeleteFailureMessage, getEntryMessage, getSaveFailureMessage } from "../lib/entry.js";
import { MAX_PHOTO_BYTES, PHOTO_CONSENT, getPhotoFailureMessage, getPhotoMessage } from "../lib/photo.js";
import {
  TEXT, characterCountText, deleteFailureText, entryMessageText, photoFailureText, photoHintText, photoMessageText,
  saveFailureText, sharedByText,
} from "../lib/uiText.js";

// Every fixed text in TEXT, however deeply it is grouped.
function allPairs(group, path = "TEXT") {
  return Object.entries(group).flatMap(([key, value]) => (
    isPair(value) || typeof value !== "object" ? [[`${path}.${key}`, value]] : allPairs(value, `${path}.${key}`)
  ));
}

test("every fixed text has both an English and a Khmer text", () => {
  for (const [path, value] of allPairs(TEXT)) assert.equal(isPair(value), true, path);
});

test("every Khmer text contains Khmer, so an English line is never pasted in as its translation", () => {
  const khmer = /[ក-៿]/;
  for (const [path, value] of allPairs(TEXT)) assert.match(value.km, khmer, path);
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
    assert.equal(text.en, getPhotoMessage(field, reason), `${field}:${reason}`);
    assert.equal(isPair(text), true, `${field}:${reason}`);
  }
});

test("photo upload failures keep today's English and add Khmer for every code and status", () => {
  const failures = [{ statusCode: 403 }, { statusCode: "413" }, { status: 415 }, { code: "offline" }, { code: "timeout" }, { statusCode: 500 }, undefined];
  for (const failure of failures) {
    const text = photoFailureText(failure);
    assert.equal(text.en, getPhotoFailureMessage(failure), JSON.stringify(failure));
    assert.equal(isPair(text), true, JSON.stringify(failure));
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
