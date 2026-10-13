"use client";

import { useEffect, useRef, useState } from "react";
import { JoJoWordmark } from "./JoJoWordmark";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Code2, Copy, Database, Mail, Sparkles, Terminal } from "lucide-react";

const EMAIL = "sirmalbharat99@gmail.com";

export function About() {
  const reducedMotion = useReducedMotion();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 3000);
  };

  return (
    <div className="@container min-h-full w-full bg-[#fafaff] font-sans text-[#111137]">
      <div className="relative mx-auto flex min-h-full max-w-6xl flex-col justify-center overflow-hidden bg-[radial-gradient(ellipse_at_24%_65%,rgba(124,89,255,0.09),transparent_55%)] px-6 py-8 @[700px]:px-10 @[700px]:py-9">
        <header className="relative z-10 mb-8">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7646ff]">About me <span className="h-px w-8 bg-[#7646ff]" /></div>
          <h1 className="text-3xl font-extrabold tracking-tight @[700px]:text-[42px] @[700px]:leading-tight">Hi, I’m <span className="bg-gradient-to-r from-[#4c13db] to-[#6151ff] bg-clip-text text-transparent">Bharat Sirmal</span></h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#757c9f] @[700px]:text-xs">
            <span>Computer Science student</span><span aria-hidden="true" className="text-violet-500">•</span><span>Full Stack Developer</span><span aria-hidden="true" className="text-violet-300">•</span><span>Problem Solver</span>
          </p>
        </header>

        <div className="grid items-center gap-8 @[700px]:grid-cols-[0.92fr_1.15fr] @[700px]:gap-12">
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative mx-auto w-full max-w-[340px] px-9 py-4">
            <div className="relative isolate aspect-square overflow-hidden rounded-[var(--portfolio-radius)] bg-[linear-gradient(135deg,#8470ff_0%,#5963d5_48%,#793bea_100%)] shadow-[0_12px_32px_rgba(102,67,220,0.22)] ring-1 ring-white/70">
              <Image src="/profile_image.png" alt="Bharat Sirmal" fill sizes="(max-width: 700px) 268px, 300px" className="object-cover object-center" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[var(--portfolio-radius)] ring-1 ring-inset ring-white/20" />
            </div>
            <svg aria-hidden="true" viewBox="0 0 340 300" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" fill="none">
              <path d="M 40 221 C -42 274 28 286 176 215 C 331 142 373 83 292 100" stroke="#ad8bff" strokeWidth="0.9" />
              <circle cx="256" cy="171" r="4" fill="#d6bcff" />
            </svg>
            <div className="absolute left-0 top-9 flex items-center gap-2 rounded-full border border-violet-100 bg-[#f1ebff]/95 px-3 py-2 text-xs text-[#6526eb] shadow-[0_6px_18px_#6f4ccb18]"><Code2 size={16} />Full Stack</div>
            <div className="absolute -left-3 top-[48%] flex items-center gap-2 rounded-full border border-white bg-white/95 px-3 py-2 text-xs text-[#343967] shadow-[0_6px_18px_#6f4ccb18]"><Terminal size={15} className="text-blue-500" />Python</div>
            <div className="absolute -right-2 top-[45%] flex items-center gap-2 rounded-full border border-white bg-white/95 px-3 py-2 text-xs text-[#343967] shadow-[0_6px_18px_#6f4ccb18]"><Database size={16} className="text-[#784bff]" />SQL</div>
            <Sparkles aria-hidden="true" size={12} className="absolute right-2 top-8 text-violet-400" />
            <span aria-hidden="true" className="absolute bottom-12 left-1 text-sm text-violet-400">✦</span>
            <span aria-hidden="true" className="absolute right-1 bottom-16 text-sm text-violet-400">✦</span>
          </motion.div>

          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="relative min-w-0 pb-3">
            <h2 className="mb-3 text-[28px] font-bold tracking-tight">Bharat Sirmal</h2>
            <div className="space-y-4 text-sm leading-[1.95] text-[#777fa1]">
              <p>Hi, I’m Bharat Sirmal, a Computer Science student at Pillai College of Engineering, Panvel, graduating in 2027 with a CGPA of 8.74.</p>
              <p>I enjoy turning ideas into practical, user-friendly software. My main focus is <strong className="font-semibold text-[#8655ff]">Full-Stack Development</strong>, using Python, SQL, React, Next.js, Node.js, and MongoDB to build web applications, APIs, and reliable backend systems.</p>
              <p>I’ve built <strong className="font-semibold text-[#8655ff]">YAOP</strong>, a community platform whose admin dashboard improved data-entry efficiency by about 40%, and <strong className="font-semibold text-[#8655ff]"><JoJoWordmark size={18} /> Store</strong>, a full-stack e-commerce app with authentication, cart, checkout, and Stripe payments. I also built <strong className="font-semibold text-[#8655ff]">Bharat AI</strong>, a personal assistant that answers from my own knowledge base and supports voice interaction.</p>
              <p>My <strong className="font-semibold text-[#8655ff]">Brain Tumor XAI</strong> project classifies four tumor types from multi-view MRI scans using PyTorch, with Grad-CAM heatmaps to explain each prediction.</p>
              <p>I interned at InAmigos Foundation, adding features to a live website, and I hold Google Cloud and Power BI certifications. I’m always eager to learn new technologies, collaborate, and build reliable products that solve real problems.</p>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Open to opportunities</div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">
              <Mail aria-hidden="true" size={17} className="shrink-0 text-[#804bff]" />
              <a href={`mailto:${EMAIL}`} className="break-all font-medium hover:text-violet-600 focus-visible:outline-2 focus-visible:outline-violet-500">{EMAIL}</a>
              <button type="button" onClick={copyEmail} aria-label="Copy email address" className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-violet-100/70 px-3 text-[10px] text-violet-600 transition-colors hover:bg-violet-200 focus-visible:outline-2 focus-visible:outline-violet-500">{copyState === "copied" ? <Check size={12} /> : <Copy size={12} />}{copyState === "copied" ? "Copied" : "Copy"}</button>
            </div>
            <p role="status" className="mt-2 text-xs text-violet-600">{copyState === "error" ? "Could not copy. Select the email address to copy it manually." : copyState === "copied" ? "Email address copied." : ""}</p>
            <div aria-hidden="true" className="pointer-events-none ml-auto mt-5 w-24 rotate-[-7deg] rounded-[var(--portfolio-radius)] border border-indigo-400/50 bg-gradient-to-br from-[#233b70] to-[#261346] px-3 py-2 shadow-[0_7px_20px_#5744b82a]">
              <div className="mb-3 flex gap-1"><span className="h-1 w-1 rounded-full bg-rose-400" /><span className="h-1 w-1 rounded-full bg-amber-300" /><span className="h-1 w-1 rounded-full bg-emerald-400" /></div>
              <span className="font-mono text-xs text-violet-300">&lt;build /&gt;</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
