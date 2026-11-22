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

test("every Official record has a Khmer material and description", () => {
  for (const garment of garments) {
    assert.ok(typeof garment.materialKh === "string" && garment.materialKh.trim().length > 0, `${garment.id} missing materialKh`);
    assert.ok(typeof garment.descriptionKh === "string" && garment.descriptionKh.trim().length > 0, `${garment.id} missing descriptionKh`);
    assert.equal(garment.makerKh, "ជាងកាត់ដេរ អប្សរាម៉ូដ", garment.id);
    assert.equal(garment.placeKh, "ភ្នំពេញ", garment.id);
  }
});

test("Official record search finds Khmer words from descriptions and materials", async () => {
  const { filterGarments } = await import("../lib/garmentSearch.js");
  const byMaterial = filterGarments(garments, { activeTab: "all", query: "សូត្រចងគាត" });
  assert.ok(byMaterial.some((g) => g.id === "sampot-hol"));

  const byDescription = filterGarments(garments, { activeTab: "all", query: "ឡេវមុខ" });
  assert.ok(byDescription.some((g) => g.id === "av-pak"));
});
