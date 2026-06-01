"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  return (
    <section id="projects" className="pt-10 pb-20 md:pt-16 md:pb-32 px-6 md:px-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <iframe src="/grid.html" className="w-full h-full border-none pointer-events-none" title="Grid Background" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10 h-full">
        
        {/* Top Left Project Header */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.4 }}
          className="flex flex-col mb-16 md:mb-32"
        >
          <motion.h2 
            initial={{ filter: "blur(10px)", opacity: 0 }}
            whileInView={{ filter: "blur(0px)", opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[36px] md:text-[50px] font-medium tracking-normal leading-none text-foreground drop-shadow-xl will-change-[filter,opacity]"
          >
            Project
          </motion.h2>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {projects.map((project, idx) => (
            <ProjectCard key={project.slug} project={project} index={idx} />
          ))}
        </div>
        
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotate: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        type: "spring", 
        stiffness: 80, 
        damping: 15, 
        delay: index * 0.2,
        mass: 1.2
      }}
      className="group relative flex flex-col h-full"
    >
      <Link 
        href={project.liveLink ? project.liveLink : `/#projects`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col h-full relative w-full rounded-[10px] bg-transparent p-4 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_80px_rgba(59,130,246,0.2)] transition-all duration-500 overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Animated Background Flare */}
        <div className="absolute -inset-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite] transition-opacity duration-300 transform -skew-x-12"></div>

        {/* Project Image Box */}
        <motion.div 
          className="relative w-full aspect-[16/9] rounded-[10px] overflow-hidden mb-5"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
          
          {/* Animated Float Icon */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.2, rotate: 90 }}
            className="absolute top-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
          >
            <ArrowUpRight size={28} strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Project Info with 3D Pop Effect */}
        <motion.div 
          className="px-2 pb-4 flex flex-col flex-grow relative"
          whileHover={{ z: 50, y: -5 }}
          transition={{ type: "spring" }}
        >
          {/* Tags / Tech Stack */}
          <motion.div 
            className="flex flex-col gap-2 mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              {project.category.split('•').map((cat: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest">
                  {cat.trim()}
                </span>
              ))}
            </div>
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech: string, i: number) => (
                <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.h3 
            className="text-2xl md:text-4xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {project.title}
          </motion.h3>

          <motion.p 
            className="text-gray-400 text-base md:text-lg font-medium leading-relaxed line-clamp-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {project.description}
          </motion.p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
