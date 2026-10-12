"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { HeaderSocialLinks } from "./HeaderSocialLinks";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus, Check, Upload, Pencil, Trash2 } from "lucide-react";
import { usePortfolioProjectState } from "@/lib/local-projects";
import { savePortfolioProject, removePortfolioProject } from "@/lib/portfolio-storage";
import { cloudEnabled } from "@/lib/supabase";
import type { Project } from "@/lib/projects";

const field = "mt-2 w-full rounded-[var(--portfolio-radius)] border border-[#e5eaf2] bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 disabled:opacity-60";
function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });
}
function webLink(value: string) {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Project links must use https:// or http://.");
  return url.href;
}

export function ProjectAddForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [editing, setEditing] = useState<Project | null>(null);
  const { projects, loading, error: loadError } = usePortfolioProjectState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const imageReadVersion = useRef(0);

  const removeProject = async (project: Project) => {
    if (saving) return;
    setError("");
    setSaved("");
    setSaving(true);
    try {
      await removePortfolioProject(project.slug);
      if (editing?.slug === project.slug) {
        imageReadVersion.current++;
        setEditing(null);
        setPreview("");
      }
      setSaved(`“${project.title}” deleted successfully.`);
    } catch {
      setError("Could not delete the project. Check your connection and admin access, then retry.");
    } finally { setSaving(false); }
  };

  const selectProject = (project: Project | null) => {
    imageReadVersion.current++;
    setRemoveImage(false);
    setEditing(project);
    setPreview(project?.image || "");
    setError("");
    setSaved("");
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      formRef.current?.querySelector<HTMLInputElement>('input[name="title"]')?.focus({ preventScroll: true });
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setError("");
    setSaved("");
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) || "").trim();
    const file = data.get("image");
    const replacement = file instanceof File && file.size > 0 ? file : null;
    if (!replacement && !editing) { setError("Choose a preview image for the project."); return; }
    if (replacement && (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(replacement.type) || replacement.size > 2 * 1024 * 1024)) { setError("Choose a PNG, JPG, WebP, or AVIF image up to 2 MB."); return; }
    if (!value("title") || !value("description") || !value("category")) { setError("Enter a title, description, and category."); return; }
    setSaving(true);
    try {
      const liveLink = webLink(value("liveLink"));
      const repositoryLink = webLink(value("repositoryLink"));
      const image = replacement ? await readImage(replacement) : removeImage ? "" : editing!.image;
      const slug = editing?.slug || `${value("title").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project"}-${crypto.randomUUID().slice(0, 8)}`;
      const project: Project = {
        slug, title: value("title"), description: value("description"), category: value("category"),
        client: value("client") || "Personal project", year: value("year"), role: value("role"),
        serviceProvided: value("serviceProvided"), liveLink, repositoryLink, image, imagePath: removeImage ? undefined : editing?.imagePath, isTall: data.get("isTall") === "on", isPrivate: data.get("isPrivate") === "on",
        techStack: [...new Set(value("techStack").split(",").map(tech => tech.trim()).filter(Boolean))],
        goal: { text: value("goal"), image: editing?.goal?.image || "" }, challenge: { text: value("challenge"), image: editing?.challenge?.image || "" }, result: { text: value("result"), image: editing?.result?.image || "" },
      };
      await savePortfolioProject(project, Boolean(editing));
      setSaved(editing ? "Project updated successfully." : "Project added successfully.");
      setEditing(null);
      setRemoveImage(false);
      formRef.current?.reset();
      setPreview("");
      imageReadVersion.current++;
    } catch (cause) {
      setError(cause instanceof DOMException && (cause.name === "QuotaExceededError" || cause.name === "SecurityError") ? "Browser storage is full or disabled. Try a smaller image or allow site storage. Your form is kept so you can retry." : cause instanceof Error ? cause.message : "Could not save the project. Please retry.");
    } finally { setSaving(false); }
  };

  return (
    <main className="min-h-dvh bg-[linear-gradient(135deg,#fff,#f8faff_50%,#f3f7ff)] px-5 py-8 font-sans text-slate-900 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Editor navigation" className="mb-7 flex flex-wrap items-center gap-4"><Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"><ArrowLeft size={16} />Back to portfolio</Link><Link href="/admin" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"><ArrowLeft size={16} />Back to admin</Link></nav>
        <header className="mb-7 flex flex-wrap items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-[var(--portfolio-radius)] border border-blue-100 bg-white text-blue-500 shadow-sm"><FolderPlus size={27} /></div><div><h1 className="text-3xl font-semibold tracking-tight">Add a project</h1><p className="mt-2 text-sm text-slate-500">Add your work to the portfolio’s Projects app.</p></div><div className="ml-auto"><HeaderSocialLinks /></div></header>
        <p className="mb-6 rounded-[var(--portfolio-radius)] border border-blue-100 bg-white/80 p-4 text-xs leading-relaxed text-slate-500">{cloudEnabled ? "Projects and images are saved to shared cloud storage. Public projects appear for all visitors; private projects are visible only to you." : "Projects are saved in this browser on this device."}</p>
        {saved && <div role="status" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--portfolio-radius)] border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"><span className="inline-flex items-center gap-2"><Check size={18} />{saved}</span><button type="button" onClick={() => { sessionStorage.setItem("activeWindow", "projects"); sessionStorage.setItem("isMaximized", "false"); router.push("/"); }} className="rounded-[var(--portfolio-radius)] bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">View in Projects</button></div>}
        <form key={editing?.slug || "new"} ref={formRef} onSubmit={submit} className="scroll-mt-6 rounded-[var(--portfolio-radius)] border border-[#e5eaf2] bg-white/90 p-6 shadow-[0_12px_40px_#647c9c0c] sm:p-8">
          {loadError && <p role="alert" className="mb-5 text-sm text-red-600">{loadError}</p>}
          {loading && <p role="status" className="mb-5 text-sm text-slate-500">Loading projects…</p>}
          <fieldset disabled={saving || loading || Boolean(loadError)} className="space-y-5 disabled:opacity-60">
            <legend className="mb-5 text-lg font-semibold">{editing ? `Edit ${editing.title}` : "Project details"}</legend>
            <label className="block text-xs font-medium text-slate-600">Title *<input name="title" defaultValue={editing?.title || ""} required maxLength={140} placeholder="Project name" className={field} /></label>
            <label className="block text-xs font-medium text-slate-600">Description *<textarea name="description" defaultValue={editing?.description || ""} required maxLength={3000} rows={4} placeholder="What does the project do, and who is it for?" className={field} /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-600">Category *<input name="category" defaultValue={editing?.category || ""} required maxLength={100} placeholder="Web Development • E-commerce" className={field} /></label>
              <label className="text-xs font-medium text-slate-600">Client / organization<input name="client" defaultValue={editing?.client || ""} maxLength={120} placeholder="Personal project" className={field} /></label>
              <label className="text-xs font-medium text-slate-600">Year<input name="year" defaultValue={editing?.year || ""} inputMode="numeric" maxLength={20} placeholder="2026" className={field} /></label>
              <label className="text-xs font-medium text-slate-600">Your role<input name="role" defaultValue={editing?.role || ""} maxLength={120} placeholder="Full Stack Developer" className={field} /></label>
            </div>
            <label className="block text-xs font-medium text-slate-600">Technologies (comma-separated)<input name="techStack" defaultValue={editing?.techStack.join(", ") || ""} maxLength={500} placeholder="React, Next.js, MongoDB" className={field} /></label>
            <label className="block text-xs font-medium text-slate-600">Services provided<input name="serviceProvided" defaultValue={editing?.serviceProvided || ""} maxLength={250} placeholder="Web Development, UI Design" className={field} /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-600">Live project URL<input name="liveLink" defaultValue={editing?.liveLink || ""} type="url" maxLength={2000} placeholder="https://your-project.com" className={field} /></label>
              <label className="text-xs font-medium text-slate-600">GitHub / repository URL<input name="repositoryLink" defaultValue={editing?.repositoryLink || ""} type="url" maxLength={2000} placeholder="https://github.com/username/project" className={field} /></label>
            </div>
            <label className="block text-xs font-medium text-slate-600"><span className="inline-flex items-center gap-2"><Upload size={15} />Preview image {editing ? "(optional replacement, up to 2 MB)" : "* (up to 2 MB)"}</span><input name="image" type="file" required={!editing} accept="image/png,image/jpeg,image/webp,image/avif" className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:text-blue-600`} onChange={async event => {
              const version = ++imageReadVersion.current;
              const file = event.target.files?.[0];
              setPreview(removeImage ? "" : editing?.image || "");
              if (!file || file.size > 2 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)) return;
              try { const image = await readImage(file); if (version === imageReadVersion.current) setPreview(image); } catch { setError("Could not preview this image. Choose another file."); }
            }} /></label>
            {(editing?.image || editing?.imagePath) && <div className="rounded-[var(--portfolio-radius)] border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600"><p>{removeImage ? "Current image will be removed when you save changes. A new upload will replace it." : "Leave the upload empty to keep the current image."}</p><button type="button" onClick={() => { imageReadVersion.current++; setRemoveImage(value => !value); const input = formRef.current?.querySelector<HTMLInputElement>('input[name="image"]'); if (input) input.value = ""; setPreview(removeImage ? editing.image : ""); }} className="mt-2 inline-flex min-h-11 items-center gap-2 font-medium text-red-600 hover:text-red-800"><Trash2 size={14} />{removeImage ? "Undo removal" : "Remove current image"}</button></div>}
            {/* Local data URL preview needs no server-side image optimization. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {preview && <img src={preview} alt="Selected project preview" className="max-h-64 w-full rounded-[var(--portfolio-radius)] border border-slate-100 bg-slate-50 object-contain" />}
            <label className="flex items-center gap-2 text-xs text-slate-600"><input name="isTall" type="checkbox" defaultChecked={editing?.isTall} className="accent-blue-600" />Use a tall screenshot layout</label>
            <label className="flex items-start gap-3 rounded-[var(--portfolio-radius)] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"><input name="isPrivate" type="checkbox" defaultChecked={editing?.isPrivate === true} className="mt-0.5 accent-blue-600" /><span><span className="font-medium">Private project</span><span className="mt-1 block text-xs leading-relaxed text-slate-500">Hide this project from the portfolio’s Projects page. You can still view and edit it in the list below.</span></span></label>
            <details className="rounded-[var(--portfolio-radius)] border border-slate-100 p-4"><summary className="cursor-pointer text-sm font-medium">Optional case study</summary><div className="mt-4 space-y-4">{["goal", "challenge", "result"].map(name => <label key={name} className="block text-xs font-medium capitalize text-slate-600">{name}<textarea name={name} defaultValue={editing?.[name as "goal" | "challenge" | "result"]?.text || ""} rows={3} maxLength={2000} className={field} /></label>)}</div></details>
            {error && <p role="alert" className="rounded-[var(--portfolio-radius)] bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="flex flex-wrap gap-3"><button type="submit" className="rounded-[var(--portfolio-radius)] bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">{saving ? "Saving project…" : editing ? "Save changes" : "Add project"}</button>{editing && <button type="button" onClick={() => selectProject(null)} className="rounded-[var(--portfolio-radius)] border border-slate-200 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50">Cancel edit</button>}</div>
          </fieldset>
        </form>
        <section aria-labelledby="project-list-heading" className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4"><h2 id="project-list-heading" className="text-xl font-semibold">Your projects <span className="text-sm font-normal text-slate-400">({projects.length})</span></h2>{editing && <button type="button" disabled={saving} onClick={() => selectProject(null)} className="text-sm font-medium text-blue-600 disabled:opacity-50">Add new project</button>}</div>
          <div className="space-y-3">{projects.map(project => <article key={project.slug} className={`flex flex-wrap items-start justify-between gap-4 rounded-[var(--portfolio-radius)] border bg-white/90 p-5 shadow-sm ${editing?.slug === project.slug ? "border-blue-300 ring-2 ring-blue-50" : "border-[#e5eaf2]"}`}><div className="min-w-0 flex-1"><h3 className="break-words font-semibold">{project.title}</h3><span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${project.isPrivate ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{project.isPrivate ? "Private" : "Public"}</span><p className="mt-1 text-xs text-slate-500">{[project.category, project.year].filter(Boolean).join(" · ")}</p><p className="mt-2 line-clamp-2 break-words text-sm leading-relaxed text-slate-600">{project.description}</p></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" disabled={saving} onClick={() => selectProject(project)} aria-label={`Edit ${project.title}`} className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"><Pencil size={14} />Edit</button><button type="button" disabled={saving} onClick={() => { removeProject(project); }} aria-label={`Delete ${project.title}`} className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={14} />Delete</button></div></article>)}</div>
        </section>
      </div>
    </main>
  );
}
