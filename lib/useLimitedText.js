"use client";

import { useRef, useState } from "react";
import { characterCount, isWithinLimit } from "./entry.js";

// Keeps a text field within its limit by refusing any edit that would go over
// it. Nothing is ever cut, so a Khmer cluster cannot be split: typing stops at
// the limit, and a paste that does not fit is refused whole.
//
// While an input method is composing (a Khmer keyboard building a syllable)
// the browser still owns the text, so edits are let through and checked once
// when the composition ends. Refusing them mid-way would garble the syllable.
export function useLimitedText(field, initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const accepted = useRef(initialValue);
  const composing = useRef(false);

  function settle(next) {
    if (isWithinLimit(field, next)) accepted.current = next;
    setValue(accepted.current);
  }

  return {
    value,
    count: characterCount(value),
    inputProps: {
      value,
      onChange: (event) => (composing.current ? setValue(event.target.value) : settle(event.target.value)),
      onCompositionStart: () => { composing.current = true; },
      onCompositionEnd: (event) => {
        composing.current = false;
        settle(event.target.value);
      },
    },
  };
}
