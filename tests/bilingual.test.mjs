import assert from "node:assert/strict";
import test from "node:test";
import { isPair, pick } from "../lib/bilingual.js";

test("a pair needs both an English and a Khmer text that is not blank", () => {
  assert.equal(isPair({ en: "Title", km: "ចំណងជើង" }), true);
  for (const bad of [null, undefined, "Title", {}, { en: "Title" }, { km: "ចំណងជើង" }, { en: "Title", km: "" }, { en: "  ", km: "ចំណងជើង" }, { en: 1, km: "ចំណងជើង" }]) {
    assert.equal(isPair(bad), false, JSON.stringify(bad));
  }
});

test("pick shows one language of a pair, the Khmer exactly as written", () => {
  const tricky = "ក្រុង​សៀមរាប";
  assert.equal(pick({ en: "Place", km: tricky }, "en"), "Place");
  assert.equal(pick({ en: "Place", km: tricky }, "km"), tricky);
});

test("pick refuses an incomplete pair or an unknown language instead of showing nothing", () => {
  assert.throws(() => pick({ en: "Title" }, "en"), /both/);
  assert.throws(() => pick({ en: "Title", km: "ចំណងជើង" }, "fr"), /en or km/);
});
