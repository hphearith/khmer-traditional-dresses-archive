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

// Takes a photo back out of storage when the entry that should hold it was not
// saved, so it is not left behind. Best effort: a failure is logged, never shown,
// because the Contributor has already been told their entry did not save.
export async function removePhoto(supabase, path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error(`Removing the unused photo ${path} failed:`, error);
}

// The address anyone can open a stored photo from. Pure string building: it
// makes no request, so a guest's page needs no cookie.
export function photoUrl(supabase, path) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
