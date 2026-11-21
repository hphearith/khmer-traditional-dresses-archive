import assert from "node:assert/strict";
import test from "node:test";
import { readVisitor } from "../lib/visitor.js";

// A stand-in for the Supabase client: getClaims answers with what it is given,
// and getUser fails the test, because a page must not ask the Auth server again.
function fakeSupabase(answer) {
  return {
    auth: {
      getClaims: async () => answer,
      getUser: async () => assert.fail("readVisitor must not call getUser"),
    },
  };
}

const claims = { sub: "6f1c2a7e-0000-4000-8000-000000000001", email: "sophea@example.com", role: "authenticated" };

test("a signed-in visitor is read from the token's claims, with their id and email", async () => {
  const visitor = await readVisitor(fakeSupabase({ data: { claims }, error: null }));
  assert.deepEqual(visitor, { id: claims.sub, email: claims.email });
});

test("a guest, with no session, is no visitor", async () => {
  assert.equal(await readVisitor(fakeSupabase({ data: null, error: null })), null);
});

test("a token that fails the check (bad signature, expired) is no visitor", async () => {
  const error = new Error("Invalid JWT signature");
  assert.equal(await readVisitor(fakeSupabase({ data: null, error })), null);
  assert.equal(await readVisitor(fakeSupabase({ data: { claims }, error })), null);
});

test("claims without a user id are no visitor", async () => {
  for (const sub of [undefined, null, "", 42]) {
    assert.equal(await readVisitor(fakeSupabase({ data: { claims: { ...claims, sub } }, error: null })), null, String(sub));
  }
});

test("a visitor whose token has no email still signs in, with no email to show", async () => {
  const visitor = await readVisitor(fakeSupabase({ data: { claims: { sub: claims.sub } }, error: null }));
  assert.deepEqual(visitor, { id: claims.sub, email: null });
});
