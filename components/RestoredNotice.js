import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// Shown next to the photo and the consent box when a Local draft was restored,
// because those two are never kept in it and the Contributor must give them again.
// Wine like the form's other messages, so it is seen. Always on the page, so a
// screen reader announces the text when it appears.
export default function RestoredNotice({ restored, editing }) {
  return (
    <p role="status" style={{ color: "var(--wine)", fontWeight: 700 }}>
      {restored && <Bilingual text={editing ? TEXT.form.restoredEdit : TEXT.form.restored} />}
    </p>
  );
}
