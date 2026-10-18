"use client";

import { useState } from "react";
import { createClient } from "./supabase/client.js";
import { usernameMessageText } from "./uiText.js";
import { readClaimResult, validateUsername } from "./username.js";

export function useChooseUsername() {
  const [pending, setPending] = useState(false);
  const [usernameError, setUsernameError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    setUsernameError(null);

    const checked = validateUsername(fields.get("username"));
    if (!checked.ok) {
      setUsernameError(usernameMessageText(checked.reason));
      return;
    }
    setPending(true);

    try {
      const { data, error } = await createClient().rpc("claim_username", {
        candidate: checked.username,
      });
      if (error) throw error;

      const result = readClaimResult(data);
      if (result.ok) {
        window.location.assign("/");
        return;
      }
      setUsernameError(usernameMessageText(result.reason));
    } catch {
      setUsernameError(usernameMessageText("unknown"));
    } finally {
      setPending(false);
    }
  }

  return { pending, usernameError, handleSubmit };
}
