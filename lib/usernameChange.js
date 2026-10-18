import { formatUsername, getUsernameMessage } from "./username.js";

// The wait between Username changes. The database enforces the same rule
// (supabase/change-username.sql: the change_username function); the checks
// here only give the visitor an early, friendly answer. Change both together.
export const USERNAME_CHANGE_WAIT_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

function waitEndsAt(lastChange) {
  return new Date(lastChange.getTime() + USERNAME_CHANGE_WAIT_DAYS * DAY_MS);
}

// changedAt is when the Username was last changed (usernames.changed_at). It is
// empty until the first change, so the first choice at signup, or the forced
// choice for an existing account, starts no wait. A change is allowed again
// exactly 30 days after the last one.
export function checkUsernameChange(changedAt, now = new Date()) {
  if (changedAt === null || changedAt === undefined) return { allowed: true };

  const lastChange = new Date(changedAt);
  // An unreadable date cannot refuse anyone: the database makes the final call.
  if (Number.isNaN(lastChange.getTime())) return { allowed: true };

  const allowedAt = waitEndsAt(lastChange);
  if (now.getTime() >= allowedAt.getTime()) return { allowed: true };
  return { allowed: false, allowedAt };
}

// Turns the answer of the database's change_username function
// (supabase/change-username.sql) into what the form needs. Anything it does
// not recognise is a failure, so the visitor is never told a change worked
// when it may not have.
export function readChangeResult(answer) {
  const status = answer?.status;
  if (status === "ok") return { ok: true };
  if (status === "taken") return { ok: false, reason: "taken" };
  if (status === "invalid") return { ok: false, reason: "invalid-characters" };
  if (status === "unchanged") return { ok: false, reason: "unchanged" };
  if (status === "too-soon" && typeof answer.allowed_at === "string") {
    const allowedAt = new Date(answer.allowed_at);
    if (!Number.isNaN(allowedAt.getTime())) return { ok: false, reason: "too-soon", allowedAt };
  }
  return { ok: false, reason: "unknown" };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

const pad = (number) => String(number).padStart(2, "0");

// Written out by hand in UTC rather than with Intl, so the same moment reads
// the same on the server, in every browser and in the tests. The time is shown
// because the wait ends at a moment, not at the start of a day.
export function formatAllowedAt(date) {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()} `
    + `at ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
}

// What to tell a Contributor whose change was refused (a failed readChangeResult).
export function getChangeMessage(result) {
  if (result.reason === "too-soon") {
    return `You changed your Username recently. You can change it again from ${formatAllowedAt(result.allowedAt)}.`;
  }
  if (result.reason === "unchanged") return "That is already your Username. Type a different one.";
  return getUsernameMessage(result.reason);
}

// What to ask before a change is sent, because it starts the wait. The date is
// worked out here from the clock, so it can differ from the database's by a
// few seconds: it says "about", and a day is enough.
export function getConfirmMessage(username, now = new Date()) {
  const endsAt = waitEndsAt(now);
  const date = `${endsAt.getUTCDate()} ${MONTHS[endsAt.getUTCMonth()]} ${endsAt.getUTCFullYear()}`;
  return {
    question: `Are you sure you want to change your Username to ${formatUsername(username)}?`,
    warning: `You cannot change it again for ${USERNAME_CHANGE_WAIT_DAYS} days, until about ${date}.`,
  };
}
