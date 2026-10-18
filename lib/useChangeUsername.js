"use client";

import { useState } from "react";
import { createClient } from "./supabase/client.js";
import { getUsernameMessage, validateUsername } from "./username.js";
import { getChangeMessage, readChangeResult } from "./usernameChange.js";

export function useChangeUsername() {
  const [pending, setPending] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    setUsernameError("");

    const checked = validateUsername(fields.get("username"));
    if (!checked.ok) {
      setUsernameError(getUsernameMessage(checked.reason));
      return;
    }
    setPending(true);

    try {
      const { data, error } = await createClient().rpc("change_username", {
        candidate: checked.username,
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
    } finally {
      setPending(false);
    }
  }

  return { pending, usernameError, handleSubmit };
}
