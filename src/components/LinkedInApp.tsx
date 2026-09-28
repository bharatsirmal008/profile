"use client";

import { useState, type ReactNode } from "react";
import { projects } from "@/lib/projects";

const tabs = ["Overview", "About", "Education", "Projects", "Skills", "Certifications"] as const;
const skills = ["Python", "JavaScript", "C++", "SQL", "React", "Next.js", "Node.js", "MongoDB", "MySQL", "Firebase", "Microsoft Excel", "Google Sheets", "Postman", "GitHub", "Google Cloud", "Tailwind CSS"];

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"><h3 className="mb-3 text-lg font-semibold text-slate-900">{title}</h3><div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div></section>;
}

export function LinkedInApp() {
  const [tab, setTab] = useState<typeof tabs[number]>("Overview");
  const show = (name: typeof tabs[number]) => tab === "Overview" || tab === name;
  return (
    <div className="min-h-full bg-[#f3f2ef] pb-8">
      <div className="h-28 bg-gradient-to-r from-[#0a66c2] via-[#164b77] to-[#102c43] px-6 pt-5 text-right text-xs font-medium tracking-[0.2em] text-white/70">BUILD. LEARN. CREATE.</div>
      <div className="relative border-b border-slate-200 bg-white px-5 pb-6 sm:px-8">
        <img src="/profile_image.jpeg" alt="Bharat Sirmal" className="relative -top-12 -mb-9 h-28 w-28 rounded-full border-4 border-white object-cover" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h2 className="text-2xl font-bold">Bharat Sirmal</h2><p className="mt-1 max-w-xl text-sm">Computer Science Student · Web Development · Data & Databases</p><p className="mt-2 text-xs text-slate-500">Mumbai, Maharashtra, India</p></div>
          <a href="https://www.linkedin.com/in/bharat-sirmal/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#004182] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">View Official LinkedIn ↗</a>
        </div>
        <p className="mt-4 text-xs text-slate-500">Portfolio profile · Information from Bharat’s portfolio and résumé</p>
      </div>
      <div role="tablist" aria-label="LinkedIn sections" className="sticky top-0 z-10 flex overflow-x-auto border-b border-slate-200 bg-white px-3">
        {tabs.map((name) => <button key={name} id={`linkedin-tab-${name}`} role="tab" aria-selected={tab === name} aria-controls="linkedin-panel" onClick={() => setTab(name)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-inset ${tab === name ? "border-[#0a66c2] text-[#0a66c2]" : "border-transparent text-slate-500 hover:text-slate-900"}`}>{name}</button>)}
      </div>
      <div role="tabpanel" id="linkedin-panel" aria-labelledby={`linkedin-tab-${tab}`} className="mx-auto grid max-w-4xl gap-4 p-4 sm:p-6">
        {show("About") && <Card title="About"><p>Detail-oriented Computer Science student with an interest in web development, data management, and cloud platforms. Experienced with structured databases, SQL, Excel, and building full-stack applications.</p><p>Web Development Intern at InAmigos Foundation, May–June 2026. Contributed to website functionality, layout, and maintenance using HTML, CSS, JavaScript, React, Node.js, and MongoDB.</p></Card>}
        {show("Education") && <Card title="Education"><div><h4 className="font-semibold text-slate-900">Pillai College of Engineering, Panvel</h4><p>B.Tech in Computer Science · 2023–2027</p></div><div className="border-t border-slate-100 pt-3"><h4 className="font-semibold text-slate-900">Kathmandu Model College, Balkumari</h4><p>Higher Secondary · Lalitpur, Nepal · Completed 2022</p></div><div className="border-t border-slate-100 pt-3"><h4 className="font-semibold text-slate-900">Shajendra Swor Secondary School</h4><p>SEE · Phulaut, Doti, Nepal · 2020</p></div></Card>}
        {show("Projects") && <Card title="Projects">{projects.map((project) => <article key={project.slug} className="flex gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"><img src={project.image} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" /><div><h4 className="font-semibold text-slate-900">{project.title}</h4><p className="mt-1">{project.description}</p><p className="mt-2 text-xs text-[#0a66c2]">{project.techStack.join(" · ")}</p></div></article>)}</Card>}
        {show("Skills") && <Card title="Skills"><div className="flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">{skill}</span>)}</div></Card>}
        {show("Certifications") && <Card title="Certifications"><div><h4 className="font-semibold text-slate-900">Google Cloud Data Analytics Certificate</h4><p>Cloud-based data pipelines, data analysis, and structured reporting.</p></div><div className="border-t border-slate-100 pt-3"><h4 className="font-semibold text-slate-900">Google Cloud Career Launchpad — Foundations Track</h4><p>Cloud computing fundamentals, data management, and analytics.</p></div></Card>}
        {tab === "Overview" && <><Card title="Achievements"><p>Built an admin dashboard for the YAOP Community Platform that reduced manual data-entry effort by approximately 40%, as documented in the portfolio résumé.</p><p>Completed a web development internship with InAmigos Foundation.</p></Card><Card title="Contact"><p className="break-all">sirmalbharat99@gmail.com</p><p>Mumbai, Maharashtra, India</p></Card></>}
      </div>
    </div>
  );
}
