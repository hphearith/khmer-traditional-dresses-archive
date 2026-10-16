import { photoPath } from "./photo.js";

const BUCKET = "photos";

// Uploads the chosen photo to <user id>/<random uuid>.<extension> and returns
// its path. The extension comes from the validated type and the name from a
// fresh uuid, never from the file's own name. Throws the storage error, which
// the caller logs and explains with getPhotoFailureMessage (lib/photo.js).
// The upload itself cannot be cancelled, so the caller races it with a deadline.
export async function uploadPhoto(supabase, userId, file) {
  const path = photoPath(userId, crypto.randomUUID(), file.type);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

// Takes a photo out of storage: one the entry never used, one an edit replaced,
// or one whose entry was deleted. Returns true only when the file was really
// removed. A refused delete is not an error: storage answers with no removed
// file (see the select policy in supabase/photos.sql), so the answer is checked
// as well as the error. A failure is logged here and never shown: the entry
// change it follows has already been reported on its own.
export async function removePhoto(supabase, path) {
  const { data, error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error(`Removing the photo ${path} failed:`, error);
    return false;
  }
  if (!Array.isArray(data) || data.length !== 1) {
    console.error(`Removing the photo ${path} removed no file`);
    return false;
  }
  return true;
}

// removePhoto under the caller's save deadline (lib/saveDeadline.js), for a
// removal that follows a change the Contributor will be told about: a hung
// storage call must not keep the form or the card waiting. A removal that does
// not finish is logged like one that failed, and reported as not removed.
export async function removePhotoWithin(deadline, supabase, path) {
  try {
    return await deadline.race(removePhoto(supabase, path));
  } catch (failure) {
    console.error(`Removing the photo ${path} did not finish:`, failure);
    return false;
  }
}

// The address anyone can open a stored photo from. Pure string building: it
// makes no request, so a guest's page needs no cookie.
export function photoUrl(supabase, path) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
