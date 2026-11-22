import assert from "node:assert/strict";
import test from "node:test";
import garments from "../data/garments.js";
import { findGarment, garmentHref } from "../lib/garmentPages.js";

test("every Official record has a unique id that is safe in an address", () => {
  const ids = garments.map((garment) => garment.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/, id);
});

test("a record's page lives at /garments/<id>", () => {
  assert.equal(garmentHref("sampot-hol"), "/garments/sampot-hol");
});

test("a record is found by its id", () => {
  assert.equal(findGarment(garments, "sbai")?.nameEn, "Sbui / Sbai");
});

test("an unknown or missing id finds no record", () => {
  assert.equal(findGarment(garments, "sampot-chang-kben"), null);
  assert.equal(findGarment(garments, undefined), null);
});
