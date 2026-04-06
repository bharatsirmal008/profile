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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-[9px] font-bold text-muted uppercase tracking-[0.2em] mb-8">
           <div className="w-1.5 h-1.5 rounded-full border border-border flex items-center justify-center">
             <div className="w-0.5 h-0.5 rounded-full bg-muted" />
           </div>
           About Me
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4 leading-none text-foreground">
          Bharat Sirmal, <span className="text-primary font-bold">Engineer</span>
        </h2>
        <p className="text-muted text-[13px] font-medium max-w-2xl mx-auto tracking-wide">
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
          className="bg-card border border-border/50 rounded-[20px] p-10 md:p-14 shadow-[0_30px_70px_rgba(37,99,235,0.08)] relative overflow-hidden"
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
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-border backdrop-blur-md">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
                   <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Available for work</span>
                </div>
             </div>
          </div>

          {/* Identity Section (Compact) */}
          <div className="space-y-1 px-1 mt-6">
             <h3 className="text-[24px] font-bold text-foreground tracking-tight leading-none">
                Hello I am <span className="text-primary">Bharat Sirmal</span>
             </h3>
             <p className="text-[13px] text-muted font-medium tracking-wide">
                Computer Science Engineer.
             </p>
          </div>

          {/* Mini Circular Social Icons with thin separators */}
          <div className="flex items-center gap-4 pt-4 px-1">
             <SocialIcon href="https://www.facebook.com/er.bharat.sirmal" icon={<Facebook size={16} />} />
             <div className="w-[1px] h-4 bg-border" />
             <SocialIcon href="https://www.instagram.com/imbharatsirmal" icon={<Instagram size={16} />} />
             <div className="w-[1px] h-4 bg-border" />
             <SocialIcon href="https://www.linkedin.com/in/bharat-sirmal?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" icon={<Linkedin size={16} />} />
             <div className="w-[1px] h-4 bg-border" />
             <SocialIcon href="https://github.com/bharatsirmal008" icon={<Github size={16} />} />
          </div>

          <div className="w-full h-[1px] bg-white/5 my-6" />

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
          className="bg-card border border-border/50 rounded-[20px] p-8 md:p-14 mb-16 shadow-[0_20px_50px_rgba(37,99,235,0.06)] backdrop-blur-3xl relative overflow-hidden group"
        >
          {/* Bio Section */}
          <div className="space-y-6">
             <p className="text-[17px] font-medium leading-[1.8] text-muted">
                I’m Bharat Sirmal, a dedicated Software Engineering student specializing in building scalable applications and efficient systems. I combine strong technical expertise with creative problem-solving to deliver impactful digital solutions 🔥!
             </p>
          </div>

          <div className="w-full h-[1px] bg-white/[0.05]" />

          {/* Skills Section */}
          <div className="flex flex-wrap gap-3">
             {skills.map((skill) => (
                <span key={skill} className="px-5 py-3 rounded-[20px] bg-card border border-border text-[15px] font-medium text-muted hover:text-foreground hover:bg-card/80 transition-all cursor-default">
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
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-6 sm:py-4 group hover:bg-card px-4 -mx-4 rounded-2xl transition-all gap-2 sm:gap-4">
                   <div className="flex-1">
                      <span className="text-[17px] font-bold text-foreground group-hover:text-primary transition-colors">
                         {item.role}
                      </span>
                   </div>
                   <div className="flex-1 text-left sm:text-center">
                      <span className="text-[14px] sm:text-[16px] text-muted font-medium">
                         {item.company}
                      </span>
                   </div>
                   <div className="flex-1 text-left sm:text-right">
                      <span className="text-[14px] sm:text-[16px] font-bold text-muted tabular-nums">
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
        className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
      >
         {icon}
      </a>
   );
}
