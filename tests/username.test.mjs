import assert from "node:assert/strict";
import test from "node:test";
import {
  formatUsername,
  getUsernameMessage,
  readClaimResult,
  validateUsername,
} from "../lib/username.js";

test("every failure reason has its own clear message telling the visitor how to fix it", () => {
  const reasons = ["required", "invalid-characters", "too-short", "too-long", "taken"];
  const messages = reasons.map(getUsernameMessage);
  assert.equal(new Set(messages).size, reasons.length);
  assert.match(getUsernameMessage("invalid-characters"), /English letters, digits/);
  assert.match(getUsernameMessage("too-short"), /at least 3/);
  assert.match(getUsernameMessage("too-long"), /at most 20/);
  assert.match(getUsernameMessage("taken"), /already taken/);
});

test("a Username is displayed with a leading @", () => {
  assert.equal(formatUsername("sokha_88"), "@sokha_88");
});

test("a plain English Username is accepted as typed", () => {
  assert.deepEqual(validateUsername("sokha_88"), { ok: true, username: "sokha_88" });
});

test("Usernames are always lowercase, so different capitalisations are the same Username", () => {
  assert.deepEqual(validateUsername("Sokha_88"), { ok: true, username: "sokha_88" });
  assert.deepEqual(validateUsername("SOKHA_88"), validateUsername("sokha_88"));
});

test("length must be 3 to 20 characters inclusive", () => {
  assert.deepEqual(validateUsername("ab"), { ok: false, reason: "too-short" });
  assert.equal(validateUsername("abc").ok, true);
  assert.equal(validateUsername("a".repeat(20)).ok, true);
  assert.deepEqual(validateUsername("a".repeat(21)), { ok: false, reason: "too-long" });
});

test("empty or missing input is reported as required", () => {
  for (const input of ["", "   ", null, undefined]) {
    assert.deepEqual(validateUsername(input), { ok: false, reason: "required" });
  }
});

test("surrounding whitespace from a keyboard is trimmed, not stored", () => {
  assert.deepEqual(validateUsername("  sokha_88 "), { ok: true, username: "sokha_88" });
});

test("only English letters, digits and underscore are allowed", () => {
  const rejected = ["សុខា_88", "sokha!", "so kha", "so-kha", "so.kha", "@sokha", "sokhé", "sokha\nx"];
  for (const input of rejected) {
    assert.deepEqual(validateUsername(input), { ok: false, reason: "invalid-characters" }, input);
  }
});

test("a claim that succeeds, or finds the account already has a Username, lets the visitor continue", () => {
  assert.deepEqual(readClaimResult("ok"), { ok: true });
  assert.deepEqual(readClaimResult("already-chosen"), { ok: true });
});

test("a claim for a Username someone else holds is reported as taken", () => {
  assert.deepEqual(readClaimResult("taken"), { ok: false, reason: "taken" });
});

test("a claim the database finds malformed is reported as invalid characters", () => {
  assert.deepEqual(readClaimResult("invalid"), { ok: false, reason: "invalid-characters" });
});

test("an unrecognised claim answer never lets the visitor continue and has its own message", () => {
  for (const answer of [undefined, null, "", "surprise", 1]) {
    const result = readClaimResult(answer);
    assert.equal(result.ok, false, String(answer));
    assert.notEqual(getUsernameMessage(result.reason), getUsernameMessage("invalid-characters"));
    assert.match(getUsernameMessage(result.reason), /try again/);
  }
});
