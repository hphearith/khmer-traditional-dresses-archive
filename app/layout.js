import collection from "../collection.config.js";
import DraftToast from "../components/DraftToast.js";
import "./globals.css";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <DraftToast />
      </body>
    </html>
  );
}
