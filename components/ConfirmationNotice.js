"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client.js";
import {
  getConfirmationRedirectUrl,
  getConfirmationResendMessage,
} from "../lib/authConfirmation.js";

export default function ConfirmationNotice({ initialEmail = "", initialCooldown = 0 }) {
  const [email, setEmail] = useState(initialEmail);
  const [pending, setPending] = useState(false);
  const [cooldown, setCooldown] = useState(initialCooldown);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setTimeout(() => setCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending || cooldown > 0) return;
    setPending(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: getConfirmationRedirectUrl(window.location.origin) },
      });
      setMessage(getConfirmationResendMessage(error));
    } catch {
      setMessage(getConfirmationResendMessage({ code: "request_failed" }));
    } finally {
      setCooldown(60);
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={pending} style={{ display: "grid", gap: 12 }}>
      <label htmlFor="confirmation-email">Email address</label>
      <input id="confirmation-email" type="email" autoComplete="email" required disabled={pending}
        value={email} onChange={(event) => {
          setEmail(event.target.value);
          setMessage("");
        }} />
      {message && <p role="status">{message}</p>}
      <button type="submit" disabled={pending || cooldown > 0} style={{
        minHeight: 44, border: "1px solid var(--wine)", borderRadius: 4, padding: "8px 16px",
        background: "var(--surface)", color: "var(--wine)", cursor: pending ? "wait" : "pointer",
      }}>
        {pending ? "Sending…" : cooldown > 0 ? "Try again in " + cooldown + "s" : "Resend confirmation email"}
      </button>
    </form>
  );
}
