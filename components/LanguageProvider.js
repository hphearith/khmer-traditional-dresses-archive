"use client";

import { useState } from "react";
import { LanguageContext, SetLanguageContext } from "../lib/useLanguage.js";

// Hands the Interface language to every component beneath it (useLanguage).
// It starts as the language the root layout read from the lang cookie, so the
// first render is already right. After that the toggle changes it here, in the
// browser: every Bilingual already has both languages, so the switch shows at
// once without asking the server to redraw the page.
export default function LanguageProvider({ language: initial, children }) {
  const [language, setLanguage] = useState(initial);

  return (
    <SetLanguageContext value={setLanguage}>
      <LanguageContext value={language}>{children}</LanguageContext>
    </SetLanguageContext>
  );
}
