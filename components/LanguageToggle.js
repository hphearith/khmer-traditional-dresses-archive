"use client";

import { pick } from "../lib/bilingual.js";
import { languageCookie } from "../lib/language.js";
import { useLanguage, useSetLanguage } from "../lib/useLanguage.js";
import { TEXT } from "../lib/uiText.js";

// Each language is named in its own script, whatever the page is showing. The
// flags are decoration: screen readers hear only the words, and a system that
// draws a flag as two letters still shows the name (docs/adr/0005).
const CHOICES = [
  { language: "km", flag: "🇰🇭", name: "ខ្មែរ" },
  { language: "en", flag: "🇬🇧", name: "English" },
];

// Switches the Interface language. Pressing a choice changes it on screen at
// once, with no trip to the server, so scroll position and anything typed into
// a form are kept. It also writes the lang cookie, the only time it is
// written, so the next page load opens in the same language, and sets
// <html lang>, which the server set only for the first load.
export default function LanguageToggle() {
  const current = useLanguage();
  const setLanguage = useSetLanguage();

  // Each press finishes before the next can start, so a quick
  // English → ខ្មែរ → English always ends in English.
  function choose(language) {
    if (language === current) return;
    document.cookie = languageCookie(language, window.location.protocol === "https:");
    document.documentElement.lang = language;
    setLanguage(language);
  }

  return (
    <div className="container language-bar">
      <div role="group" aria-label={pick(TEXT.language.label, current)} className="language-toggle">
        {CHOICES.map(({ language, flag, name }) => (
          <button key={language} type="button" lang={language} aria-pressed={language === current} onClick={() => choose(language)}>
            <span aria-hidden="true" className="flag">{flag}</span> {name}
          </button>
        ))}
      </div>
    </div>
  );
}
