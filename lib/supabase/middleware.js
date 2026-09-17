import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const AUTH_PATHS = new Set(["/login", "/signup"]);

function redirectWithSession(request, pathname, sessionResponse) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  const redirectResponse = NextResponse.redirect(url);

  sessionResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  sessionResponse.headers.forEach((value, key) => {
    if (key !== "set-cookie" && key !== "x-middleware-next") {
      redirectResponse.headers.set(key, value);
    }
  });

  return redirectResponse;
}

export async function updateSession(request) {
  let sessionResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          sessionResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            sessionResponse.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            sessionResponse.headers.set(key, value);
          });
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);
  const isAuthPath = AUTH_PATHS.has(request.nextUrl.pathname);

  if (isAuthenticated && isAuthPath) {
    return redirectWithSession(request, "/", sessionResponse);
  }

  return sessionResponse;
}
