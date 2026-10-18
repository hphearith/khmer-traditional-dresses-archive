import assert from "node:assert/strict";
import test from "node:test";
import { getConfirmationResendMessage } from "../lib/authConfirmation.js";
import { isPair } from "../lib/bilingual.js";
import {
  allowedAtText, changeMessageText, confirmText, resendMessageText, retryInText, usernameHintText, usernameMessageText,
  yourUsernameText,
} from "../lib/uiText.js";
import { getUsernameMessage } from "../lib/username.js";
import { getChangeMessage, getConfirmMessage } from "../lib/usernameChange.js";

const KHMER = /[ក-៿]/;

test("Username messages keep today's English and add Khmer for every reason, known or not", () => {
  for (const reason of ["required", "invalid-characters", "too-short", "too-long", "taken", "unknown", "something-else", undefined]) {
    const text = usernameMessageText(reason);
    assert.equal(text.en, getUsernameMessage(reason), String(reason));
    assert.equal(isPair(text), true, String(reason));
    assert.match(text.km, KHMER, String(reason));
  }
});

test("the Khmer Username limits agree with the English ones", () => {
  assert.match(usernameMessageText("too-short").km, /3/);
  assert.match(usernameMessageText("too-long").km, /20/);
  const hint = usernameHintText();
  assert.match(hint.en, /3 to 20/);
  assert.match(hint.km, /3.*20/);
});

test("refused Username changes keep today's English and add Khmer for every reason", () => {
  const allowedAt = new Date("2026-11-17T20:05:00Z");
  const results = [
    { reason: "too-soon", allowedAt }, { reason: "unchanged" }, { reason: "taken" },
    { reason: "invalid-characters" }, { reason: "unknown" },
  ];
  for (const result of results) {
    const text = changeMessageText({ ok: false, ...result });
    assert.equal(text.en, getChangeMessage({ ok: false, ...result }), result.reason);
    assert.match(text.km, KHMER, result.reason);
  }
});

test("the wait date is written with the Khmer month, the same day, year and UTC time", () => {
  const text = allowedAtText(new Date("2026-11-17T20:05:00Z"));
  assert.equal(text.en, "17 November 2026 at 20:05 UTC");
  assert.equal(text.km, "17 វិច្ឆិកា 2026 ម៉ោង 20:05 UTC");
  assert.match(allowedAtText(new Date("2027-01-02T03:04:00Z")).km, /^2 មករា 2027 ម៉ោង 03:04 UTC$/);
});

test("the change confirmation keeps today's English and names the new Username and the date in Khmer", () => {
  const now = new Date("2026-10-18T12:00:00Z");
  const asked = confirmText("new_name1", now);
  const english = getConfirmMessage("new_name1", now);
  assert.equal(asked.question.en, english.question);
  assert.equal(asked.warning.en, english.warning);
  assert.match(asked.question.km, /@new_name1/);
  assert.match(asked.warning.km, /30/);
  assert.match(asked.warning.km, /17 វិច្ឆិកា 2026/);
});

test("the Username line puts the name, written as the visitor chose it, in both languages", () => {
  const text = yourUsernameText("mary_k");
  assert.match(text.en, /@mary_k/);
  assert.match(text.km, /@mary_k/);
});

test("resend results keep today's English and add Khmer for success, rate limit and failure", () => {
  for (const error of [null, { code: "over_email_send_rate_limit" }, { status: 429 }, { code: "request_failed" }]) {
    const text = resendMessageText(error);
    assert.equal(text.en, getConfirmationResendMessage(error), JSON.stringify(error));
    assert.match(text.km, KHMER, JSON.stringify(error));
  }
});

test("the resend countdown shows the seconds left in both languages", () => {
  const text = retryInText(42);
  assert.match(text.en, /42s/);
  assert.match(text.km, /42/);
});
