"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Pencil, Save, Plus, Trash2 } from "lucide-react";
import { LetterReveal } from "./LetterReveal";
import { saveLocalResume, useResumeContent } from "@/lib/local-resume";
import { cloudEnabled } from "@/lib/supabase";
import type { ResumeData, ResumeEntry } from "@/lib/resume-data";

function EditField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  const className = "w-full min-w-0 rounded-[var(--portfolio-radius)] border border-blue-200 bg-blue-50/40 px-2 py-1.5 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
  return <label className="block min-w-0 flex-1"><span className="sr-only">{label}</span>{multiline ? <textarea aria-label={label} value={value} onChange={event => onChange(event.target.value)} rows={Math.min(6, Math.max(2, Math.ceil(value.length / 90)))} maxLength={4000} className={className} /> : <input aria-label={label} value={value} onChange={event => onChange(event.target.value)} maxLength={300} className={className} />}</label>;
}
function safeLink(value: string) {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}

export function Resume({ editable = false }: { editable?: boolean }) {
  const { resume: savedResume, loading, error: loadError } = useResumeContent();
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [draft, setDraft] = useState<ResumeData | null>(null);
  const [editing, setEditing] = useState(editable);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const data = draft || savedResume;
  const update = (change: (current: ResumeData) => ResumeData) => {
    setDraft(current => change(current || savedResume));
    setNotice("");
    setError("");
  };
  const updateEntry = (sectionId: string, entryId: string, change: (entry: ResumeEntry) => ResumeEntry) => update(current => ({ ...current, sections: current.sections.map(section => section.id === sectionId ? { ...section, entries: section.entries.map(entry => entry.id === entryId ? change(entry) : entry) } : section) }));
  const save = async () => {
    if (saving || loading || loadError) return;
    setError("");
    if (!data.name.trim()) { setError("Enter your name before saving."); return; }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError("Enter a valid email address."); return; }
    if ([data.linkedin, data.github, data.portfolio].some(link => link && !safeLink(link))) { setError("Profile links must be valid http:// or https:// URLs."); return; }
    setSaving(true);
    try {
      await saveLocalResume(data);
      setDraft(null);
      setEditing(false);
      setNotice(cloudEnabled ? "Resume published successfully. Downloads include your saved changes." : "Resume saved in this browser. Downloads include your saved changes.");
    } catch { setError("Could not save the resume. Check your connection and admin access. Your edits are kept so you can retry."); }
    finally { setSaving(false); }
  };

  const download = async () => {
    if (editing || downloading) return;
    setDownloading(true);
    setError("");
    try {
      const { createResumePdf } = await import("@/lib/resume-pdf");
      const pdf = await createResumePdf(savedResume);
      pdf.save("Bharat_Sirmal_Resume.pdf");
    } catch {
      setError("Could not generate the resume PDF. Please try again.");
    } finally { setDownloading(false); }
  };

  if (loading || loadError) return <div className="p-6 text-sm text-slate-600" role={loadError ? "alert" : "status"}>{loadError || "Loading resume…"}</div>;

  return (
    <div className="h-full w-full overflow-y-auto bg-white text-black" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-5 py-3 font-sans backdrop-blur print:hidden">
        <div className="text-xs text-slate-500">{editing ? "Edit your resume directly in this window. Save changes to update your resume." : "Resume"}</div>
        <div className="flex flex-wrap gap-2">
          {editable && <Link href="/admin" className="inline-flex min-h-9 items-center gap-2 rounded-[var(--portfolio-radius)] border border-blue-100 bg-white px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"><ArrowLeft size={14} />Back to admin</Link>}
          {editable && (editing ? <><button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"><Save size={14} />{saving ? "Saving…" : "Save changes"}</button><button type="button" onClick={() => { setDraft(null); setEditing(false); setError(""); setNotice(""); }} className="rounded-[var(--portfolio-radius)] border border-slate-200 px-3 py-2 text-xs text-slate-600">Cancel</button></> : <button type="button" onClick={() => { setEditing(true); setNotice(""); }} className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] border border-slate-200 px-3 py-2 text-xs text-slate-600"><Pencil size={14} />Edit resume</button>)}
          <button type="button" onClick={download} disabled={editing || downloading} className="inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-40"><Download size={14} />{downloading ? "Preparing PDF…" : "Download Resume"}</button>
        </div>
        {error && <p role="alert" className="w-full text-sm text-red-600">{error}</p>}
        {notice && <p role="status" className="w-full text-xs text-emerald-700">{notice}</p>}
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col gap-6 bg-white p-6 pb-24 leading-relaxed md:p-12 lg:p-16 print:gap-3 print:p-0">
        <header className="mb-2 flex flex-col items-center justify-center print:mb-0">
          <h1 className="mb-3 w-full text-center text-3xl font-bold uppercase tracking-tight md:text-4xl print:text-2xl">{editing ? <EditField label="Name" value={data.name} onChange={name => update(current => ({ ...current, name }))} /> : <LetterReveal text={data.name} />}</h1>
          {editing ? <div className="grid w-full gap-3 font-sans sm:grid-cols-2">{([ ["email", "Email"], ["location", "Location"], ["linkedin", "LinkedIn URL"], ["github", "GitHub URL"], ["portfolio", "Portfolio URL"] ] as const).map(([key, label]) => <div key={key}><p className="mb-1 text-xs text-slate-500">{label}</p><EditField label={label} value={data[key]} onChange={value => update(current => ({ ...current, [key]: value }))} /></div>)}</div> : <div className="flex flex-wrap items-center justify-center gap-1.5 break-words text-center text-[14px] font-medium">
            {data.email && <a href={`mailto:${data.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">{data.email}</a>}
            {data.linkedin && <><span>|</span><a href={safeLink(data.linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">LinkedIn</a></>}
            {data.github && <><span>|</span><a href={safeLink(data.github)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">GitHub</a></>}
            {data.portfolio && <><span>|</span><a href={safeLink(data.portfolio)} className="text-blue-600 hover:text-blue-800 hover:underline">Portfolio-{data.name}</a></>}
            {data.location && <><span>|</span><span>{data.location}</span></>}
          </div>}
        </header>
        {data.sections.map(section => <section key={section.id}>
          <h2 className="mb-3 border-b-2 border-black pb-1 text-lg font-bold uppercase print:mb-2">{editing ? <EditField label={`${section.title} section heading`} value={section.title} onChange={title => update(current => ({ ...current, sections: current.sections.map(item => item.id === section.id ? { ...item, title } : item) }))} /> : <LetterReveal text={section.title} />}</h2>
          <div className={`flex flex-col text-[14px] ${section.id === "skills" ? "gap-1" : "gap-4"} print:gap-1`}>{section.entries.map(entry => !editing && section.id === "skills" ? <div key={entry.id} className="whitespace-pre-wrap break-words"><strong>{entry.title.replace(/:\s*$/, "")}:</strong>{" "}{[entry.subtitle, ...entry.details].filter(Boolean).join(" ")}{entry.date && <span className="ml-2 italic">{entry.date}</span>}</div> : <div key={entry.id} className={editing ? "rounded-[var(--portfolio-radius)] border border-slate-100 p-3" : ""}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              {editing ? <EditField label={`${section.title} entry title`} value={entry.title} onChange={title => updateEntry(section.id, entry.id, item => ({ ...item, title }))} /> : entry.title && <strong>{entry.title}</strong>}
              {editing ? <EditField label={`${entry.title} dates`} value={entry.date} onChange={date => updateEntry(section.id, entry.id, item => ({ ...item, date }))} /> : entry.date && <span className="italic">{entry.date}</span>}
            </div>
            {editing ? <div className="mt-2"><EditField label={`${entry.title} organization or subtitle`} value={entry.subtitle} onChange={subtitle => updateEntry(section.id, entry.id, item => ({ ...item, subtitle }))} /></div> : entry.subtitle && <p>{entry.subtitle}</p>}
            {editing ? <div className="mt-3 space-y-2">{entry.details.map((detail, index) => <div key={index} className="flex items-start gap-2"><EditField label={`${entry.title} detail ${index + 1}`} value={detail} multiline onChange={value => updateEntry(section.id, entry.id, item => ({ ...item, details: item.details.map((text, i) => i === index ? value : text) }))} /><button type="button" aria-label={`Remove detail ${index + 1} from ${entry.title}`} onClick={() => updateEntry(section.id, entry.id, item => ({ ...item, details: item.details.filter((_, i) => i !== index) }))} className="p-2 text-red-500"><Trash2 size={14} /></button></div>)}
              <div className="flex flex-wrap items-center gap-4 font-sans text-xs"><button type="button" onClick={() => updateEntry(section.id, entry.id, item => ({ ...item, details: [...item.details, ""] }))} className="inline-flex items-center gap-1 text-blue-600"><Plus size={13} />Add line</button><label className="flex items-center gap-2 text-slate-500"><input type="checkbox" checked={entry.bullets} onChange={event => updateEntry(section.id, entry.id, item => ({ ...item, bullets: event.target.checked }))} />Bullet points</label><button type="button" onClick={() => update(current => ({ ...current, sections: current.sections.map(item => item.id === section.id ? { ...item, entries: item.entries.filter(row => row.id !== entry.id) } : item) }))} className="ml-auto inline-flex items-center gap-1 text-red-500"><Trash2 size={13} />Remove entry</button></div>
            </div> : entry.bullets ? <ul className="ml-5 mt-1 list-disc space-y-1">{entry.details.filter(Boolean).map((detail, index) => <li key={index} className="whitespace-pre-wrap pl-1">{detail}</li>)}</ul> : entry.details.filter(Boolean).map((detail, index) => <p key={index} className="mt-0.5 whitespace-pre-wrap">{detail}</p>)}
          </div>)}</div>
          {editing && <button type="button" onClick={() => update(current => ({ ...current, sections: current.sections.map(item => item.id === section.id ? { ...item, entries: [...item.entries, { id: crypto.randomUUID(), title: "New entry", subtitle: "", date: "", details: [""], bullets: false }] } : item) }))} className="mt-3 inline-flex items-center gap-1 rounded-[var(--portfolio-radius)] border border-blue-100 px-3 py-2 font-sans text-xs text-blue-600"><Plus size={14} />Add entry</button>}
        </section>)}
      </div>
    </div>
  );
}
