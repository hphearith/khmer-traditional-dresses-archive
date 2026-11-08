"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { pick } from "../lib/bilingual.js";
import { languageCookie } from "../lib/language.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT } from "../lib/uiText.js";

// Each language is named in its own script, whatever the page is showing. The
// flags are decoration: screen readers hear only the words, and a system that
// draws a flag as two letters still shows the name (docs/adr/0005).
const CHOICES = [
  { language: "km", flag: "🇰🇭", name: "ខ្មែរ" },
  { language: "en", flag: "🇬🇧", name: "English" },
];

// Switches the Interface language. Pressing a choice writes the lang cookie,
// the only time it is written, then asks the server to redraw the page in
// place, so scroll position and anything typed into a form are kept.
export default function LanguageToggle() {
  const current = useLanguage();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(language) {
    if (language === current) return;
    document.cookie = languageCookie(language, window.location.protocol === "https:");
    startTransition(() => router.refresh());
  }

  return (
    <div className="container language-bar">
      <div role="group" aria-label={pick(TEXT.language.label, current)} aria-busy={pending || undefined} className="language-toggle">
        {CHOICES.map(({ language, flag, name }) => (
          <button key={language} type="button" lang={language} aria-pressed={language === current} onClick={() => choose(language)}>
            <span aria-hidden="true">{flag}</span> {name}
          </button>
        ))}
      </div>
    </div>
  );
}
