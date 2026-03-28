"use client";

import React from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Github } from "lucide-react";
import Image from "next/image";
import { PremiumButton } from "./PremiumButton";

const skills = ["Computer Science Engineer", "Volunteer", "Software Developer", "Web Developer"];

export function ProfileAndExperience() {
  return (
    <section id="about" className="py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto">
      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-zinc-900/40 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-8">
           <div className="w-1.5 h-1.5 rounded-full border border-white/10 flex items-center justify-center">
             <div className="w-0.5 h-0.5 rounded-full bg-white/60" />
           </div>
           About Me
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4 leading-none text-white">
          Bharat Sirmal, <span className="text-zinc-500">Engineer</span>
        </h2>
        <p className="text-zinc-600 text-[13px] font-medium max-w-2xl mx-auto tracking-wide">
          Brief initial presentation of myself and my previous experiences.
        </p>
      </motion.div>

      {/* Narrowed Left Card & Slightly Wider Right Card */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        
        {/* Left Card: Profile & Identity (Reduced Height) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#0b0b0d] border border-white/[0.04] rounded-[20px] p-5 md:p-6 space-y-4 shadow-[16px_24px_20px_8px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(184,180,180,0.08)]"
        >
          {/* Shorter Profile Image with centered Badge */}
          <div className="relative aspect-[16/13] rounded-[20px] overflow-hidden group">
             <Image
               src="/profile_image.jpeg"
               alt="Bharat Sirmal"
               fill
               className="object-cover grayscale transition-transform duration-[2s] group-hover:scale-105"
             />
             {/* Centered Badge at Bottom */}
             <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]" />
                   <span className="text-[10px] font-bold text-white uppercase tracking-widest">Available for work</span>
                </div>
             </div>
          </div>

          {/* Identity Section (Compact) */}
          <div className="space-y-1 px-1">
             <h3 className="text-[24px] font-bold text-white tracking-tight leading-none">
                Hello I am <span className="text-zinc-400">Bharat Sirmal</span>
             </h3>
             <p className="text-[13px] text-zinc-500 font-medium tracking-wide">
                Computer Science Engineer.
             </p>
          </div>

          {/* Mini Circular Social Icons with thin separators */}
          <div className="flex items-center gap-4 pt-0 px-1">
             <SocialIcon href="https://www.facebook.com/er.bharat.sirmal" icon={<Facebook size={16} />} />
             <div className="w-[1px] h-4 bg-white/[0.05]" />
             <SocialIcon href="https://www.instagram.com/imbharatsirmal" icon={<Instagram size={16} />} />
             <div className="w-[1px] h-4 bg-white/[0.05]" />
             <SocialIcon href="https://www.linkedin.com/in/bharat-sirmal?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" icon={<Linkedin size={16} />} />
             <div className="w-[1px] h-4 bg-white/[0.05]" />
             <SocialIcon href="https://github.com/bharatsirmal008" icon={<Github size={16} />} />
          </div>

          <div className="w-full h-[1px] bg-white/5" />

          {/* Centered CTA Button (Compact) */}
          <div className="flex justify-center pt-1">
             <PremiumButton href="/contact" variant="secondary" className="px-8 py-3 text-xs font-bold">
                Connect with me
             </PremiumButton>
          </div>
        </motion.div>

        {/* Right Card: Bio, Skills & Experience (With Deep Shadow) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-[#0b0b0d] border border-white/[0.04] rounded-[20px] p-8 md:p-12 space-y-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
        >
          {/* Bio Section */}
          <div className="space-y-6">
             <p className="text-[17px] font-medium leading-[1.8] text-zinc-400">
                I’m Bharat Sirmal, a dedicated Software Engineering student specializing in building scalable applications and efficient systems. I combine strong technical expertise with creative problem-solving to deliver impactful digital solutions 🔥!
             </p>
          </div>

          <div className="w-full h-[1px] bg-white/[0.05]" />

          {/* Skills Section */}
          <div className="flex flex-wrap gap-3">
             {skills.map((skill) => (
                <span key={skill} className="px-5 py-3 rounded-[20px] bg-[#111113] border border-white/[0.04] text-[15px] font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-default">
                   {skill}
                </span>
             ))}
          </div>

          <div className="w-full h-[1px] bg-white/[0.05]" />

          {/* Experience Section */}
          <div className="space-y-3">
             {[
               { role: "SEE", company: "Shajendraswor Phulaut,Doti", year: "2020", },
               { role: "+2 Science", company: "KMC Balkumari Lalitpur, Nepal", year: "2022" },
               { role: "B.Tech CSE", company: "Pillai College of Engineering, India", year: "2027" },

             ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-6 sm:py-4 group hover:bg-white/[0.01] px-4 -mx-4 rounded-2xl transition-all gap-2 sm:gap-4">
                   <div className="flex-1">
                      <span className="text-[17px] font-bold text-zinc-300 group-hover:text-white transition-colors">
                         {item.role}
                      </span>
                   </div>
                   <div className="flex-1 text-left sm:text-center">
                      <span className="text-[14px] sm:text-[16px] text-zinc-500 font-medium">
                         {item.company}
                      </span>
                   </div>
                   <div className="flex-1 text-left sm:text-right">
                      <span className="text-[14px] sm:text-[16px] font-bold text-zinc-600 tabular-nums">
                         {item.year}
                      </span>
                   </div>
                </div>
             ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
   return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-12 h-12 rounded-full border border-white/[0.08] flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300"
      >
         {icon}
      </a>
   );
}
