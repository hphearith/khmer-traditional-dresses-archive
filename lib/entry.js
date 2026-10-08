import { formatUsername } from "./username.js";

// Pure rules for a Contributor entry. The database enforces the same rules
// (supabase/entries.sql: check constraints using char_length(trim(column)),
// and the year trigger). Change both together.
export const ENTRY_LIMITS = {
  title: 120,
  story: 5000,
  credited_as: 50,
  occasion: 100,
  maker: 100,
  place: 100,
  materials: 200,
};

export const EARLIEST_YEAR = 1900;

const REQUIRED = ["title", "story"];
const OPTIONAL_TEXT = ["credited_as", "occasion", "maker", "place", "materials"];

const FIELD_NAMES = {
  title: "title",
  story: "story",
  credited_as: "credited as name",
  occasion: "occasion",
  maker: "maker",
  place: "place",
  materials: "materials",
};

export function getEntryMessage(field, reason, { currentYear = new Date().getFullYear() } = {}) {
  if (field === "year") return `Choose a year from ${EARLIEST_YEAR} to ${currentYear}, or leave it blank.`;
  if (reason === "required") return `Give your entry a ${FIELD_NAMES[field]}.`;
  return `Keep the ${FIELD_NAMES[field]} to ${ENTRY_LIMITS[field].toLocaleString("en")} characters or fewer.`;
}

// What to tell a Contributor whose save failed. Only the database's error code
// is read; its message is never shown (the caller logs it with console.error).
const SAVE_FAILURES = {
  // Row-level security: not signed in as the owner, or no Username yet.
  "42501": "This account cannot save entries right now. Log out, log in again and make sure you have chosen a Username.",
  // A check constraint or the year trigger.
  "23514": "Something in your entry was not accepted. Check each field and try again.",
  // Raised by the form itself (lib/saveDeadline.js), not by the database.
  offline: "You appear to be offline. Your text is still here: reconnect, then save again.",
  timeout: "That is taking too long. Your text is still here: check your connection, then save again.",
};

export function getSaveFailureMessage(error) {
  return SAVE_FAILURES[error?.code] ?? "We could not save your entry. Check your connection and try again.";
}

// The Credit shown on a Contributor entry: its credited-as text, else the
// owner's current Username with an @. Unlike the form rules, any whitespace
// (tabs, newlines too) counts as blank here, so a Credit is never invisible.
export function resolveCredit(creditedAs, username) {
  if (typeof creditedAs === "string" && creditedAs.trim() !== "") return creditedAs;
  return username ? formatUsername(username) : null;
}

// Only the space character is trimmed, matching Postgres trim() in
// supabase/entries.sql. Tabs, newlines and every Khmer character are kept.
function trimSpaces(value) {
  return typeof value === "string" ? value.replace(/^ +| +$/g, "") : "";
}

// Counts characters (code points), like Postgres char_length(): ក is one
// character though it is three bytes. Nothing is ever cut, so a Khmer
// cluster can never be split; an over-long value is refused instead.
function countCharacters(text) {
  return [...text].length;
}

// What the form uses to stop typing at a limit. It counts exactly what
// validateEntry counts (spaces trimmed, code points), so the form, the counter
// and the database agree. A field with no limit always fits.
export function characterCount(value) {
  return countCharacters(trimSpaces(value));
}

export function isWithinLimit(field, value) {
  const limit = ENTRY_LIMITS[field];
  return limit === undefined || characterCount(value) <= limit;
}

export function validateEntry(input, { currentYear = new Date().getFullYear() } = {}) {
  const entry = {};
  const errors = {};

  for (const field of [...REQUIRED, ...OPTIONAL_TEXT]) {
    const value = trimSpaces(input[field]);
    entry[field] = REQUIRED.includes(field) ? value : value || null;
    if (REQUIRED.includes(field) && value === "") errors[field] = "required";
    else if (countCharacters(value) > ENTRY_LIMITS[field]) errors[field] = "too-long";
  }

  const year = trimSpaces(input.year);
  entry.year = year ? Number(year) : null;
  if (year && (!/^[0-9]{4}$/.test(year) || entry.year < EARLIEST_YEAR || entry.year > currentYear)) {
    errors.year = "invalid";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, entry };
}
