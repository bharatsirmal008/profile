"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const cloudEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
let client: SupabaseClient | undefined;

export function getSupabase() {
  if (!cloudEnabled) throw new Error("Supabase is not configured. Follow docs/SUPABASE_SETUP.md.");
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  return client;
}
