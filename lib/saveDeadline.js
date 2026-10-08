// A failure raised by the form itself (not by the database). Its code is
// looked up by getSaveFailureMessage in lib/entry.js.
export function saveFailure(code) {
  return Object.assign(new Error(`save failed: ${code}`), { code });
}

// One deadline for a whole save. Without it, an offline or stalled connection
// leaves the Save button disabled with nothing to read (a stale session makes
// supabase.auth.getSession() retry its token refresh for about 25 seconds).
export function startSaveDeadline(milliseconds) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), milliseconds);

  return {
    // Hand this to the request so it is cancelled when time runs out.
    signal: controller.signal,
    // Settles like `promise`, or rejects with a "timeout" failure if the
    // deadline passes first. The slow call itself cannot be cancelled.
    race(promise) {
      return new Promise((resolve, reject) => {
        if (controller.signal.aborted) return reject(saveFailure("timeout"));
        controller.signal.addEventListener("abort", () => reject(saveFailure("timeout")), { once: true });
        promise.then(resolve, reject);
      });
    },
    clear() {
      clearTimeout(timer);
    },
  };
}
