"use client";

import type { Project } from "./projects";
import type { Certificate } from "./certificate-storage";
import { saveCertificate, deleteCertificate } from "./certificate-storage";
import { addLocalProject, updateLocalProject, deleteLocalProject } from "./local-projects";
import { cloudEnabled, getSupabase } from "./supabase";
import { discardFile, requireAdmin, saveCloud, uploadFile, deleteCloud, type ContentKind } from "./cloud-content";

async function previousPath(kind: ContentKind, id: string, field: string) {
  const { data, error } = await getSupabase().from("portfolio_content").select("data").eq("kind", kind).eq("id", id).maybeSingle();
  if (error) throw error;
  return typeof data?.data?.[field] === "string" ? data.data[field] as string : undefined;
}
async function cleanup(path?: string) {
  if (path) { try { await discardFile(path); } catch { /* The entry is saved; inaccessible orphan files can be removed in Storage. */ } }
}

export async function savePortfolioProject(project: Project, editing = false) {
  if (!cloudEnabled) { if (editing) updateLocalProject(project); else addLocalProject(project); return; }
  await requireAdmin();
  const oldPath = await previousPath("project", project.slug, "imagePath");
  let uploaded: string | undefined;
  try {
    if (project.image.startsWith("data:")) {
      const response = await fetch(project.image);
      uploaded = await uploadFile("project", project.slug, await response.blob());
    }
    const imagePath = uploaded || project.imagePath;
    const data = { ...project, imagePath: imagePath || null, image: imagePath ? "" : project.image };
    await saveCloud("project", project.slug, data, project.isPrivate, project.isDeleted);
    if (oldPath !== imagePath) await cleanup(oldPath);
  } catch (error) { await cleanup(uploaded); throw error; }
}

export async function savePortfolioCertificate(certificate: Certificate) {
  if (!cloudEnabled) return saveCertificate(certificate);
  await requireAdmin();
  const oldPath = await previousPath("certificate", certificate.id, "filePath");
  let uploaded: string | undefined;
  try {
    if (certificate.file) uploaded = await uploadFile("certificate", certificate.id, certificate.file);
    const filePath = uploaded || certificate.filePath;
    const { file, ...details } = certificate;
    const data = { ...details, filePath: filePath || null, fileType: file?.type || certificate.fileType || "" };
    await saveCloud("certificate", certificate.id, data, certificate.isPrivate, certificate.isDeleted);
    if (oldPath !== filePath) await cleanup(oldPath);
  } catch (error) { await cleanup(uploaded); throw error; }
}

export async function removePortfolioProject(slug: string) {
  if (!cloudEnabled) { deleteLocalProject(slug); return; }
  await requireAdmin();
  const path = await previousPath("project", slug, "imagePath");
  await deleteCloud("project", slug);
  await cleanup(path);
}
export async function removePortfolioCertificate(id: string) {
  if (!cloudEnabled) return deleteCertificate(id);
  await requireAdmin();
  const path = await previousPath("certificate", id, "filePath");
  await deleteCloud("certificate", id);
  await cleanup(path);
}
