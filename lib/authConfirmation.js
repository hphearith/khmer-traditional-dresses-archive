export const CONFIRMATION_CALLBACK_PATH = "/auth/callback";

export function getConfirmationRedirectUrl(origin) {
  const originUrl = new URL(origin);
  if (originUrl.protocol !== "https:" && originUrl.protocol !== "http:") {
    throw new TypeError("Confirmation redirects require an HTTP origin.");
  }

  return new URL(CONFIRMATION_CALLBACK_PATH, originUrl.origin).toString();
}

export function readConfirmationCallbackInput(search, hash) {
  const fragment = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  if (fragment.has("error") || fragment.has("error_code") || fragment.has("error_description")) {
    return { type: "provider-error" };
  }

  const query = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const code = query.get("code");
  return code ? { type: "code", code } : { type: "missing-code" };
}

export function clearConfirmationCallbackUrl(history) {
  history.replaceState(history.state, "", CONFIRMATION_CALLBACK_PATH);
}

export function createAuthCookieBridge(getAllCookies) {
  const cookiesToSet = [];
  const responseHeaders = {};

  return {
    methods: {
      getAll: getAllCookies,
      setAll(cookies, headers = {}) {
        cookiesToSet.push(...cookies);
        Object.assign(responseHeaders, headers);
      },
    },
    apply(response) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      Object.entries(responseHeaders).forEach(([name, value]) => {
        response.headers.set(name, value);
      });
      return response;
    },
  };
}

export function applyAuthNoStoreHeaders(headers) {
  headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
  headers.set("Expires", "0");
  headers.set("Pragma", "no-cache");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
  return headers;
}

export function getConfirmationResendMessage(error) {
  if (!error) return "If this address needs confirmation, an email will arrive shortly.";
  if (error.code === "over_email_send_rate_limit" || error.status === 429) {
    return "Too many requests were made. Please wait before requesting another email.";
  }
  return "We couldn't send a message right now. Check the address or try again later.";
}

function isMissingVerifier(error) {
  return error?.code === "pkce_code_verifier_not_found"
    || error?.name === "AuthPKCECodeVerifierMissingError";
}

export async function exchangeConfirmationCode(code, auth) {
  if (typeof code !== "string" || code.length === 0 || code.length > 4096) {
    return { ok: false, reason: "invalid-link" };
  }

  try {
    const { error } = await auth.exchangeCodeForSession(code);
    if (!error) return { ok: true };
    return { ok: false, reason: isMissingVerifier(error) ? "missing-verifier" : "invalid-link" };
  } catch (error) {
    return { ok: false, reason: isMissingVerifier(error) ? "missing-verifier" : "invalid-link" };
  }
}
