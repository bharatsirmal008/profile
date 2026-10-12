"use client";

import { useMemo, useSyncExternalStore } from "react";
import { projects, type Project } from "./projects";
import { cloudEnabled } from "./supabase";
import { useCloudRecords } from "./cloud-content";

const KEY = "portfolio-added-projects";
const CHANGE_EVENT = "portfolio-projects-changed";

function readSnapshot() {
  try { return localStorage.getItem(KEY) || "[]"; } catch { return "[]"; }
}
function parseProjects(value: string): Project[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p): p is Project => Boolean(p && typeof p === "object" && typeof p.slug === "string" && typeof p.title === "string" && typeof p.description === "string" && typeof p.category === "string" && typeof p.image === "string" && Array.isArray(p.techStack)));
  } catch { return []; }
}
function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === KEY || event.key === null) callback(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(CHANGE_EVENT, callback); };
}
export function usePortfolioProjectState(includePrivate = false) {
  const cloud = useCloudRecords("project", includePrivate);
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => "[]");
  const items = useMemo(() => {
    if (cloudEnabled) return cloud.records.map(record => ({ ...record.data, slug: record.id, isPrivate: record.is_private } as unknown as Project));
    const saved = parseProjects(snapshot);
    const overrides = new Map(saved.map(project => [project.slug, project]));
    const builtInSlugs = new Set(projects.map(project => project.slug));
    const merged = [...saved.filter(project => !builtInSlugs.has(project.slug)), ...projects.map(project => overrides.get(project.slug) || project)].filter(project => project.isDeleted !== true);
    return includePrivate ? merged : merged.filter(project => project.isPrivate !== true);
  }, [snapshot, includePrivate, cloud.records]);
  return { projects: items, loading: cloud.loading, error: cloud.error };
}
export function usePortfolioProjects(includePrivate = false) { return usePortfolioProjectState(includePrivate).projects; }
export function addLocalProject(project: Project) {
  // Read/write directly so quota and privacy-mode failures reach the form.
  const previous = localStorage.getItem(KEY) || "[]";
  localStorage.setItem(KEY, JSON.stringify([project, ...parseProjects(previous)]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function updateLocalProject(project: Project) {
  const previous = parseProjects(localStorage.getItem(KEY) || "[]");
  const exists = previous.some(item => item.slug === project.slug);
  const next = exists ? previous.map(item => item.slug === project.slug ? project : item) : [...previous, project];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function deleteLocalProject(slug: string) {
  const remaining = parseProjects(localStorage.getItem(KEY) || "[]").filter(project => project.slug !== slug);
  const builtIn = projects.find(project => project.slug === slug);
  // Keep a deletion marker so a built-in project does not reappear after refresh.
  if (builtIn) remaining.push({ ...builtIn, isDeleted: true });
  localStorage.setItem(KEY, JSON.stringify(remaining));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
