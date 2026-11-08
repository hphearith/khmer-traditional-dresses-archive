// The Interface language (CONTEXT.md): English or Khmer, chosen by the reader
// with the toggle and kept on this device in a cookie (docs/adr/0005). It is
// set only when the toggle is pressed, so a guest who never presses it stores
// nothing. English is the default.

export const LANGUAGE_COOKIE = "lang";

// One month, in seconds, as a cookie's max-age wants it.
export const LANGUAGE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

// The cookie's value as the server or the browser found it. Only the exact
// value "km" means Khmer; a missing, empty or unknown value means English.
export function readLanguage(value) {
  return value === "km" ? "km" : "en";
}
