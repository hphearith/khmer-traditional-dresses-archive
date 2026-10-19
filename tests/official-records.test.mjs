import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import garments from "../data/garments.js";

const publicDir = new URL("../public", import.meta.url).pathname;

test("every Official record shows a real photo that exists in public/", () => {
  for (const garment of garments) {
    assert.ok(!garment.imageUrl.includes("placeholder"), garment.id);
    assert.ok(existsSync(publicDir + garment.imageUrl), `${garment.id}: ${garment.imageUrl}`);
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
