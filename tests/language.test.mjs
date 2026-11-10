import assert from "node:assert/strict";
import test from "node:test";
import { LANGUAGE_COOKIE, LANGUAGE_COOKIE_MAX_AGE, languageCookie, readLanguage } from "../lib/language.js";

test("the lang cookie choosing English shows English, and choosing Khmer shows Khmer", () => {
  assert.equal(readLanguage("en"), "en");
  assert.equal(readLanguage("km"), "km");
});

test("a missing or junk lang cookie falls back to Khmer, the default", () => {
  for (const value of [undefined, null, "", "EN", " en", "eng", "fr", "en;km", 1]) {
    assert.equal(readLanguage(value), "km", JSON.stringify(value));
  }
});

test("the choice is kept in a cookie named lang for one month (ADR 0005)", () => {
  assert.equal(LANGUAGE_COOKIE, "lang");
  assert.equal(LANGUAGE_COOKIE_MAX_AGE, 30 * 24 * 60 * 60);
});

test("pressing the toggle writes a lang cookie for the whole site that lasts one month", () => {
  assert.equal(languageCookie("km", false), `lang=km; Max-Age=${30 * 24 * 60 * 60}; Path=/; SameSite=Lax`);
  assert.equal(languageCookie("en", true), `lang=en; Max-Age=${30 * 24 * 60 * 60}; Path=/; SameSite=Lax; Secure`);
});

test("the toggle never writes a cookie for a language the archive does not have", () => {
  assert.throws(() => languageCookie("fr", true), /en or km/);
});
