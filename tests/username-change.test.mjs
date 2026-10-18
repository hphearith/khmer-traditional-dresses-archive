import assert from "node:assert/strict";
import test from "node:test";
import { checkUsernameChange, formatAllowedAt, getChangeMessage, getConfirmMessage, readChangeResult } from "../lib/usernameChange.js";

test("a first choice has never been changed, so it starts no wait", () => {
  const now = new Date("2026-10-18T12:00:00Z");
  assert.deepEqual(checkUsernameChange(null, now), { allowed: true });
  assert.deepEqual(checkUsernameChange(undefined, now), { allowed: true });
});

test("a change within 30 days of the last change is refused, with the date it becomes allowed", () => {
  const result = checkUsernameChange("2026-10-01T08:30:00+00:00", new Date("2026-10-18T12:00:00Z"));
  assert.equal(result.allowed, false);
  assert.equal(result.allowedAt.toISOString(), "2026-10-31T08:30:00.000Z");
});

test("the last moment before 30 days is still refused, and exactly 30 days later is allowed", () => {
  const changedAt = "2026-10-01T08:30:00Z";
  const justBefore = new Date("2026-10-31T08:29:59.999Z");
  const exactly = new Date("2026-10-31T08:30:00Z");
  assert.equal(checkUsernameChange(changedAt, justBefore).allowed, false);
  assert.deepEqual(checkUsernameChange(changedAt, exactly), { allowed: true });
});

test("a change long after the last change is allowed", () => {
  assert.deepEqual(
    checkUsernameChange("2026-01-01T00:00:00Z", new Date("2026-10-18T12:00:00Z")),
    { allowed: true },
  );
});

test("a change the database accepted lets the visitor continue", () => {
  assert.deepEqual(readChangeResult({ status: "ok" }), { ok: true });
});

test("a refused change names the reason: taken, invalid characters or already yours", () => {
  assert.deepEqual(readChangeResult({ status: "taken" }), { ok: false, reason: "taken" });
  assert.deepEqual(readChangeResult({ status: "invalid" }), { ok: false, reason: "invalid-characters" });
  assert.deepEqual(readChangeResult({ status: "unchanged" }), { ok: false, reason: "unchanged" });
});

test("a change refused for the wait carries the date it becomes allowed", () => {
  const result = readChangeResult({ status: "too-soon", allowed_at: "2026-10-31T08:30:00.123456+00:00" });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "too-soon");
  assert.equal(result.allowedAt.toISOString(), "2026-10-31T08:30:00.123Z");
});

test("an unrecognised answer is never success", () => {
  const answers = [undefined, null, "", "ok", 1, {}, { status: "surprise" }, { status: "no-username" },
    { status: "too-soon" }, { status: "too-soon", allowed_at: "not a date" }, { status: "too-soon", allowed_at: null }];
  for (const answer of answers) {
    assert.deepEqual(readChangeResult(answer), { ok: false, reason: "unknown" }, JSON.stringify(answer));
  }
});

test("the date a change becomes allowed is written in full, in UTC, so it reads the same everywhere", () => {
  assert.equal(formatAllowedAt(new Date("2026-11-17T20:05:00Z")), "17 November 2026 at 20:05 UTC");
  assert.equal(formatAllowedAt(new Date("2027-01-02T03:04:00Z")), "2 January 2027 at 03:04 UTC");
});

test("a refusal for the wait tells the visitor the date it ends", () => {
  const message = getChangeMessage({ ok: false, reason: "too-soon", allowedAt: new Date("2026-11-17T20:05:00Z") });
  assert.match(message, /17 November 2026 at 20:05 UTC/);
});

test("the other refusals use the Username messages, and already-yours has its own", () => {
  assert.match(getChangeMessage({ ok: false, reason: "taken" }), /already taken/);
  assert.match(getChangeMessage({ ok: false, reason: "invalid-characters" }), /English letters, digits/);
  assert.match(getChangeMessage({ ok: false, reason: "unchanged" }), /already your Username/);
  assert.match(getChangeMessage({ ok: false, reason: "unknown" }), /try again/);
});

test("before a change, the visitor is asked to confirm the new Username and told when they could change it again", () => {
  const message = getConfirmMessage("new_name1", new Date("2026-10-18T12:00:00Z"));
  assert.match(message.question, /change your Username to @new_name1\?/);
  assert.match(message.warning, /cannot change it again/);
  assert.match(message.warning, /17 November 2026/);
});

test("the date in the confirmation is 30 days from now, even across a month and year end", () => {
  const message = getConfirmMessage("sokha_88", new Date("2026-12-15T23:30:00Z"));
  assert.match(message.warning, /14 January 2027/);
});
