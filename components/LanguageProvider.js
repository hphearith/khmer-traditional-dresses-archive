"use client";

import { LanguageContext } from "../lib/useLanguage.js";

// Hands the Interface language the root layout read from the lang cookie to
// every component beneath it (useLanguage). Pressing the toggle refreshes the
// page, the layout reads the new cookie, and this value changes with it.
export default function LanguageProvider({ language, children }) {
  return <LanguageContext value={language}>{children}</LanguageContext>;
}
