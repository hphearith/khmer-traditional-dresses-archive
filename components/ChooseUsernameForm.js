"use client";

import { TEXT } from "../lib/uiText.js";
import { useChooseUsername } from "../lib/useChooseUsername.js";
import Bilingual from "./Bilingual.js";
import UsernameField from "./UsernameField.js";

export default function ChooseUsernameForm() {
  const { pending, usernameError, handleSubmit } = useChooseUsername();

  return (
    <form onSubmit={handleSubmit} aria-busy={pending} style={{ display: "grid", gap: 20 }}>
      <UsernameField pending={pending} error={usernameError} />
      <button type="submit" disabled={pending} style={{
        minHeight: 48, border: "1px solid var(--wine)", borderRadius: 4, padding: "8px 16px",
        background: "var(--wine)", color: "var(--surface)", opacity: pending ? 0.7 : 1,
        cursor: pending ? "wait" : "pointer",
      }}>
        <Bilingual text={pending ? TEXT.auth.pleaseWait : TEXT.username.save} inline />
      </button>
    </form>
  );
}
