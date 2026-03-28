"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Sparkle, 
  Target, 
  ArrowRight 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ProjectsListingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/10 overflow-x-hidden pt-48 pb-0">
      <Navbar />
      
      {/* 1. Hero Section (Matched to Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-40">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-zinc-900/50 text-[11px] font-bold text-zinc-400 uppercase tracking-[0.4em] mb-12 shadow-2xl backdrop-blur-3xl"
        >
           <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_10px_white]" />
           Recent Projects
        </motion.div>

        <motion.h1 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="text-6xl md:text-[50px]  tracking-tighter leading-[0.9] text-white max-w-[1200px] mx-auto mb-16"
        >
           Building Scalable Solutions to Drive  <br />
           <span className="text-zinc-600 block sm:inline">Innovation and Impact</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <button className="px-14 py-6 rounded-[20px] cursor-pointer bg-white text-black font-black text-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_60px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 mx-auto">
            Contact Now
          </button>
        </motion.div>
      </section>

      {/* 2. Grid Section (Matched to Screenshot 2) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-64">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
           {projects.map((project, index) => (
             <motion.div
               key={project.slug}
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: index * 0.1 }}
               className="group"
             >
               <Link href={`/projects/${project.slug}`}>
                 <div className="relative aspect-[16/10] bg-zinc-900/40 rounded-[20px] overflow-hidden p-6 border border-white/5 shadow-3xl backdrop-blur-2xl group transition-all duration-[2s]">
                   <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                     <Image
                       src={project.image}
                       alt={project.title}
                       fill
                       className="object-cover transition-transform duration-[2.5s] group-hover:scale-110 grayscale group-hover:grayscale-0"
                     />
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all duration-[1.5s]" />
                   </div>
                   
                   <div className="absolute bottom-10 left-10 w-12 h-12 rounded-full bg-zinc-950/90 border border-white/10 flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-3xl backdrop-blur-xl">
                     <ArrowUpRight size={18} className="text-white" />
                   </div>
                 </div>
               </Link>
             </motion.div>
           ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
