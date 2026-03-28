"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Target, 
  Puzzle, 
  Trophy, 
  Sparkle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projects, Project } from "@/lib/projects";
import { Navbar } from "@/components/Navbar";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function ProjectDetail() {
  const { slug } = useParams();
  
  const project = projects.find((p) => p.slug === slug);
  const otherProjects = projects.filter((p) => p.slug !== slug).slice(0, 4);

  if (!project) return null;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/10 overflow-x-hidden pt-32">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-lg">
                {project.description}
              </p>
            </div>

            {project.liveLink && (
              <a 
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-5 rounded-full bg-zinc-900/80 border border-white/10 hover:bg-white hover:text-black transition-all duration-500 font-bold uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(0,0,0,0.3)]"
              >
                Live Site Preview
              </a>
            )}

            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/5">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Client</span>
                <p className="text-lg font-bold text-zinc-300">{project.client}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Service Provided</span>
                <p className="text-lg font-bold text-zinc-300">{project.serviceProvided}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Glass Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-[4/3] rounded-[64px] overflow-hidden p-8 bg-zinc-900/60 backdrop-blur-3xl border border-white/10 shadow-3xl group"
          >
             {/* Subtle smoke texture/mist effect for the 'glass' container */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_70%)] opacity-50 pointer-events-none group-hover:scale-110 group-hover:opacity-75 transition-all duration-1000" />
             <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-white/[0.03] blur-[100px] rounded-full group-hover:bg-white/[0.05] transition-all duration-1000" />
             <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-white/[0.03] blur-[100px] rounded-full group-hover:bg-white/[0.05] transition-all duration-1000" />
             
             <div className="relative w-full h-full rounded-[48px] overflow-hidden shadow-2xl">
               <Image
                 src={project.image}
                 alt={project.title}
                 fill
                 className="object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                 priority
               />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Case Study Sections (The Goal, The Challenge, The Result) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-32 space-y-32">
        <CaseStudySection 
          index="1" 
          title="The Goal:" 
          icon={<Target className="w-6 h-6" />} 
          content={project.goal.text}
          image={project.goal.image}
        />
        <CaseStudySection 
          index="2" 
          title="The Challenge:" 
          icon={<Puzzle className="w-6 h-6" />} 
          content={project.challenge.text}
          image={project.challenge.image}
        />
        <CaseStudySection 
          index="3" 
          title="The Result:" 
          icon={<Trophy className="w-6 h-6" />} 
          content={project.result.text}
          image={project.result.image}
        />
      </section>

      {/* Recent Designs Footer */}
      <section className="bg-zinc-950/20 py-40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-20">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              Recent <span className="text-zinc-600">Designs</span>
            </h2>
            <Link href="/projects" className="px-10 py-5 rounded-full bg-zinc-900/80 border border-white/10 hover:bg-white hover:text-black transition-all duration-500 font-bold uppercase tracking-widest text-[11px] shadow-2xl">
              See All Projects
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherProjects.map((p, i) => (
              <ProjectGridCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}

function CaseStudySection({ index, title, icon, content, image }: { index: string, title: string, icon: React.ReactNode, content: string, image: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] md:rounded-[64px] p-8 md:p-20 relative overflow-hidden group shadow-2xl"
    >
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors duration-500 shadow-xl">
              {icon}
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter">{title}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-950 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-500">
            {index}
          </div>
        </div>

        <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-4xl mb-16 px-1 lg:px-2">
          {content}
        </p>

        <div className="relative w-full aspect-video rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/5 shadow-inner">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-[2.5s]"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}

function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="relative aspect-[16/10] bg-zinc-900 rounded-[40px] overflow-hidden p-6 border border-white/5 shadow-2xl">
          <div className="relative w-full h-full rounded-[24px] overflow-hidden">
             <Image
               src={project.image}
               alt={project.title}
               fill
               className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
             />
             <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-700" />
          </div>
          
          {/* Subtle Arrow */}
          <div className="absolute bottom-10 left-10 w-10 h-10 rounded-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl">
            <ArrowUpRight size={16} className="text-white" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
