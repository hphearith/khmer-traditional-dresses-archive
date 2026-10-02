import assert from "node:assert/strict";
import test from "node:test";
import { getHomeTabHref, moveHomeTab, parseHomeTab } from "../lib/homeTabs.js";

test("the Official collection is the default tab", () => {
  assert.equal(parseHomeTab(undefined), "official");
  assert.equal(parseHomeTab(null), "official");
  assert.equal(parseHomeTab(""), "official");
});

test("the community value opens the Community tab", () => {
  assert.equal(parseHomeTab("community"), "community");
  assert.equal(parseHomeTab("official"), "official");
});

test("unknown, differently-cased, or repeated tab values fall back to the Official collection", () => {
  assert.equal(parseHomeTab("Community"), "official");
  assert.equal(parseHomeTab("all"), "official");
  assert.equal(parseHomeTab(["community", "official"]), "official");
});

test("the Official collection is the plain address and Community carries the tab", () => {
  assert.equal(getHomeTabHref("official"), "/");
  assert.equal(getHomeTabHref("community"), "/?tab=community");
});

test("arrow keys move between tabs and wrap around", () => {
  assert.equal(moveHomeTab("official", "ArrowRight"), "community");
  assert.equal(moveHomeTab("community", "ArrowRight"), "official");
  assert.equal(moveHomeTab("official", "ArrowLeft"), "community");
  assert.equal(moveHomeTab("community", "ArrowLeft"), "official");
});

test("Home and End jump to the first and last tab", () => {
  assert.equal(moveHomeTab("community", "Home"), "official");
  assert.equal(moveHomeTab("official", "End"), "community");
});

test("other keys do not move the tab", () => {
  assert.equal(moveHomeTab("official", "Enter"), null);
  assert.equal(moveHomeTab("community", "a"), null);
});
