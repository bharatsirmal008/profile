"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { HeaderSocialLinks } from "./HeaderSocialLinks";
import { useRouter } from "next/navigation";
import { ArrowLeft, Award, Check, Download, Pencil, Upload, Trash2 } from "lucide-react";
import { type Certificate, type CertificateCategory } from "@/lib/certificate-storage";
import { useCertificates, type DisplayCertificate } from "@/lib/use-certificates";

import { savePortfolioCertificate, removePortfolioCertificate } from "@/lib/portfolio-storage";
import { cloudEnabled } from "@/lib/supabase";

const categories: CertificateCategory[] = ["Internship", "Course", "Other"];
const fileTypes = ["application/pdf", "image/png", "image/jpeg", "image/webp", "image/avif"];
const field = "mt-2 w-full rounded-[var(--portfolio-radius)] border border-[#e5eaf2] bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50";

export function CertificateUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { certificates, loading, error: storageError } = useCertificates(true);
  const [editing, setEditing] = useState<DisplayCertificate | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const currentFileUrl = certificates.find(certificate => certificate.id === editing?.id)?.fileUrl;

  const removeCertificate = async (certificate: Certificate) => {
    if (saving) return;
    setSaving(true);
    setError("");
    setSaved("");
    try {
      await removePortfolioCertificate(certificate.id);
      if (editing?.id === certificate.id) setEditing(null);
      setSaved(`“${certificate.title}” deleted successfully.`);
    } catch {
      setError("Could not delete the certificate. Check your connection and admin access, then retry.");
    } finally { setSaving(false); }
  };

  const selectCertificate = (certificate: DisplayCertificate | null) => {
    setEditing(certificate);
    setRemoveFile(false);
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
    const selected = data.get("file");
    const replacement = selected instanceof File && selected.size > 0 ? selected : null;
    if (!value("title")) { setError("Enter a certificate title."); return; }
    const category = value("category") as CertificateCategory;
    if (!categories.includes(category)) { setError("Choose a valid category."); return; }
    if (!replacement && !editing) { setError("Choose a certificate image or PDF."); return; }
    if (replacement && (!fileTypes.includes(replacement.type) || replacement.size > 10 * 1024 * 1024)) { setError("Choose a PDF, PNG, JPG, WebP, or AVIF file up to 10 MB."); return; }
    setSaving(true);
    try {
      const certificate: Certificate = {
        id: editing?.id || crypto.randomUUID(), title: value("title"), category,
        issuer: value("issuer"), description: value("description"),
        skills: [...new Set(value("skills").split(",").map(skill => skill.trim()).filter(Boolean))],
        file: replacement || (removeFile ? undefined : editing?.file), filename: replacement?.name || (removeFile ? undefined : editing?.filename),
        filePath: removeFile ? undefined : editing?.filePath, fileType: replacement?.type || (removeFile ? undefined : editing?.fileType),
        isPrivate: data.get("isPrivate") === "on",
      };
      await savePortfolioCertificate(certificate);
      setSaved(editing ? "Certificate updated successfully." : "Certificate added successfully.");
      setEditing(null);
      setRemoveFile(false);
      formRef.current?.reset();
    } catch {
      setError("Certificate could not be saved. Check your connection, storage setup, and admin access. Your form is kept so you can retry.");
    } finally { setSaving(false); }
  };

  return (
    <main className="min-h-dvh bg-[linear-gradient(135deg,#fff,#f8faff_50%,#f3f7ff)] px-5 py-8 font-sans text-slate-900 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Editor navigation" className="mb-7 flex flex-wrap items-center gap-4"><Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"><ArrowLeft size={16} />Back to portfolio</Link><Link href="/admin" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"><ArrowLeft size={16} />Back to admin</Link></nav>
        <header className="mb-7 flex flex-wrap items-center gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--portfolio-radius)] border border-blue-100 bg-white text-blue-500 shadow-sm"><Award size={27} /></div><div><h1 className="text-3xl font-semibold tracking-tight">Manage certificates</h1><p className="mt-2 text-sm text-slate-500">Upload certificates, edit their details, and choose their visibility.</p></div><div className="ml-auto"><HeaderSocialLinks /></div></header>
        <p className="mb-6 rounded-[var(--portfolio-radius)] border border-blue-100 bg-white/80 p-4 text-xs leading-relaxed text-slate-500">{cloudEnabled ? "Certificates and files are saved to shared cloud storage. Public certificates appear for all visitors; private certificates and files are accessible only to you." : "Certificates are saved in this browser on this device."}</p>
        {storageError && <p role="alert" className="mb-6 rounded-[var(--portfolio-radius)] bg-red-50 p-4 text-sm text-red-700">{storageError}</p>}
        {saved && <div role="status" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--portfolio-radius)] border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800"><span className="inline-flex items-center gap-2"><Check size={18} />{saved}</span><button type="button" onClick={() => { sessionStorage.setItem("activeWindow", "certificates"); sessionStorage.setItem("isMaximized", "false"); router.push("/"); }} className="rounded-[var(--portfolio-radius)] bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">View in Certificates</button></div>}
        <form key={editing?.id || "new"} ref={formRef} onSubmit={submit} className="scroll-mt-6 rounded-[var(--portfolio-radius)] border border-[#e5eaf2] bg-white/90 p-6 shadow-[0_12px_40px_#647c9c0c] sm:p-8">
          <fieldset disabled={saving || loading} className="space-y-5 disabled:opacity-60">
            <legend className="mb-5 text-lg font-semibold">{editing ? `Edit ${editing.title}` : "Upload a certificate"}</legend>
            <label className="block text-xs font-medium text-slate-600">Title *<input name="title" required maxLength={160} defaultValue={editing?.title || ""} placeholder="Certificate name" className={field} /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-600">Category *<select name="category" required defaultValue={editing?.category || "Course"} className={field}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
              <label className="text-xs font-medium text-slate-600">Issuer / organization<input name="issuer" maxLength={120} defaultValue={editing?.issuer || ""} placeholder="Organization name" className={field} /></label>
            </div>
            <label className="block text-xs font-medium text-slate-600">Description<textarea name="description" rows={4} maxLength={1000} defaultValue={editing?.description || ""} placeholder="What did you learn or accomplish?" className={field} /></label>
            <label className="block text-xs font-medium text-slate-600">Skills (comma-separated)<input name="skills" maxLength={500} defaultValue={editing?.skills.join(", ") || ""} placeholder="Python, Data Analytics, Cloud Computing" className={field} /></label>
            <label className="block text-xs font-medium text-slate-600"><span className="inline-flex items-center gap-2"><Upload size={15} />Certificate file {editing ? "(optional replacement)" : "*"}</span><input name="file" type="file" required={!editing} accept={fileTypes.join(",")} className={`${field} file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:text-blue-600`} /><span className="mt-2 block font-normal text-slate-400">PDF, PNG, JPG, WebP, or AVIF, up to 10 MB.</span></label>
            {(editing?.file || editing?.filePath) && <div className="rounded-[var(--portfolio-radius)] border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600"><p className="break-words">{removeFile ? "Current file will be removed when you save changes. A new upload will replace it." : `Current file: ${editing.filename || "Certificate file"}. Leave the upload empty to keep it.`}</p><div className="mt-2 flex flex-wrap items-center gap-4">{!removeFile && currentFileUrl && <a href={currentFileUrl} download={editing.filename} className="inline-flex items-center gap-2 font-medium text-blue-600"><Download size={14} />Download current file</a>}<button type="button" onClick={() => setRemoveFile(value => !value)} className="inline-flex min-h-11 items-center gap-2 font-medium text-red-600 hover:text-red-800"><Trash2 size={14} />{removeFile ? "Undo removal" : "Remove current file"}</button></div></div>}
            <label className="flex items-start gap-3 rounded-[var(--portfolio-radius)] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"><input name="isPrivate" type="checkbox" defaultChecked={editing?.isPrivate === true} className="mt-0.5 accent-blue-600" /><span><span className="font-medium">Private certificate</span><span className="mt-1 block text-xs leading-relaxed text-slate-500">Hide this certificate from the portfolio’s Certificates app. You can still view and edit it below.</span></span></label>
            {error && <p role="alert" className="rounded-[var(--portfolio-radius)] bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="flex flex-wrap gap-3"><button type="submit" className="rounded-[var(--portfolio-radius)] bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">{saving ? "Saving certificate…" : editing ? "Save changes" : "Add certificate"}</button>{editing && <button type="button" onClick={() => selectCertificate(null)} className="rounded-[var(--portfolio-radius)] border border-slate-200 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50">Cancel edit</button>}</div>
          </fieldset>
        </form>
        <section aria-labelledby="certificate-list-heading" className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4"><h2 id="certificate-list-heading" className="text-xl font-semibold">Your certificates <span className="text-sm font-normal text-slate-400">({certificates.length})</span></h2>{editing && <button type="button" disabled={saving} onClick={() => selectCertificate(null)} className="text-sm font-medium text-blue-600 disabled:opacity-50">Add new certificate</button>}</div>
          {loading ? <p role="status" className="text-sm text-slate-500">Loading certificates…</p> : <div className="space-y-3">{certificates.map(certificate => <article key={certificate.id} className={`flex flex-wrap items-start justify-between gap-4 rounded-[var(--portfolio-radius)] border bg-white/90 p-5 shadow-sm ${editing?.id === certificate.id ? "border-blue-300 ring-2 ring-blue-50" : "border-[#e5eaf2]"}`}><div className="min-w-0 flex-1"><h3 className="break-words font-semibold">{certificate.title}</h3><p className="mt-1 text-xs text-slate-500">{[certificate.category, certificate.issuer].filter(Boolean).join(" · ")}</p><span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${certificate.isPrivate ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{certificate.isPrivate ? "Private" : "Public"}</span>{certificate.description && <p className="mt-2 line-clamp-2 break-words text-sm leading-relaxed text-slate-600">{certificate.description}</p>}{certificate.fileUrl && <a href={certificate.fileUrl} download={certificate.filename} className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-blue-600"><Download size={14} />Download certificate</a>}</div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" disabled={saving} onClick={() => selectCertificate(certificate)} aria-label={`Edit ${certificate.title}`} className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"><Pencil size={14} />Edit</button><button type="button" disabled={saving} onClick={() => { void removeCertificate(certificate); }} aria-label={`Delete ${certificate.title}`} className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 size={14} />Delete</button></div></article>)}</div>}
          {!loading && !storageError && certificates.length === 0 && <p className="text-sm text-slate-500">No certificates yet. Use the form above to add one.</p>}
        </section>
      </div>
    </main>
  );
}
