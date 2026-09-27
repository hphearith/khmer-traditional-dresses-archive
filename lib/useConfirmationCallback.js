"use client";

import { useEffect, useRef, useState } from "react";
import {
  clearConfirmationCallbackUrl,
  readConfirmationCallbackInput,
} from "./authConfirmation.js";

export function useConfirmationCallback() {
  const [message, setMessage] = useState("Checking your confirmation link…");
  const [canResend, setCanResend] = useState(false);
  const callbackInput = useRef(null);
  const exchangeRequest = useRef(null);
  const redirectStarted = useRef(false);

  useEffect(() => {
    if (!callbackInput.current) {
      callbackInput.current = readConfirmationCallbackInput(
        window.location.search,
        window.location.hash
      );
      clearConfirmationCallbackUrl(window.history);
    }

    const input = callbackInput.current;
    let active = true;

    if (input.type === "provider-error") {
      setMessage("This confirmation link could not be completed. It may have expired or already been used.");
      setCanResend(true);
    } else if (input.type === "missing-code") {
      setMessage("This confirmation link is missing or invalid. Open a new email link, or try logging in.");
      setCanResend(true);
    } else {
      if (!exchangeRequest.current) {
        exchangeRequest.current = fetch("/auth/callback/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: input.code }),
          cache: "no-store",
          credentials: "same-origin",
          redirect: "error",
        }).then(async (response) => ({ response, result: await response.json() }));
      }

      exchangeRequest.current.then(({ response, result }) => {
        if (!active) return;
        if (response.ok && result.ok) {
          if (!redirectStarted.current) {
            redirectStarted.current = true;
            window.location.replace("/login?verify=1");
          }
          return;
        }
        setMessage(result.reason === "missing-verifier"
          ? "Your email may have been confirmed, but this browser could not complete sign-in. Try logging in; if confirmation is still needed, request a new email."
          : "This confirmation link could not be completed. It may have expired or already been used. Try logging in, or request a new email if needed.");
        setCanResend(true);
      }).catch(() => {
        if (!active) return;
        setMessage("We could not complete this confirmation right now. Try logging in or open the email link again.");
        setCanResend(true);
      });
    }

    return () => { active = false; };
  }, []);

  return { message, canResend };
}
