"use client";

import { useState } from "react";
import { createClient } from "./supabase/client.js";
import { getUsernameMessage, validateUsername } from "./username.js";
import { getChangeMessage, getConfirmMessage, readChangeResult } from "./usernameChange.js";

// Two steps: submitting the form only checks the typed name and asks
// "are you sure?"; confirm() is what sends the change.
export function useChangeUsername() {
  const [pending, setPending] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [asking, setAsking] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    setUsernameError("");

    const checked = validateUsername(fields.get("username"));
    if (!checked.ok) {
      setUsernameError(getUsernameMessage(checked.reason));
      return;
    }
    setAsking({ username: checked.username, ...getConfirmMessage(checked.username) });
  }

  function cancel() {
    if (!pending) setAsking(null);
  }

  async function confirm() {
    if (pending || !asking) return;
    setUsernameError("");
    setPending(true);

    try {
      const { data, error } = await createClient().rpc("change_username", {
        candidate: asking.username,
      });
      if (error) throw error;

      const result = readChangeResult(data);
      if (result.ok) {
        // A full load, so every entry is read again with the new Credit.
        window.location.assign("/?tab=community");
        return;
      }
      setUsernameError(getChangeMessage(result));
    } catch {
      setUsernameError(getUsernameMessage("unknown"));
    }
    // Back to the form with the reason shown, so the name can be fixed.
    setAsking(null);
    setPending(false);
  }

  return { pending, usernameError, asking, handleSubmit, confirm, cancel };
}
