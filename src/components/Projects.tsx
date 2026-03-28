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
    <section id="projects" className="py-24 md:py-40 px-6 md:px-12 bg-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 text-center md:text-left items-center md:items-end">
           <div className="space-y-6 flex flex-col items-center md:items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/5 bg-zinc-900/40 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] shadow-sm">
                 <Target size={12} className="text-zinc-500" />
                 Recent Projects
              </div>
              <div className="space-y-4">
                 <h2 className="text-5xl md:text-7xl lg:text-[80px] font-medium tracking-tight leading-[0.9] text-white">
                   Recent <span className="text-zinc-600 font-normal">Projects</span>
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

        {/* 2-Column Bento Grid matching Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
           
           {/* Left Column: [Large, Small] */}
           <div className="space-y-8">
              <BentoCard 
                project={projects[0]} 
                isLarge={true} 
              />
              <PlaceholderCard 
                title="Next Success" 
                category="Branding • Identity" 
                image="https://images.unsplash.com/photo-1541339907198-e08756dedff3"
              />
           </div>

           {/* Right Column: [Small, Large] */}
           <div className="space-y-8 md:mt-24">
              <PlaceholderCard 
                title="Innovation" 
                category="Product • Design" 
                image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"
              />
              <BentoCard 
                project={projects[1]} 
                isLarge={true} 
              />
           </div>

        </div>
      </div>
    </section>
  );
}

function BentoCard({ project, isLarge }: { project: any, isLarge: boolean }) {
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
      className="group relative"
    >
      {/* @ts-ignore */}
      <CardWrapper {...wrapperProps}>
        <div className={`
          relative w-full rounded-[40px] bg-[#0b0b0d] border border-white/[0.04] p-2 overflow-hidden
          transition-all duration-700 hover:border-white/[0.1] shadow-3xl
          ${isLarge ? "aspect-[4/3] md:aspect-[4/5] lg:aspect-[4/3.5]" : "aspect-square"}
        `}>
          <div className="relative w-full h-full rounded-[38px] overflow-hidden">
             <Image
               src={project.image}
               alt={project.title}
               fill
               className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
             
             {/* Bottom Info Overlay */}
             <div className="absolute bottom-10 left-10 right-10 z-20">
                <div className="space-y-1">
                   <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{project.title}</h3>
                   <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{project.category}</p>
                </div>
             </div>

             {/* Arrow Icon in Circle matching Screenshot */}
             <div className="absolute bottom-10 left-10 w-12 h-12 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 flex items-center justify-center -translate-x-[150%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 shadow-2xl">
                <ArrowUpRight size={20} className="text-white" />
             </div>
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
}

function PlaceholderCard({ title, category, image }: { title: string, category: string, image: string }) {
   return (
      <div className="group relative">
         <div className="relative w-full aspect-[16/9] sm:aspect-[4/2] rounded-[40px] bg-[#0b0b0d] border border-white/[0.04] p-2 overflow-hidden transition-all duration-700 hover:border-white/[0.1] shadow-3xl">
            <div className="relative w-full h-full rounded-[38px] overflow-hidden grayscale opacity-40 group-hover:opacity-80 transition-all duration-1000">
               <Image src={image} alt={title} fill className="object-cover scale-110 blur-[2px] group-hover:blur-0 transition-all duration-1000" />
               <div className="absolute inset-0 bg-black/60" />
               <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                  <h3 className="text-xl font-bold text-white/40 group-hover:text-white transition-colors text-center px-4">{title}</h3>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{category}</p>
               </div>
            </div>
         </div>
      </div>
   );
}
