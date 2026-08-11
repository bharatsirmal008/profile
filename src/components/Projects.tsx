"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { Globe, Home, ExternalLink, Menu, X, Minus, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function Projects({ onClose, onMinimize, onMaximize }: ProjectsProps = {}) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const activeProject = projects[activeProjectIndex];

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-white font-sans text-gray-900 overflow-hidden relative">
      
      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white z-20">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 -ml-1.5 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            <Home className="w-[18px] h-[18px]" />
          </button>
          <span className="font-semibold text-gray-900">Projects</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        absolute md:relative z-10 w-full md:w-64 h-[calc(100%-60px)] md:h-full bg-white border-r border-gray-100 flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Window Controls */}
        <div className="hidden md:flex h-12 items-center px-4 gap-2 shrink-0 group cursor-grab">
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
            Projects
          </h2>
          <nav className="flex flex-col gap-1">
            {projects.map((project, index) => {
              const isActive = index === activeProjectIndex;
              return (
                <button
                  key={project.slug}
                  onClick={() => {
                    setActiveProjectIndex(index);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-medium transition-all text-left
                    ${isActive 
                      ? 'bg-[#f5f5f5] text-gray-900' 
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
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
        
        {/* Top Breadcrumb Bar */}
        <div className="h-12 shrink-0 border-b border-gray-100 flex items-center justify-between px-8 md:px-12 bg-white cursor-grab">
          <div className="flex items-center gap-2 text-[15px] font-medium text-gray-400">
            <span>User</span>
            <span className="text-gray-300">/</span>
            <span>Projects</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">{activeProject.title}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-900 transition-colors">
            <Home className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Scrollable Project Details */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 md:py-16 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[1400px] mx-auto"
            >
              
              {/* Header: Title & Visit Link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-4xl md:text-[42px] font-semibold text-gray-900 tracking-tight">
                  {activeProject.title}
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

              {/* Description */}
              <p className="text-[17px] md:text-lg text-gray-600 leading-relaxed mb-12 max-w-4xl">
                {activeProject.description}
              </p>

              {/* Metadata Columns */}
              <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 mb-16">
                <div>
                  <h3 className="text-[15px] font-medium text-gray-400 mb-2">Category</h3>
                  <p className="text-[17px] font-medium text-gray-700">{activeProject.category}</p>
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-gray-400 mb-2">Client</h3>
                  <p className="text-[17px] font-medium text-gray-700">{activeProject.client}</p>
                </div>
              </div>

              {/* Featured Image */}
              <div className="w-full rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative aspect-[16/10]">
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 100vw"
                  priority
                />
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
