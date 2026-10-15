"use client";

import { useEffect, useState } from "react";
import { cloudEnabled, getSupabase } from "./supabase";
import { createResourceCache } from "./resource-cache";

export type ContentKind = "project" | "certificate" | "resume";
export type CloudRecord = { id: string; kind: ContentKind; data: Record<string, unknown>; is_private: boolean; is_deleted: boolean };
const BUCKET = "portfolio-files";
const CHANGED = "portfolio-cloud-changed";
const publicContent = createResourceCache<CloudRecord[]>(45_000);
export function notifyCloud() { publicContent.clear(); window.dispatchEvent(new Event(CHANGED)); }

async function loadResolvedRecords(kind: ContentKind, includePrivate: boolean) {
  const records = await listCloud(kind, includePrivate);
  const links = new Map<string, Promise<string>>();
  return Promise.all(records.map(async record => {
    const data = { ...record.data };
    await Promise.all((["imagePath", "filePath"] as const).map(async key => {
      const path = data[key];
      if (typeof path !== "string" || !path) return;
      if (!links.has(path)) links.set(path, signedFile(path).catch(() => ""));
      data[key === "imagePath" ? "image" : "fileUrl"] = await links.get(path);
    }));
    return { ...record, data };
  }));
}
export async function preloadPublicContent(kind: ContentKind) {
  if (!cloudEnabled) return;
  return publicContent.read(kind, () => loadResolvedRecords(kind, false));
}

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
  const cached = !includePrivate && cloudEnabled ? publicContent.peek(kind) : undefined;
  const [records, setRecords] = useState<CloudRecord[]>(() => cached ?? []);
  const [loading, setLoading] = useState(cloudEnabled && !cached);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!cloudEnabled) return;
    let cancelled = false;
    let version = 0;
    const refresh = async () => {
      const current = ++version;
      try {
        const next = includePrivate
          ? await loadResolvedRecords(kind, true)
          : await publicContent.read(kind, () => loadResolvedRecords(kind, false));
        if (!cancelled && current === version) { setRecords(next); setError(""); }
      } catch (cause) {
        if (!cancelled && current === version) setError(cause instanceof Error ? cause.message : "Cloud content could not be loaded. Please retry.");
      } finally { if (!cancelled && current === version) setLoading(false); }
    };
    void refresh();
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(event => {
      if (event === "INITIAL_SESSION") return; // The initial refresh already waits for auth.
      publicContent.clear();
      version++;
      if (includePrivate) setRecords([]);
      setTimeout(() => { if (!cancelled) void refresh(); }, 0);
    });
    const timer = window.setInterval(refresh, 240_000);
    window.addEventListener(CHANGED, refresh);
    window.addEventListener("focus", refresh);
    return () => { cancelled = true; subscription.unsubscribe(); clearInterval(timer); window.removeEventListener(CHANGED, refresh); window.removeEventListener("focus", refresh); };
  }, [kind, includePrivate]);
  return { records, loading, error };
}
