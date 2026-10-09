"use client";

import { useState } from "react";
import { createClient } from "./supabase/client.js";
import { getConfirmationRedirectUrl } from "./authConfirmation.js";
import { getUsernameMessage, validateUsername } from "./username.js";

export function useAuthForm(signup) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const fields = new FormData(event.currentTarget);
    const email = fields.get("email").trim();
    const password = fields.get("password");
    setError("");
    setUsernameError("");

    const usernameResult = signup ? validateUsername(fields.get("username")) : null;
    if (usernameResult && !usernameResult.ok) {
      setUsernameError(getUsernameMessage(usernameResult.reason));
      return;
    }
    setPending(true);

    try {
      const supabase = createClient();
      const credentials = { email, password };
      if (signup) {
        const { data: available, error: checkError } = await supabase.rpc("username_available", {
          candidate: usernameResult.username,
        });
        if (checkError) throw checkError;
        if (!available) {
          setUsernameError(getUsernameMessage("taken"));
          return;
        }
      }
      const { data, error: authError } = signup
        ? await supabase.auth.signUp({
          ...credentials,
          options: {
            emailRedirectTo: getConfirmationRedirectUrl(window.location.origin),
            data: { username: usernameResult.username },
          },
        })
        : await supabase.auth.signInWithPassword(credentials);

      if (!signup && authError?.code === "email_not_confirmed") {
        setConfirmationEmail(email);
        return;
      }
      if (authError) throw authError;

      if (signup && !data.session) {
        setConfirmationEmail(email);
      } else {
        window.location.assign("/login?verify=1");
      }
    } catch {
      setError(signup ? "Unable to sign up. Please try again." : "Invalid email or password");
    } finally {
      setPending(false);
    }
  }

  return { pending, error, usernameError, confirmationEmail, handleSubmit };
}
