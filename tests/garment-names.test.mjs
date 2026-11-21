import assert from "node:assert/strict";
import test from "node:test";
import { garmentNames } from "../lib/garmentNames.js";

const hol = { nameEn: "Sampot Hol", nameKh: "សំពត់ហូល" };

test("in the Khmer interface the Khmer name leads, then the English", () => {
  assert.deepEqual(garmentNames(hol, "km"), [
    { text: "សំពត់ហូល", lang: "km" },
    { text: "Sampot Hol", lang: "en" },
  ]);
});

test("in the English interface the English name leads, then the Khmer", () => {
  assert.deepEqual(garmentNames(hol, "en"), [
    { text: "Sampot Hol", lang: "en" },
    { text: "សំពត់ហូល", lang: "km" },
  ]);
});

test("the Khmer name is returned exactly as written", () => {
  const tricky = { nameEn: "Sbui / Sbai", nameKh: "ស្បៃ​" };
  assert.equal(garmentNames(tricky, "km")[0].text, "ស្បៃ​");
});
