"use client";

import { useEffect, useRef } from "react";
import { useChangeUsername } from "../lib/useChangeUsername.js";
import ChangeUsernameConfirm from "./ChangeUsernameConfirm.js";
import UsernameField from "./UsernameField.js";

export default function ChangeUsernameForm() {
  const { pending, usernameError, asking, handleSubmit, confirm, cancel } = useChangeUsername();
  const confirmRef = useRef(null);

  // Move focus to the question, so a keyboard or screen reader user lands on it.
  useEffect(() => {
    if (asking) confirmRef.current?.focus();
  }, [asking]);

  return (
    <form onSubmit={handleSubmit} aria-busy={pending} style={{ display: "grid", gap: 20 }}>
      {/* Kept on screen but locked while confirming, so going back keeps what was typed. */}
      <UsernameField pending={pending || Boolean(asking)} error={usernameError} />
      {asking ? (
        <ChangeUsernameConfirm ref={confirmRef} asking={asking} pending={pending} onConfirm={confirm} onCancel={cancel} />
      ) : (
        <button type="submit" style={{
          minHeight: 48, border: "1px solid var(--wine)", borderRadius: 4, padding: "8px 16px",
          background: "var(--wine)", color: "var(--surface)", cursor: "pointer",
        }}>
          Change Username
        </button>
      )}
    </form>
  );
}
