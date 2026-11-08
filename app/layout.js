import collection from "../collection.config.js";
import DraftToast from "../components/DraftToast.js";
import LanguageProvider from "../components/LanguageProvider.js";
import { getLanguage } from "../lib/getLanguage.js";
import "./globals.css";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

// The page is drawn in the reader's Interface language from the first render,
// so there is no English-then-Khmer flash (docs/adr/0005).
export default async function RootLayout({ children }) {
  const language = await getLanguage();

  return (
    <html lang={language}>
      <body>
        <LanguageProvider language={language}>
          {children}
          <DraftToast />
        </LanguageProvider>
      </body>
    </html>
  );
}
