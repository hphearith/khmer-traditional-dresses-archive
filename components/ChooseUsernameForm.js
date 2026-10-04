"use client";

import { useChooseUsername } from "../lib/useChooseUsername.js";
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
        {pending ? "Please wait…" : "Save Username"}
      </button>
    </form>
  );
}
