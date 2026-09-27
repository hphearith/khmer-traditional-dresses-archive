"use client";

import Link from "next/link";
import ConfirmationNotice from "./ConfirmationNotice.js";
import { useConfirmationCallback } from "../lib/useConfirmationCallback.js";

export default function ConfirmationCallback() {
  const { message, canResend } = useConfirmationCallback();

  return (
    <main style={{
      minHeight: "100vh", background: "var(--paper)", color: "var(--ink)",
      padding: "48px 24px", display: "grid", placeItems: "center",
    }}>
      <section aria-labelledby="confirmation-title" style={{ width: "100%", maxWidth: 440 }}>
        <h1 id="confirmation-title" style={{ fontSize: 32, marginBottom: 16 }}>Email confirmation</h1>
        <p role="status" style={{ marginBottom: 24 }}>{message}</p>
        {canResend && <ConfirmationNotice />}
        <p><Link href="/login" style={{ color: "var(--wine)" }}>Go to login</Link></p>
      </section>
    </main>
  );
}
