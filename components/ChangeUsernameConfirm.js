import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

const button = { minHeight: 48, borderRadius: 4, padding: "8px 16px", border: "1px solid var(--wine)" };

export default function ChangeUsernameConfirm({ ref, asking, pending, onConfirm, onCancel }) {
  return (
    <div ref={ref} tabIndex={-1} role="alertdialog" aria-labelledby="confirm-question" aria-describedby="confirm-warning"
      style={{ display: "grid", gap: 12, padding: 16, border: "1px solid var(--border)", background: "var(--fabric)" }}>
      <p id="confirm-question"><strong><Bilingual text={asking.question} /></strong></p>
      <p id="confirm-warning"><Bilingual text={asking.warning} /></p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button type="button" onClick={onConfirm} disabled={pending} style={{
          ...button, background: "var(--wine)", color: "var(--surface)",
          opacity: pending ? 0.7 : 1, cursor: pending ? "wait" : "pointer",
        }}>
          <Bilingual text={pending ? TEXT.auth.pleaseWait : TEXT.username.confirmYes} inline />
        </button>
        <button type="button" onClick={onCancel} disabled={pending} style={{
          ...button, background: "transparent", color: "var(--wine)", cursor: "pointer",
        }}>
          <Bilingual text={TEXT.username.goBack} inline />
        </button>
      </div>
    </div>
  );
}
