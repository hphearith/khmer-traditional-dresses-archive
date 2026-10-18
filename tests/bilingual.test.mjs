import assert from "node:assert/strict";
import test from "node:test";
import { combined, isPair } from "../lib/bilingual.js";

test("a pair needs both an English and a Khmer text that is not blank", () => {
  assert.equal(isPair({ en: "Title", km: "ចំណងជើង" }), true);
  for (const bad of [null, undefined, "Title", {}, { en: "Title" }, { km: "ចំណងជើង" }, { en: "Title", km: "" }, { en: "  ", km: "ចំណងជើង" }, { en: 1, km: "ចំណងជើង" }]) {
    assert.equal(isPair(bad), false, JSON.stringify(bad));
  }
});

test("a placeholder or aria-label joins English and Khmer in one string, Khmer unchanged", () => {
  const km = "ចំណងជើង";
  assert.equal(combined({ en: "Title", km }), `Title · ${km}`);
  // Khmer combining marks and zero-width characters pass through byte for byte.
  const tricky = "ក្រុង​សៀមរាប";
  assert.equal(combined({ en: "Place", km: tricky }).endsWith(tricky), true);
});

test("combined refuses an incomplete pair instead of showing half a label", () => {
  assert.throws(() => combined({ en: "Title" }), /both/);
});
