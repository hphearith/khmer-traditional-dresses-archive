import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

export default function ChangeUsernameConfirm({ ref, asking, pending, onConfirm, onCancel }) {
  return (
    <div ref={ref} tabIndex={-1} role="alertdialog" aria-labelledby="confirm-question" aria-describedby="confirm-warning"
      className="confirm-panel">
      <p id="confirm-question"><strong><Bilingual text={asking.question} /></strong></p>
      <p id="confirm-warning"><Bilingual text={asking.warning} /></p>
      <div className="button-row">
        <button type="button" className="button" onClick={onConfirm} disabled={pending}>
          <Bilingual text={pending ? TEXT.auth.pleaseWait : TEXT.username.confirmYes} inline />
        </button>
        <button type="button" className="button secondary" onClick={onCancel} disabled={pending}>
          <Bilingual text={TEXT.username.goBack} inline />
        </button>
      </div>
    </div>
  );
}
