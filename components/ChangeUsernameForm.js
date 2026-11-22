"use client";

import { useEffect, useRef } from "react";
import { TEXT } from "../lib/uiText.js";
import { useChangeUsername } from "../lib/useChangeUsername.js";
import Bilingual from "./Bilingual.js";
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
    <form noValidate onSubmit={handleSubmit} aria-busy={pending} className="form-stack">
      {/* Kept on screen but locked while confirming, so going back keeps what was typed. */}
      <UsernameField pending={pending || Boolean(asking)} error={usernameError} />
      {asking ? (
        <ChangeUsernameConfirm ref={confirmRef} asking={asking} pending={pending} onConfirm={confirm} onCancel={cancel} />
      ) : (
        <button type="submit" className="button">
          <Bilingual text={TEXT.username.change} inline />
        </button>
      )}
    </form>
  );
}
