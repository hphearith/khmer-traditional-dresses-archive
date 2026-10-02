// The database enforces the same format (supabase/usernames.sql: the table's
// check constraint and the confirmation trigger). Change all three together.
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;

const ALLOWED_CHARACTERS = /^[A-Za-z0-9_]+$/;

const MESSAGES = {
  required: "Choose a Username.",
  "invalid-characters": "Use English letters, digits and underscore only. Do not type the @.",
  "too-short": `Use at least ${USERNAME_MIN_LENGTH} characters.`,
  "too-long": `Use at most ${USERNAME_MAX_LENGTH} characters.`,
  taken: "That Username is already taken. Please choose another.",
};

export function getUsernameMessage(reason) {
  return MESSAGES[reason] ?? MESSAGES["invalid-characters"];
}

export function usernamesMatch(a, b) {
  return a.toLowerCase() === b.toLowerCase();
}

export function formatUsername(username) {
  return "@" + username;
}

export function validateUsername(input) {
  const username = typeof input === "string" ? input.trim() : "";
  if (username === "") return { ok: false, reason: "required" };
  if (!ALLOWED_CHARACTERS.test(username)) return { ok: false, reason: "invalid-characters" };
  if (username.length < USERNAME_MIN_LENGTH) return { ok: false, reason: "too-short" };
  if (username.length > USERNAME_MAX_LENGTH) return { ok: false, reason: "too-long" };
  return { ok: true, username };
}
