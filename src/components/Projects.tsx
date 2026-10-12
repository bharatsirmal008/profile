"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePortfolioProjectState } from "@/lib/local-projects";
import { Globe, Home, ExternalLink, X, Minus, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LetterReveal } from "./LetterReveal";
import { HeaderSocialLinks } from "./HeaderSocialLinks";
import { MobileAppHeader } from "./MobileAppHeader";
import styles from "./Projects.module.css";

interface ProjectsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function Projects({ onClose, onMinimize, onMaximize }: ProjectsProps = {}) {
  const { projects, loading, error } = usePortfolioProjectState();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const activeProject = projects[activeProjectIndex] || projects[0];

  return (
    <div className={`${styles.shell} w-full h-full flex flex-col md:flex-row font-sans text-gray-900 overflow-hidden relative`}>
      
      <MobileAppHeader title="Projects" onBack={onClose} menuOpen={isMobileMenuOpen} onToggleMenu={() => setIsMobileMenuOpen(open => !open)} />

      {/* Sidebar Navigation */}
      <div className={`
        ${styles.sidebar} absolute top-12 bottom-0 md:top-auto md:bottom-auto md:relative z-10 w-full md:w-64 md:h-full border-r flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Window Controls */}
        <div data-desktop-controls className="hidden md:flex h-12 items-center px-4 gap-2 shrink-0 group cursor-grab">
            <div 
              className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer shadow-sm border border-[#e0443e] flex items-center justify-center transition-colors" 
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
            >
              <X className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div 
              className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer shadow-sm border border-[#dea123] flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
            >
              <Minus className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div 
              className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer shadow-sm border border-[#1aab29] flex items-center justify-center transition-colors"
              onClick={(e) => { e.stopPropagation(); onMaximize?.(); }}
            >
              <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>

        <div className="p-6 md:p-8 md:pt-4">
          <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-6 px-3">
            <LetterReveal text="Projects" />
          </h2>
          <nav className="flex flex-col gap-1">
            {projects.map((project, index) => {
              const isActive = project.slug === activeProject?.slug;
              return (
                <button
                  key={project.slug}
                  onClick={() => {
                    setActiveProjectIndex(index);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-[var(--portfolio-radius)] text-[15px] font-medium transition-all text-left
                    ${isActive 
                      ? styles.activeProject
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Globe className={`w-4 h-4 shrink-0 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
                  <span className="truncate">{project.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`${styles.main} flex-1 flex flex-col h-full overflow-hidden relative`}>
        
        {/* Top Breadcrumb Bar */}
        <div className={`${styles.header} min-h-12 shrink-0 border-b flex flex-wrap items-center justify-between gap-3 px-6 py-3 md:px-8 cursor-grab`}>
          <div className="flex min-w-0 flex-1 items-center gap-2 text-[15px] font-medium text-gray-400">
            <span>User</span>
            <span className="text-gray-300">/</span>
            <span>Projects</span>
            <span className="text-gray-300">/</span>
            <span className="truncate text-gray-900">{activeProject?.title || "Overview"}</span>
          </div>
          <HeaderSocialLinks />
          <button onClick={onClose} aria-label="Return to desktop" className="text-gray-400 hover:text-gray-900 transition-colors">
            <Home className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Scrollable Project Details */}
        <div className={`${styles.details} flex-1 overflow-y-auto px-5 md:px-8 py-8 md:py-10 pb-16`}>
          {(loading || error) && <p role={error ? "alert" : "status"} className="py-6 text-sm text-slate-500">{error || "Loading projects…"}</p>}
          <AnimatePresence mode="wait">
            {activeProject ? <motion.div
              key={activeProject.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[1400px] mx-auto"
            >
              
              {/* Header: Title & Visit Link */}
              <div className={styles.panel}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-4xl md:text-[42px] font-semibold text-gray-900 tracking-tight">
                  <LetterReveal text={activeProject.title} />
                </h1>
                
                {activeProject.liveLink && (
                  <Link
                    href={activeProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-[15px] group"
                  >
                    Visit
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                )}
              </div>

              {activeProject.repositoryLink && <a href={activeProject.repositoryLink} target="_blank" rel="noopener noreferrer" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">View source code <ExternalLink size={14} /></a>}

              {/* Description */}
              <p className="text-[17px] md:text-lg text-gray-600 leading-relaxed mb-12 max-w-4xl">
                {activeProject.description}
              </p>

              {/* Metadata Columns */}
              <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                <div>
                  <h3 className="text-[15px] font-medium text-gray-400 mb-2">
                    <LetterReveal text="Category" />
                  </h3>
                  <p className="text-[17px] font-medium text-gray-700">
                    {activeProject.category}
                  </p>
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-gray-400 mb-2">
                    <LetterReveal text="Client" />
                  </h3>
                  <p className="text-[17px] font-medium text-gray-700">
                    {activeProject.client}
                  </p>
                </div>
              </div>
              {(activeProject.year || activeProject.role || activeProject.serviceProvided || activeProject.techStack.length > 0) && <div className="mt-7 border-t border-[#e5eaf2] pt-5">
                <dl className="flex flex-wrap gap-x-9 gap-y-4 text-sm">{[["Year", activeProject.year], ["Role", activeProject.role], ["Services", activeProject.serviceProvided]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt className="mb-1 text-xs text-slate-400">{label}</dt><dd className="text-slate-700">{value}</dd></div>)}</dl>
                <div className="mt-4 flex flex-wrap gap-2">{activeProject.techStack.map(tech => <span key={tech} className="rounded-full border border-[#e5eaf2] bg-white px-3 py-1 text-xs text-slate-500">{tech}</span>)}</div>
              </div>}
              </div>

              {/* Featured Image */}
              {activeProject.image && <div className={`${styles.preview} mt-7 w-full overflow-hidden border relative ${activeProject.isTall ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 100vw, 65vw"
                  priority
                  unoptimized={Boolean(activeProject.imagePath) || activeProject.image.startsWith("data:")}
                />
              </div>}
              {[{ title: "Goal", text: activeProject.goal?.text }, { title: "Challenge", text: activeProject.challenge?.text }, { title: "Result", text: activeProject.result?.text }].filter(section => section.text).map(section => <section key={section.title} className={`${styles.panel} mt-6`}><h2 className="mb-3 text-lg font-semibold">{section.title}</h2><p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-500">{section.text}</p></section>)}


            </motion.div> : !loading && !error ? <div key="empty" className="py-16 text-center"><h1 className="text-2xl font-semibold">No public projects yet</h1><p className="mt-3 text-sm text-slate-500">Projects will appear here when they are made public.</p></div> : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
