import assert from "node:assert/strict";
import test from "node:test";
import {
  applyAuthNoStoreHeaders,
  clearConfirmationCallbackUrl,
  createAuthCookieBridge,
  exchangeConfirmationCode,
  getConfirmationRedirectUrl,
  getConfirmationResendMessage,
  readConfirmationCallbackInput,
} from "../lib/authConfirmation.js";

test("confirmation callback uses the current origin and a fixed path", () => {
  assert.equal(
    getConfirmationRedirectUrl("https://archive.example/some/page?next=/private"),
    "https://archive.example/auth/callback"
  );
  assert.throws(() => getConfirmationRedirectUrl("javascript:alert(1)"), TypeError);
});

test("provider fragment errors become a neutral state without exposing their details", () => {
  const result = readConfirmationCallbackInput(
    "?code=should-not-be-used",
    "#error=access_denied&error_code=otp_expired&error_description=private"
  );
  assert.deepEqual(result, { type: "provider-error" });
});

test("callback code is read from the query and absent codes remain explicit", () => {
  assert.deepEqual(readConfirmationCallbackInput("?code=one-time-code", ""), {
    type: "code",
    code: "one-time-code",
  });
  assert.deepEqual(readConfirmationCallbackInput("", ""), { type: "missing-code" });
});

test("callback URL cleanup removes both the code query and provider fragment", () => {
  let replacement;
  clearConfirmationCallbackUrl({
    state: { preserved: true },
    replaceState(...args) {
      replacement = args;
    },
  });
  assert.deepEqual(replacement, [{ preserved: true }, "", "/auth/callback"]);
});

test("missing and oversized codes never reach the Auth exchange", async () => {
  let calls = 0;
  const auth = { async exchangeCodeForSession() { calls += 1; return {}; } };

  assert.deepEqual(await exchangeConfirmationCode("", auth), { ok: false, reason: "invalid-link" });
  assert.deepEqual(await exchangeConfirmationCode("x".repeat(4097), auth), {
    ok: false,
    reason: "invalid-link",
  });
  assert.equal(calls, 0);
});

test("resend results use neutral messages and explain rate-limit waits", () => {
  assert.equal(
    getConfirmationResendMessage(null),
    "If this address needs confirmation, an email will arrive shortly."
  );
  const rateLimit = getConfirmationResendMessage({ code: "over_email_send_rate_limit" });
  const rateLimitStatus = getConfirmationResendMessage({ status: 429 });
  const genericFailure = getConfirmationResendMessage({
    code: "provider_error",
    message: "private provider response for this address",
  });

  assert.match(rateLimit, /wait before requesting another email/i);
  assert.equal(rateLimitStatus, rateLimit);
  assert.match(genericFailure, /couldn't send a message/i);
  assert.equal(genericFailure.includes("private provider response"), false);
});

test("successful confirmation exchanges once and returns no session material", async () => {
  const submittedCodes = [];
  const result = await exchangeConfirmationCode("one-time-code", {
    async exchangeCodeForSession(code) {
      submittedCodes.push(code);
      return { data: { session: { user: { id: "private-user" } } }, error: null };
    },
  });

  assert.deepEqual(result, { ok: true });
  assert.deepEqual(submittedCodes, ["one-time-code"]);
});

test("missing PKCE verifier and invalid or reused codes return safe recovery reasons", async () => {
  const missingVerifier = await exchangeConfirmationCode("code", {
    async exchangeCodeForSession() {
      throw Object.assign(new Error("internal verifier detail"), {
        name: "AuthPKCECodeVerifierMissingError",
        code: "pkce_code_verifier_not_found",
      });
    },
  });
  const invalid = await exchangeConfirmationCode("code", {
    async exchangeCodeForSession() {
      return { error: Object.assign(new Error("raw provider error"), { code: "otp_expired" }) };
    },
  });

  assert.deepEqual(missingVerifier, { ok: false, reason: "missing-verifier" });
  assert.deepEqual(invalid, { ok: false, reason: "invalid-link" });
  assert.equal(JSON.stringify([missingVerifier, invalid]).includes("internal verifier detail"), false);
  assert.equal(JSON.stringify([missingVerifier, invalid]).includes("raw provider error"), false);
});

test("SSR cookie writes and Supabase cache headers are applied to the response", () => {
  const appliedCookies = [];
  const appliedHeaders = new Headers();
  const bridge = createAuthCookieBridge(() => [{ name: "request-cookie", value: "value" }]);
  const cacheHeaders = {
    "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
    Expires: "0",
    Pragma: "no-cache",
  };
  bridge.methods.setAll([{ name: "sb-session", value: "session", options: { path: "/" } }], cacheHeaders);
  const response = {
    cookies: { set: (...args) => appliedCookies.push(args) },
    headers: appliedHeaders,
  };

  bridge.apply(response);
  applyAuthNoStoreHeaders(appliedHeaders);

  assert.deepEqual(bridge.methods.getAll(), [{ name: "request-cookie", value: "value" }]);
  assert.deepEqual(appliedCookies, [["sb-session", "session", { path: "/" }]]);
  assert.equal(appliedHeaders.get("cache-control"), "private, no-cache, no-store, must-revalidate, max-age=0");
  assert.equal(appliedHeaders.get("expires"), "0");
  assert.equal(appliedHeaders.get("pragma"), "no-cache");
  assert.equal(appliedHeaders.get("referrer-policy"), "no-referrer");
  assert.equal(appliedHeaders.get("x-content-type-options"), "nosniff");
});
