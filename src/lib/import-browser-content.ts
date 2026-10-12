"use client";

import { projects as builtInProjects, type Project } from "./projects";
import { builtInCertificates, loadCertificates } from "./certificate-storage";
import { parseResume } from "./resume-data";
import { getSupabase } from "./supabase";
import { requireAdmin, saveCloud, type ContentKind } from "./cloud-content";
import { savePortfolioCertificate, savePortfolioProject } from "./portfolio-storage";

export async function importBrowserContent(progress: (message: string) => void) {
  await requireAdmin();
  // Include deleted IDs so repeat imports never restore deleted or overwrite edited cloud entries.
  const { data: existing, error } = await getSupabase().from("portfolio_content").select("kind,id");
  if (error) throw error;
  const known = new Set(existing.map(row => `${row.kind}:${row.id}`));
  const raw: unknown = JSON.parse(localStorage.getItem("portfolio-added-projects") || "[]");
  if (!Array.isArray(raw)) throw new Error("Browser project data is invalid; import stopped without clearing local data.");
  const localProjects = raw as Project[];
  const projectMap = new Map(builtInProjects.map(project => [project.slug, project]));
  for (const project of localProjects) {
    if (!project || typeof project.slug !== "string" || typeof project.image !== "string" || !Array.isArray(project.techStack)) throw new Error("A browser project is invalid. Fix it before importing.");
    projectMap.set(project.slug, project);
  }
  const certificateMap = new Map(builtInCertificates.map(certificate => [certificate.id, certificate]));
  for (const certificate of await loadCertificates()) certificateMap.set(certificate.id, certificate);
  let imported = 0;
  const canImport = (kind: ContentKind, id: string) => !known.has(`${kind}:${id}`);
  for (const project of projectMap.values()) {
    if (!canImport("project", project.slug)) continue;
    progress(`Importing project: ${project.title}`);
    if (project.isDeleted) await saveCloud("project", project.slug, {}, true, true);
    else await savePortfolioProject(project);
    imported++;
  }
  for (const certificate of certificateMap.values()) {
    if (!canImport("certificate", certificate.id)) continue;
    progress(`Importing certificate: ${certificate.title}`);
    if (certificate.isDeleted) await saveCloud("certificate", certificate.id, {}, true, true);
    else await savePortfolioCertificate(certificate);
    imported++;
  }
  if (canImport("resume", "main")) {
    progress("Importing resume…");
    await saveCloud("resume", "main", { ...parseResume(localStorage.getItem("portfolio-resume")) });
    imported++;
  }
  return imported;
}
