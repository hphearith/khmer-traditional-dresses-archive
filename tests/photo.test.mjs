import assert from "node:assert/strict";
import test from "node:test";
import {
  getPhotoFailureMessage,
  getPhotoMessage,
  photoPath,
  validatePhoto,
  validatePhotoChange,
} from "../lib/photo.js";

const FIVE_MB = 5 * 1024 * 1024;
const jpeg = (size = 1000) => ({ type: "image/jpeg", size });

test("only JPEG, PNG and WebP are accepted", () => {
  for (const type of ["image/jpeg", "image/png", "image/webp"]) {
    assert.equal(validatePhoto({ file: { type, size: 1000 }, consent: true }).ok, true, type);
  }
  for (const type of ["image/gif", "image/svg+xml", "application/pdf", "text/html", "image/JPEG", ""]) {
    assert.deepEqual(validatePhoto({ file: { type, size: 1000 }, consent: true }), {
      ok: false,
      errors: { photo: "type" },
    }, type);
  }
});

test("a photo of exactly 5 MB is accepted and one byte more is refused", () => {
  assert.equal(validatePhoto({ file: jpeg(FIVE_MB), consent: true }).ok, true);
  assert.deepEqual(validatePhoto({ file: jpeg(FIVE_MB + 1), consent: true }), {
    ok: false,
    errors: { photo: "size" },
  });
});

test("an empty file counts as no photo", () => {
  assert.deepEqual(validatePhoto({ file: jpeg(0), consent: true }), { ok: false, errors: { photo: "required" } });
});

test("a photo and a ticked consent box are both required", () => {
  assert.deepEqual(validatePhoto({ file: jpeg(), consent: true }), { ok: true });
  assert.deepEqual(validatePhoto({ file: jpeg(), consent: false }), { ok: false, errors: { consent: "required" } });
  assert.deepEqual(validatePhoto({ file: null, consent: true }), { ok: false, errors: { photo: "required" } });
  assert.deepEqual(validatePhoto({ file: null, consent: false }), {
    ok: false,
    errors: { photo: "required", consent: "required" },
  });
});

test("a photo is stored at <user id>/<uuid>.<extension>, the extension coming from the type", () => {
  const user = "5f0c1c64-1b7a-4d6e-9d52-3f1d7f6f0a11";
  const id = "0b9c7a52-8d34-4b8e-a0b7-6c1f2d9e4a33";
  assert.equal(photoPath(user, id, "image/jpeg"), `${user}/${id}.jpg`);
  assert.equal(photoPath(user, id, "image/png"), `${user}/${id}.png`);
  assert.equal(photoPath(user, id, "image/webp"), `${user}/${id}.webp`);
  // A type that is not accepted has no path, so nothing can be stored under it.
  assert.equal(photoPath(user, id, "image/gif"), null);
  assert.equal(photoPath(user, id, "../../etc/passwd"), null);
});

test("each refused photo or consent box gets a clear message of its own", () => {
  const messages = [
    getPhotoMessage("photo", "required"),
    getPhotoMessage("photo", "type"),
    getPhotoMessage("photo", "size"),
    getPhotoMessage("consent", "required"),
  ];
  assert.equal(new Set(messages).size, 4);
  assert.match(messages[1], /JPEG, PNG or WebP/);
  assert.match(messages[2], /5 MB/);
});

test("a failed upload is explained from its status, never by the storage error's own message", () => {
  const refusals = [
    { statusCode: "403", message: "new row violates row-level security policy" },
    { statusCode: "413", message: "The object exceeded the maximum allowed size" },
    { statusCode: "415", message: "mime type text/html is not supported" },
    { code: "offline", message: "save failed: offline" },
    { code: "timeout", message: "save failed: timeout" },
    { message: "TypeError: Failed to fetch" },
    undefined,
  ];
  const shown = refusals.map((error) => getPhotoFailureMessage(error));
  for (const [index, text] of shown.entries()) {
    assert.ok(text.length > 20, `message ${index} is readable`);
    assert.ok(!text.includes(refusals[index]?.message ?? "\u0000"), `message ${index} does not leak error.message`);
  }
  // A size or type refusal tells the Contributor what to change; a policy refusal says to log in again.
  assert.match(shown[1], /5 MB/);
  assert.match(shown[2], /JPEG, PNG or WebP/);
  assert.match(shown[0], /log/i);
});

test("editing without choosing a new photo keeps the current one, whatever the consent box says", () => {
  // An empty file input still hands over a File with no bytes.
  for (const file of [null, undefined, jpeg(0)]) {
    for (const consent of [true, false]) {
      assert.deepEqual(validatePhotoChange({ file, consent }), { ok: true, replace: false });
    }
  }
});

test("a new photo replaces the current one only with a ticked consent box", () => {
  assert.deepEqual(validatePhotoChange({ file: jpeg(), consent: true }), { ok: true, replace: true });
  assert.deepEqual(validatePhotoChange({ file: jpeg(), consent: false }), {
    ok: false,
    errors: { consent: "required" },
  });
});

test("a replacement photo meets the same type and size rules as a first photo", () => {
  assert.deepEqual(validatePhotoChange({ file: { type: "image/gif", size: 1000 }, consent: true }), {
    ok: false,
    errors: { photo: "type" },
  });
  assert.deepEqual(validatePhotoChange({ file: jpeg(FIVE_MB + 1), consent: true }), {
    ok: false,
    errors: { photo: "size" },
  });
});
