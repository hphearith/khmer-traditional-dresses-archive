"use client";

import { TEXT } from "../lib/uiText.js";
import { useChooseUsername } from "../lib/useChooseUsername.js";
import Bilingual from "./Bilingual.js";
import UsernameField from "./UsernameField.js";

export default function ChooseUsernameForm() {
  const { pending, usernameError, handleSubmit } = useChooseUsername();

  return (
    <form noValidate onSubmit={handleSubmit} aria-busy={pending} className="form-stack">
      <UsernameField pending={pending} error={usernameError} />
      <button type="submit" className="button" disabled={pending}>
        <Bilingual text={pending ? TEXT.auth.pleaseWait : TEXT.username.save} inline />
      </button>
    </form>
  );
}
