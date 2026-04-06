"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Monitor, PenTool, Layout, Palette, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { PremiumButton } from "./PremiumButton";

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-40 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 text-center md:text-left items-center md:items-end">
           <div className="space-y-6 flex flex-col items-center md:items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card text-[10px] font-bold text-muted uppercase tracking-[0.2em] shadow-sm">
                 <Target size={12} className="text-primary" />
                 Recent Projects
              </div>
              <div className="space-y-4">
                 <h2 className="text-5xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[0.9] text-foreground">
                   Recent <span className="text-primary font-normal">Projects</span>
                 </h2>
                 {/* <p className="text-zinc-500 text-[16px] md:text-[18px] font-medium tracking-wide max-w-lg mx-auto md:mx-0">
                    Discover my latest digital creations, meticulously designed for impact and performance.
                 </p> */}
              </div>
           </div>

           <div className="flex items-center gap-4">
              <PremiumButton href="/contact" variant="primary" className="rounded-full px-10 py-5">
                 Contact Now
              </PremiumButton>
           </div>
        </div>

        {/* 2-Column Grid showing only actual projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
           {projects.map((project, index) => (
             <BentoCard 
               key={project.slug}
               project={project} 
               isLarge={true} 
               className={index % 2 !== 0 ? "md:mt-24" : ""}
             />
           ))}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ project, isLarge, className }: { project: any, isLarge: boolean, className?: string }) {
  if (!project) return null;

  const CardWrapper = project.liveLink ? 'a' : Link;
  const wrapperProps = project.liveLink 
    ? { href: project.liveLink, target: "_blank", rel: "noopener noreferrer" } 
    : { href: `/projects/${project.slug}` };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative ${className}`}
    >
      {/* @ts-ignore */}
      <CardWrapper {...wrapperProps}>
        <div className={`
          relative w-full rounded-[20px] bg-white border border-border/50 p-2 overflow-hidden
          transition-all duration-700 hover:border-primary/20 shadow-[0_30px_70px_rgba(37,99,235,0.15)]
          ${isLarge ? "aspect-[4/3] md:aspect-[4/5] lg:aspect-[4/3.5]" : "aspect-square"}
        `}>
          <div className="relative w-full h-full rounded-[14px] overflow-hidden">
             <Image
               src={project.image}
               alt={project.title}
               fill
               className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
             
             {/* Bottom Info Overlay */}
             <div className="absolute bottom-10 left-10 right-10 z-20">
                <div className="space-y-1">
                   <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{project.title}</h3>
                   <p className="text-white/70 text-sm font-bold uppercase tracking-widest">{project.category}</p>
                </div>
             </div>

             {/* Arrow Icon in Circle matching Screenshot */}
              <div className="absolute bottom-10 left-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-xl border border-border flex items-center justify-center -translate-x-[150%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 shadow-2xl">
                 <ArrowUpRight size={20} className="text-primary" />
              </div>
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
}
