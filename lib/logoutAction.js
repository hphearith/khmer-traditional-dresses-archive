"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server.js";

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  redirect("/");
}
