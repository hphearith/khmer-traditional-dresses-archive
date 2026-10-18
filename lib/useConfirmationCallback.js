"use client";

import { useEffect, useRef, useState } from "react";
import {
  clearConfirmationCallbackUrl,
  readConfirmationCallbackInput,
} from "./authConfirmation.js";
import { TEXT } from "./uiText.js";

export function useConfirmationCallback() {
  const [message, setMessage] = useState(TEXT.callback.checking);
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
      setMessage(TEXT.callback.providerError);
      setCanResend(true);
    } else if (input.type === "missing-code") {
      setMessage(TEXT.callback.missingCode);
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
        setMessage(result.reason === "missing-verifier" ? TEXT.callback.missingVerifier : TEXT.callback.exchangeFailed);
        setCanResend(true);
      }).catch(() => {
        if (!active) return;
        setMessage(TEXT.callback.networkFailed);
        setCanResend(true);
      });
    }

    return () => { active = false; };
  }, []);

  return { message, canResend };
}
