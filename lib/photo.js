// Pure rules for the one photo on a Contributor entry. The storage bucket
// enforces the same type and size (supabase/photos.sql). Change both together.

export const MAX_PHOTO_BYTES = 5242880;

export const PHOTO_CONSENT =
  "I took this photo or have permission to share it, and anyone who can be recognised in it has agreed to it being shown publicly in this archive.";

// The only types accepted, each with the file extension it is stored under.
// The extension always comes from here, never from the file's own name.
export const PHOTO_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// An empty file input still hands over a File, with no name and no bytes, so a
// photo with no size is a missing photo.
function isMissing(file) {
  return !file || !file.size;
}

// file is anything with a type and a size (a File from the form). Returns
// { ok: true } or { ok: false, errors } where errors name each refused field
// ("photo", "consent") with the reason.
export function validatePhoto({ file, consent }) {
  const errors = {};
  if (isMissing(file)) errors.photo = "required";
  else if (!Object.hasOwn(PHOTO_EXTENSIONS, file.type)) errors.photo = "type";
  else if (file.size > MAX_PHOTO_BYTES) errors.photo = "size";
  if (consent !== true) errors.consent = "required";
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true };
}

// Where a photo is stored: <user id>/<uuid>.<extension>. The first folder is the
// owner's own area, the only place the storage rules let them write
// (supabase/photos.sql). The original filename is never part of the path.
// Returns null for a type that is not accepted.
export function photoPath(userId, uuid, mimeType) {
  if (!Object.hasOwn(PHOTO_EXTENSIONS, mimeType)) return null;
  return `${userId}/${uuid}.${PHOTO_EXTENSIONS[mimeType]}`;
}

const PHOTO_TYPES_TEXT = "JPEG, PNG or WebP";

const PHOTO_MESSAGES = {
  "photo:required": "Choose a photo for your entry.",
  "photo:type": `That file is not a photo we can use. Choose a ${PHOTO_TYPES_TEXT} image.`,
  "photo:size": "That photo is larger than 5 MB. Choose a smaller photo.",
  "consent:required": "Tick the box to confirm you may share this photo.",
};

export function getPhotoMessage(field, reason) {
  return PHOTO_MESSAGES[`${field}:${reason}`];
}

// What to tell a Contributor whose photo upload failed. Only the status code
// (or the form's own code) is read; the storage error's message is never shown
// (the caller logs it with console.error).
const UPLOAD_FAILURES = {
  // Storage rules: not signed in as the owner of this folder.
  "403": "This account cannot upload photos right now. Log out, log in again, then try once more.",
  "413": PHOTO_MESSAGES["photo:size"],
  "415": PHOTO_MESSAGES["photo:type"],
  // Raised by the form itself (lib/saveDeadline.js), not by storage.
  offline: "You appear to be offline. Your entry is still here: reconnect, then save again.",
  timeout: "The photo is taking too long to upload. Your entry is still here: check your connection, then save again.",
};

export function getPhotoFailureMessage(error) {
  const key = error?.code in UPLOAD_FAILURES ? error.code : String(error?.statusCode ?? error?.status);
  return UPLOAD_FAILURES[key] ?? "We could not upload your photo. Check your connection and try again.";
}
