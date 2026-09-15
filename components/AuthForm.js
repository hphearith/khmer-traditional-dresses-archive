"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";

export default function AuthForm({ signup = false }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setPending(true);
    setError("");
    setMessage("");

    try {
      const supabase = createClient();
      const credentials = {
        email: fields.get("email").trim(),
        password: fields.get("password"),
      };
      const { data, error: authError } = signup
        ? await supabase.auth.signUp(credentials)
        : await supabase.auth.signInWithPassword(credentials);
      if (authError) throw authError;

      if (signup && !data.session) {
        form.reset();
        setMessage("Check your email to confirm your account, then log in.");
      } else {
        router.replace("/");
        router.refresh();
      }
    } catch {
      setError(signup ? "Unable to sign up. Please try again." : "Invalid email or password");
    } finally {
      setPending(false);
    }
  }

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} aria-busy={pending} style={{ display: "grid", gap: 20 }}>
      <div>
        <label htmlFor="email" style={{ display: "block", marginBottom: 8 }}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required disabled={pending} />
      </div>
      <div>
        <label htmlFor="password" style={{ display: "block", marginBottom: 8 }}>Password</label>
        <input id="password" name="password" type="password" required disabled={pending}
          autoComplete={signup ? "new-password" : "current-password"}
          minLength={signup ? 6 : undefined} aria-describedby={signup ? "password-hint" : undefined} />
        {signup && <p id="password-hint" style={{ marginTop: 8, fontSize: 14 }}>Use at least 6 characters.</p>}
      </div>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <button type="submit" disabled={pending} style={{
        minHeight: 48, border: "1px solid var(--wine)", borderRadius: 4, padding: "8px 16px",
        background: "var(--wine)", color: "var(--surface)", opacity: pending ? 0.7 : 1,
        cursor: pending ? "wait" : "pointer",
      }}>
        {pending ? "Please wait…" : signup ? "Sign up" : "Log in"}
      </button>
    </form>
  );
}
