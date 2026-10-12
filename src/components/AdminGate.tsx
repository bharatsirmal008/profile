"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { cloudEnabled, getSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/cloud-content";

export function AdminGate({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(cloudEnabled);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!cloudEnabled) return;
    let cancelled = false;
    const check = async () => {
      try { await requireAdmin(); if (!cancelled) { setAllowed(true); setError(""); } }
      catch { if (!cancelled) setAllowed(false); }
      finally { if (!cancelled) setChecking(false); }
    };
    void check();
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(() => { setTimeout(() => { if (!cancelled) void check(); }, 0); });
    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);
  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
      if (error) throw error;
      await requireAdmin(); setAllowed(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to sign in."); }
    finally { setBusy(false); }
  };
  if (allowed) return <>{children}<div className="fixed bottom-[max(12px,env(safe-area-inset-bottom))] right-3 z-[100] flex items-center gap-3 rounded-2xl border border-white bg-white/90 px-3 py-2 text-xs shadow-[0_4px_16px_#7185ae25] backdrop-blur-xl"><Link href="/admin" className="flex min-h-8 items-center gap-2 text-blue-600"><span className="grid h-7 w-7 place-items-center rounded-full bg-blue-100"><UserRound size={19} fill="#76aaff" strokeWidth={1.5} /></span>Admin</Link><span aria-hidden="true" className="h-4 w-px bg-slate-200" /><button type="button" onClick={async () => { const { error } = await getSupabase().auth.signOut(); if (!error) setAllowed(false); }} className="min-h-8 text-slate-600 hover:text-blue-600">Sign out</button></div></>;
  return <main className="grid min-h-dvh place-items-center bg-slate-50 px-5 text-slate-900"><div className="w-full max-w-md rounded-[var(--portfolio-radius)] border border-slate-200 bg-white p-7 shadow-sm"><Link href="/" className="text-sm text-blue-600">← Back to portfolio</Link><h1 className="mt-5 text-2xl font-semibold">Portfolio admin</h1>{!cloudEnabled ? <p className="mt-4 text-sm leading-relaxed text-slate-600">Cloud storage is not configured yet. Create a Supabase project, run supabase/migrations/001_portfolio.sql, and add the environment variables from .env.example. Full instructions are in docs/SUPABASE_SETUP.md.</p> : checking ? <p role="status" className="mt-4 text-sm">Checking access…</p> : <form onSubmit={login} className="mt-5 space-y-4"><p className="text-sm text-slate-500">Sign in with your approved admin account.</p><label className="block text-sm">Email<input name="email" type="email" required autoComplete="username" className="mt-2 w-full rounded-xl border border-slate-200 p-3" /></label><label className="block text-sm">Password<input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 p-3" /></label>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button disabled={busy} className="w-full rounded-xl bg-slate-900 p-3 text-sm text-white disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button></form>}</div></main>;
}
