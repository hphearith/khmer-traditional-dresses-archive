"use client";

import { createContext, useContext } from "react";

// The reader's Interface language, en or km, for any component in the browser.
// The root layout reads the lang cookie on the server and hands the result to
// LanguageProvider, so the first render already has the right language.
// Outside a provider (there should be none) it is Khmer, the default.
export const LanguageContext = createContext("km");

// Changes the Interface language on screen. Only the toggle uses it. Outside a
// provider there is nothing to change, so it does nothing.
export const SetLanguageContext = createContext(() => {});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useSetLanguage() {
  return useContext(SetLanguageContext);
}
