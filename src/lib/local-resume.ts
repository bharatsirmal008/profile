"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseResume, type ResumeData } from "./resume-data";
import { cloudEnabled } from "./supabase";
import { requireAdmin, saveCloud, useCloudRecords } from "./cloud-content";

const KEY = "portfolio-resume";
const CHANGE_EVENT = "portfolio-resume-changed";

function readSnapshot() {
  try { return localStorage.getItem(KEY) || ""; } catch { return ""; }
}
function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === KEY || event.key === null) callback(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(CHANGE_EVENT, callback); };
}
export function useResumeContent() {
  const cloud = useCloudRecords("resume");
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => "");
  const resume = useMemo(() => parseResume(cloudEnabled ? JSON.stringify(cloud.records[0]?.data || null) : snapshot), [snapshot, cloud.records]);
  return { resume, loading: cloud.loading, error: cloud.error };
}
export async function saveLocalResume(resume: ResumeData) {
  if (cloudEnabled) { await requireAdmin(); await saveCloud("resume", "main", { ...resume }); return; }
  localStorage.setItem(KEY, JSON.stringify(resume));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
