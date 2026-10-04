import { NextResponse } from "next/server";
import { applyAuthNoStoreHeaders } from "./lib/authConfirmation.js";
import { updateSession } from "./lib/supabase/middleware.js";

export async function middleware(request) {
  if (request.nextUrl.pathname === "/auth/callback") {
    const response = NextResponse.next({ request });
    applyAuthNoStoreHeaders(response.headers);
    return response;
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/", "/login", "/signup", "/choose-username", "/contribute", "/auth/callback"],
};
