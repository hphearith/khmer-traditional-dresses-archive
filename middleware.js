import { updateSession } from "./lib/supabase/middleware.js";

export async function middleware(request) {
  return updateSession(request);
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
