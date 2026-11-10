"use client";

import { createContext, useContext } from "react";

// The reader's Interface language, en or km, for any component in the browser.
// The root layout reads the lang cookie on the server and hands the result to
// LanguageProvider, so the first render already has the right language.
// Outside a provider (there should be none) it is Khmer, the default.
export const LanguageContext = createContext("km");

export function useLanguage() {
  return useContext(LanguageContext);
}
