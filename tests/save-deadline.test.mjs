import assert from "node:assert/strict";
import test from "node:test";
import { saveFailure, startSaveDeadline } from "../lib/saveDeadline.js";

const never = () => new Promise(() => {});

test("a call that never finishes is reported as a timeout, and the request is aborted", async () => {
  const deadline = startSaveDeadline(20);
  await assert.rejects(deadline.race(never()), (error) => error.code === "timeout");
  assert.equal(deadline.signal.aborted, true);
  deadline.clear();
});

test("a call that finishes in time passes its result through and nothing is aborted", async () => {
  const deadline = startSaveDeadline(1000);
  assert.equal(await deadline.race(Promise.resolve("session")), "session");
  deadline.clear();
  assert.equal(deadline.signal.aborted, false);
});

test("a call that fails in time passes its own error through", async () => {
  const deadline = startSaveDeadline(1000);
  const failure = new Error("boom");
  await assert.rejects(deadline.race(Promise.reject(failure)), (error) => error === failure);
  deadline.clear();
});

test("a cleared deadline never fires", async () => {
  const deadline = startSaveDeadline(20);
  deadline.clear();
  await new Promise((done) => setTimeout(done, 60));
  assert.equal(deadline.signal.aborted, false);
});

test("a deadline that has already passed times out any later call", async () => {
  const deadline = startSaveDeadline(10);
  await new Promise((done) => setTimeout(done, 40));
  await assert.rejects(deadline.race(Promise.resolve("late")), (error) => error.code === "timeout");
  deadline.clear();
});

test("saveFailure carries the code that getSaveFailureMessage looks up", () => {
  assert.equal(saveFailure("offline").code, "offline");
});
