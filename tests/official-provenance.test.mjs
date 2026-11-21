import assert from "node:assert/strict";
import test from "node:test";
import garments from "../data/garments.js";
import { sharedProvenance, withoutShared } from "../lib/officialProvenance.js";

const shop = { maker: "Apsara Mode Tailor", place: "Phnom Penh" };
const hol = { id: "hol", ...shop };
const pak = { id: "pak", ...shop };

test("a maker and place every record shares are shown once", () => {
  assert.deepEqual(sharedProvenance([hol, pak]), shop);
});

test("a field that differs on any record is not shared", () => {
  const other = { id: "other", maker: "Another Tailor", place: "Phnom Penh" };
  assert.deepEqual(sharedProvenance([hol, other]), { place: "Phnom Penh" });
});

test("a missing value is never shared, and an empty list shares nothing", () => {
  assert.deepEqual(sharedProvenance([hol, { id: "x", maker: null, place: "Phnom Penh" }]), { place: "Phnom Penh" });
  assert.deepEqual(sharedProvenance([]), {});
});

test("a card leaves out only the shared fields and keeps its own", () => {
  const other = { id: "other", maker: "Another Tailor", place: "Phnom Penh" };
  assert.deepEqual(withoutShared(other, { place: "Phnom Penh" }), { id: "other", maker: "Another Tailor", place: null });
  assert.deepEqual(withoutShared(hol, {}), hol);
});

test("today every Official record shares the archive's shop and place", () => {
  assert.deepEqual(sharedProvenance(garments), shop);
});
