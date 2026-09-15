import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  /** @type {import("@supabase/ssr").CookieMethodsServer} */
  const cookieMethods = {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet, _headers) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Server Components cannot write cookies. A request proxy can
        // refresh the session and persist updated cookies instead.
      }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: cookieMethods,
    }
  );
}
