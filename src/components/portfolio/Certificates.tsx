"use client";

import { useState } from "react";
import { Award, Search, ShieldCheck, BriefcaseBusiness, GraduationCap, Folder, Download } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { CertificateCategory } from "@/lib/certificate-storage";
import { useCertificates, type DisplayCertificate } from "@/lib/use-certificates";

const categories = [
  { name: "Internship", icon: BriefcaseBusiness },
  { name: "Course", icon: GraduationCap },
  { name: "Other", icon: Folder },
] as const;
function CertificateCard({ certificate, index }: { certificate: DisplayCertificate; index: number }) {
  const reducedMotion = useReducedMotion();
  const fileUrl = certificate.fileUrl;
  return (
    <motion.article initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25, delay: Math.min(index, 5) * .04 }} className="overflow-hidden rounded-[var(--portfolio-radius)] border border-emerald-100 bg-white shadow-sm">
      {/* Browser-local Blob images cannot use server-side image optimization. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {fileUrl && (certificate.fileType || certificate.file?.type || "").startsWith("image/") && <img src={fileUrl} alt={`${certificate.title} certificate`} className="h-44 w-full border-b border-emerald-50 bg-slate-50 object-contain p-3" />}
      <div className="p-5">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-emerald-700"><ShieldCheck size={17} /><span>{certificate.issuer || certificate.category}</span></div>
        <h2 className="text-lg font-semibold leading-snug">{certificate.title}</h2>
        {certificate.description && <p className="mt-3 text-sm leading-relaxed text-slate-500">{certificate.description}</p>}
        <div className="mt-4 flex flex-wrap gap-2">{certificate.skills.map(skill => <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">{skill}</span>)}</div>
        {fileUrl && <a href={fileUrl} download={certificate.filename} className="mt-5 inline-flex items-center gap-2 rounded-[var(--portfolio-radius)] bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100"><Download size={14} />Download certificate</a>}
      </div>
    </motion.article>
  );
}

export function Certificates() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CertificateCategory>("Course");
  const { certificates: allCertificates, loading, error: notice } = useCertificates();
  const results = allCertificates.filter(certificate => certificate.category === activeCategory && `${certificate.title} ${certificate.issuer} ${certificate.description} ${certificate.skills.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="min-h-full bg-[#f8fbfa] font-sans text-slate-900 md:flex">
      <aside className="shrink-0 border-b border-emerald-100 bg-white p-4 md:w-48 md:border-b-0 md:border-r">
        <p className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Certificates</p>
        <nav aria-label="Certificate categories" className="flex gap-2 md:flex-col">
          {categories.map(({ name, icon: Icon }) => <button key={name} type="button" aria-pressed={activeCategory === name} onClick={() => setActiveCategory(name)} className={`flex min-w-0 flex-1 items-center gap-2 rounded-[var(--portfolio-radius)] px-3 py-3 text-xs font-medium transition-colors md:flex-auto ${activeCategory === name ? "bg-emerald-100 text-emerald-800" : "text-slate-500 hover:bg-emerald-50"}`}><Icon size={17} className="shrink-0" /><span>{name}</span><span className="ml-auto hidden text-[10px] md:inline">{allCertificates.filter(c => c.category === name).length}</span></button>)}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 bg-white px-5 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400"><span>User</span><span aria-hidden="true">/</span><span>Certificates</span><span aria-hidden="true">/</span><span aria-current="page" className="text-slate-700">{activeCategory}</span></nav>
          <label className="flex items-center gap-2 rounded-[var(--portfolio-radius)] border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-slate-400"><Search size={16} aria-hidden="true" /><input type="search" aria-label="Search certificates" placeholder="Search certificates…" value={query} onChange={event => setQuery(event.target.value)} className="w-36 bg-transparent text-xs text-slate-700 outline-none" /></label>
        </div>
        <div className="mx-auto max-w-5xl px-5 py-7 sm:px-7">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--portfolio-radius)] bg-emerald-100 text-emerald-600"><Award size={26} /></div><div><p className="text-[10px] uppercase tracking-widest text-emerald-600">Learning & development</p><h1 className="text-2xl font-bold tracking-tight">{activeCategory} Certificates</h1></div></div>
          </header>
          {notice && <p role="status" className="mb-5 rounded-[var(--portfolio-radius)] border border-emerald-100 bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800">{notice}</p>}
          {loading ? <p role="status" className="text-sm text-slate-500">Loading certificates…</p> : <div className="grid gap-5 xl:grid-cols-2">{results.map((certificate, index) => <CertificateCard key={certificate.id} certificate={certificate} index={index} />)}</div>}
          {!loading && results.length === 0 && <p className="rounded-[var(--portfolio-radius)] border border-emerald-100 bg-white p-8 text-center text-sm text-slate-500">{query ? `No certificates match “${query}” in ${activeCategory}.` : `No ${activeCategory.toLowerCase()} certificates to display yet.`}</p>}
        </div>
      </div>
    </div>
  );
}
