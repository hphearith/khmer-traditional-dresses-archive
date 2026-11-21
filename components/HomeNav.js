"use client";

import { pick } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT } from "../lib/uiText.js";

// The home page's masthead navigation. It is a client component only so its
// aria-label follows the toggle the moment it is pressed; the links inside
// are still drawn by the server page.
export default function HomeNav({ children }) {
  const language = useLanguage();
  return <nav aria-label={pick(TEXT.home.navLabel, language)}>{children}</nav>;
}
