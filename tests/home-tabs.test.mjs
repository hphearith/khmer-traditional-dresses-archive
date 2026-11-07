import assert from "node:assert/strict";
import test from "node:test";
import { getHomeTabHref, moveHomeTab, parseHomeTab, parseHomeView } from "../lib/homeTabs.js";

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

test("All entries is the default view of the Community tab", () => {
  assert.equal(parseHomeView(undefined), "all");
  assert.equal(parseHomeView(null), "all");
  assert.equal(parseHomeView(""), "all");
  assert.equal(parseHomeView("all"), "all");
});

test("the mine value opens My entries", () => {
  assert.equal(parseHomeView("mine"), "mine");
});

test("unknown, differently-cased, or repeated view values fall back to All entries", () => {
  assert.equal(parseHomeView("Mine"), "all");
  assert.equal(parseHomeView("published"), "all");
  assert.equal(parseHomeView(["mine", "all"]), "all");
});

test("My entries is the Community address plus the view, and never drops the tab", () => {
  assert.equal(getHomeTabHref("community", "mine"), "/?tab=community&view=mine");
  assert.equal(getHomeTabHref("community", "all"), "/?tab=community");
  assert.equal(getHomeTabHref("community"), "/?tab=community");
});

test("the Official collection has no view in its address, whatever view was last open", () => {
  assert.equal(getHomeTabHref("official", "mine"), "/");
});

test("a view address reads back as the same tab and view", () => {
  const params = new URL(getHomeTabHref("community", "mine"), "https://example.test").searchParams;
  assert.equal(parseHomeTab(params.get("tab")), "community");
  assert.equal(parseHomeView(params.get("view")), "mine");
});
