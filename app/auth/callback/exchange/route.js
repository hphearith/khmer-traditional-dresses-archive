import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  applyAuthNoStoreHeaders,
  createAuthCookieBridge,
  exchangeConfirmationCode,
} from "../../../../lib/authConfirmation.js";

function responseWithCookies(result, status, cookieBridge) {
  const response = NextResponse.json(result, { status });
  cookieBridge?.apply(response);
  applyAuthNoStoreHeaders(response.headers);
  return response;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return responseWithCookies({ ok: false, reason: "invalid-link" }, 400);
  }

  const cookieStore = await cookies();
  const cookieBridge = createAuthCookieBridge(() => cookieStore.getAll());
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { cookies: cookieBridge.methods }
  );
  const result = await exchangeConfirmationCode(body?.code, supabase.auth);
  return responseWithCookies(result, result.ok ? 200 : 400, cookieBridge);
}
