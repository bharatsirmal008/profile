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
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/10 overflow-x-hidden pt-32">
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
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none text-foreground">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted font-medium leading-relaxed max-w-lg">
                {project.description}
              </p>
            </div>

            {project.liveLink && (
              <a 
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-5 rounded-full bg-primary text-white border border-primary/20 hover:bg-primary/90 transition-all duration-500 font-bold uppercase tracking-widest text-sm shadow-[0_20px_40px_-5px_rgba(37,99,235,0.2)]"
              >
                Live Site Preview
              </a>
            )}

            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-border/50">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Client</span>
                <p className="text-lg font-bold text-foreground">{project.client}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Service Provided</span>
                <p className="text-lg font-bold text-foreground">{project.serviceProvided}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Glass Image */}
           <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-[4/3] rounded-[20px] overflow-hidden p-8 bg-white border border-border/50 shadow-[0_30px_70px_rgba(37,99,235,0.08)] group"
          >
             {/* Subtle smoke texture/mist effect for the 'glass' container */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.02),transparent_70%)] opacity-50 pointer-events-none group-hover:scale-110 group-hover:opacity-75 transition-all duration-1000" />
             <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-primary/[0.03] blur-[100px] rounded-full group-hover:bg-primary/[0.05] transition-all duration-1000" />
             <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/[0.03] blur-[100px] rounded-full group-hover:bg-primary/[0.05] transition-all duration-1000" />
             
             <div className="relative w-full h-full rounded-[14px] overflow-hidden shadow-2xl">
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
      <section className="bg-card py-40 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-20">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              Recent <span className="text-primary">Designs</span>
            </h2>
            <Link href="/projects" className="px-10 py-5 rounded-full bg-primary text-white border border-primary/20 hover:bg-primary/90 transition-all duration-500 font-bold uppercase tracking-widest text-[11px] shadow-[0_20px_40px_-5px_rgba(37,99,235,0.2)]">
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
      className="bg-white border border-border/50 rounded-[20px] p-8 md:p-20 relative overflow-hidden group shadow-[0_40px_80px_rgba(37,99,235,0.06)] transition-all hover:shadow-[0_50px_100px_rgba(37,99,235,0.12)]"
    >
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-500 shadow-sm">
              {icon}
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">{title}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-[10px] font-black text-muted">
            {index}
          </div>
        </div>

        <p className="text-xl md:text-2xl text-muted font-medium leading-relaxed max-w-4xl mb-16 px-1 lg:px-2">
          {content}
        </p>

        <div className="relative w-full aspect-video rounded-[14px] overflow-hidden border border-white/5 shadow-inner">
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
        <div className="relative aspect-[16/10] bg-white rounded-[20px] overflow-hidden p-6 border border-border shadow-[0_30px_60px_rgba(37,99,235,0.06)] hover:shadow-[0_45px_90px_rgba(37,99,235,0.14)] transition-all">
          <div className="relative w-full h-full rounded-[14px] overflow-hidden">
             <Image
               src={project.image}
               alt={project.title}
               fill
               className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
             />
             <div className="absolute inset-0 bg-background/10 group-hover:bg-transparent transition-all duration-700" />
          </div>
          
          {/* Subtle Arrow */}
          <div className="absolute bottom-10 left-10 w-10 h-10 rounded-full bg-primary/90 backdrop-blur-xl border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_20px_40px_rgba(37,99,235,0.1)]">
            <ArrowUpRight size={16} className="text-white" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
