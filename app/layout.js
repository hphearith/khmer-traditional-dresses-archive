import collection from "../collection.config.js";
import DraftToast from "../components/DraftToast.js";
import LanguageProvider from "../components/LanguageProvider.js";
import LanguageToggle from "../components/LanguageToggle.js";
import { getLanguage } from "../lib/getLanguage.js";
import { archiveMetadataText } from "../lib/uiText.js";
import "./globals.css";

export async function generateMetadata() {
  return archiveMetadataText(collection, await getLanguage());
}

// The page is drawn in the reader's Interface language from the first render,
// so the page never shows one language and then flips to the other
// (docs/adr/0005).
export default async function RootLayout({ children }) {
  const language = await getLanguage();

  return (
    <html lang={language}>
      <body>
        <LanguageProvider language={language}>
          <LanguageToggle />
          {children}
          <DraftToast />
        </LanguageProvider>
      </body>
    </html>
  );
}
