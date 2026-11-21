import assert from "node:assert/strict";
import { statSync } from "node:fs";
import test from "node:test";
import garments from "../data/garments.js";

test("every Official record points to a photo file in public/", () => {
  for (const garment of garments) {
    assert.ok(!garment.imageUrl.includes("placeholder"), garment.id);
    const photo = new URL(`../public${garment.imageUrl}`, import.meta.url);
    assert.ok(statSync(photo, { throwIfNoEntry: false })?.isFile(), `${garment.id}: ${garment.imageUrl} must point to a file`);
  }
});

test("every Official record names its maker and place", () => {
  for (const garment of garments) {
    assert.equal(garment.maker, "Apsara Mode Tailor", garment.id);
    assert.equal(garment.place, "Phnom Penh", garment.id);
  }
});

test("Sampot Chang Kben is not in the Official collection", () => {
  assert.equal(garments.length, 7);
  assert.ok(!garments.some((garment) => /kben/i.test(JSON.stringify(garment))));
});
