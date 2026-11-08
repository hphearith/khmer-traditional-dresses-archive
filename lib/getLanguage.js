import { cookies } from "next/headers";
import { LANGUAGE_COOKIE, readLanguage } from "./language.js";

// The Interface language for a server component, read from the lang cookie on
// this request. Reading a cookie sets none, so a guest still stores nothing.
export async function getLanguage() {
  const cookieStore = await cookies();
  return readLanguage(cookieStore.get(LANGUAGE_COOKIE)?.value);
}
