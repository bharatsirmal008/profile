"use client";

import { useEffect, useState } from "react";
import { cloudEnabled, getSupabase } from "./supabase";

export type ContentKind = "project" | "certificate" | "resume";
export type CloudRecord = { id: string; kind: ContentKind; data: Record<string, unknown>; is_private: boolean; is_deleted: boolean };
const BUCKET = "portfolio-files";
const CHANGED = "portfolio-cloud-changed";
export function notifyCloud() { window.dispatchEvent(new Event(CHANGED)); }

export async function requireAdmin() {
  const client = getSupabase();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) throw new Error("Sign in with your admin account first.");
  const result = await client.rpc("is_portfolio_admin");
  if (result.error || result.data !== true) throw new Error("This account does not have portfolio admin access.");
}

export async function listCloud(kind: ContentKind, includePrivate = false): Promise<CloudRecord[]> {
  let query = getSupabase().from("portfolio_content").select("id,kind,data,is_private,is_deleted").eq("kind", kind).eq("is_deleted", false).order("created_at", { ascending: false });
  if (!includePrivate) query = query.eq("is_private", false);
  const { data, error } = await query;
  if (error) throw error;
  return data as CloudRecord[];
}

export async function signedFile(path: string) {
  const { data, error } = await getSupabase().storage.from(BUCKET).createSignedUrl(path, 300);
  if (error) throw error;
  return data.signedUrl;
}

export async function uploadFile(kind: ContentKind, id: string, file: Blob) {
  const allowed = ["image/png", "image/jpeg", "image/webp", "image/avif", ...(kind === "certificate" ? ["application/pdf"] : [])];
  if (!allowed.includes(file.type) || file.size > (kind === "project" ? 2 : 10) * 1024 * 1024) throw new Error("Unsupported file type or file too large.");
  const extension = file.type.split("/")[1];
  const path = `${kind}/${encodeURIComponent(id)}/${crypto.randomUUID()}.${extension}`;
  const { error } = await getSupabase().storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return path;
}

export async function discardFile(path: string) {
  const { error } = await getSupabase().storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function saveCloud(kind: ContentKind, id: string, data: Record<string, unknown>, isPrivate = false, isDeleted = false) {
  const { error } = await getSupabase().from("portfolio_content").upsert({ kind, id, data, is_private: isPrivate, is_deleted: isDeleted }, { onConflict: "kind,id" });
  if (error) throw error;
  notifyCloud();
}

export async function deleteCloud(kind: ContentKind, id: string) {
  await requireAdmin();
  // Keep a tombstone so importing browser data cannot resurrect a deleted entry.
  await saveCloud(kind, id, {}, true, true);
}

export function useCloudRecords(kind: ContentKind, includePrivate = false) {
  const [records, setRecords] = useState<CloudRecord[]>([]);
  const [loading, setLoading] = useState(cloudEnabled);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!cloudEnabled) return;
    let cancelled = false;
    let version = 0;
    const refresh = async () => {
      const current = ++version;
      try {
        const next = await listCloud(kind, includePrivate);
        // Resolve asset links before publishing the next snapshot.
        await Promise.all(next.map(async record => {
          for (const key of ["imagePath", "filePath"] as const) {
            const path = record.data[key];
            if (typeof path === "string" && path) {
              try { record.data[key === "imagePath" ? "image" : "fileUrl"] = await signedFile(path); }
              catch { record.data[key === "imagePath" ? "image" : "fileUrl"] = ""; }
            }
          }
        }));
        if (!cancelled && current === version) { setRecords(next); setError(""); }
      } catch (cause) {
        if (!cancelled && current === version) setError(cause instanceof Error ? cause.message : "Cloud content could not be loaded. Please retry.");
      } finally { if (!cancelled && current === version) setLoading(false); }
    };
    void refresh();
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(() => { setTimeout(() => { if (!cancelled) void refresh(); }, 0); });
    const timer = window.setInterval(refresh, 240_000);
    window.addEventListener(CHANGED, refresh);
    window.addEventListener("focus", refresh);
    return () => { cancelled = true; subscription.unsubscribe(); clearInterval(timer); window.removeEventListener(CHANGED, refresh); window.removeEventListener("focus", refresh); };
  }, [kind, includePrivate]);
  return { records, loading, error };
}
