"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PremiumButton } from "./PremiumButton";

export function CTA() {
  return (
    <section className="pt-12 pb-16 px-6 md:px-12 bg-background overflow-hidden relative">
      {/* 1. Subtle Section Arched Border Highlight (Matched to Screenshot) */}
      <div className="absolute top-0 inset-x-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.05),transparent)]" />
      <div className="absolute top-12 left-1/4 right-1/4 h-[500px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1300px] mx-auto py-16">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
           
           {/* Left Column: Content Section */}
           <div className="lg:col-span-6 space-y-16">
             <div className="space-y-10">
               {/* 2. Badge Style (Matched to Screenshot) */}
               <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card text-[10px] font-black text-muted uppercase tracking-widest shadow-2xl">
                    <div className="w-2 h-2 rounded-full border border-border flex items-center justify-center">
                        <div className="w-0.5 h-0.5 rounded-full bg-primary" />
                    </div>
                    Let's Connect
               </div>
               
               {/* 3. Heading & Font weights (Matched to Screenshot) */}
               <h2 className="text-[64px] md:text-[84px] leading-[0.9] tracking-tighter text-foreground">
                  <span className="font-bold">Let's Grow</span> <span className="text-primary font-extralight block">Together</span>
               </h2>
             </div>

             {/* 4. Service Rows with price tags (Matched to Screenshot) */}
             <div className="space-y-12">
                <div className="space-y-6 pb-12 border-b border-border/50">
                   <div className="flex items-center gap-5">
                      <h4 className="text-2xl font-bold text-foreground tracking-tight">Web Design</h4>
                      <div className="px-3 py-1 rounded-full bg-card border border-border text-[9px] font-black text-muted uppercase tracking-widest shadow-sm">
                         Starting from $1,999
                      </div>
                   </div>
                   <p className="text-muted text-[14px] font-medium tracking-wide">
                      Showcasing sleek, high-performance designs tailored for impact
                   </p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-5">
                      <h4 className="text-2xl font-bold text-foreground tracking-tight">Framer Development</h4>
                      <div className="px-3 py-1 rounded-full bg-card border border-border text-[9px] font-black text-muted uppercase tracking-widest shadow-sm">
                         Starting from $4,999
                      </div>
                   </div>
                   <p className="text-muted text-[14px] font-medium tracking-wide">
                      Building visually stunning, user-focused websites that elevate brands.
                   </p>
                </div>
             </div>

             {/* 5. Buttons Row: Dark & Shiny White (Matched to Screenshot) */}
             <div className="flex flex-wrap items-center gap-5 pt-8">
                <PremiumButton href="/projects" variant="secondary">
                  See All Projects
                </PremiumButton>
                <PremiumButton href="/contact" variant="primary">
                  Contact Now
                </PremiumButton>
             </div>

           </div>

           {/* 6. Right Column: Floating Shiny Image Frame (Matched to Screenshot) */}
           <div className="lg:col-span-6 relative">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-[16/10] rounded-[20px] overflow-hidden p-6 bg-[#0a0a0c] border border-white/[0.04] shadow-[0_40px_100px_rgba(37,99,235,0.12)] group"
              >
                 <div className="relative w-full h-full rounded-[14px] overflow-hidden border border-border shadow-inner">
                    <Image
                      src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
                      alt="Project Workspace"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-white/10 to-transparent" />
                    
                    {/* Branding Watermark (Bottom-Right) */}
                    <div className="absolute bottom-8 right-8 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-3xl border border-border flex items-center justify-center shadow-2xl">
                           <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary/20" />
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tighter shadow-sm">Fade</span>
                    </div>
                 </div>

                 {/* Corner Glow Overlay like Screenshot */}
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.02] blur-3xl pointer-events-none" />
              </motion.div>
              
              {/* Reference Light dots from screenshot */}
              <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_white] blur-[1px] opacity-70" />
           </div>
         </div>
      </div>
    </section>
  );
}
