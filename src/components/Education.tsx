"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Syne, Space_Mono, DM_Sans } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["800"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

const educationData = [
  {
    id: 1,
    degree: "SEE (X)",
    institution: "Shajendra Swor Secondary School",
    year: "2020",
    level: "Secondary Education Examination",
    location: "Phulaut, Doti, Nepal",
    description: "GPA: 3.6/4.0",
    skills: ["Science", "Mathematics", "Computer Basics"],
    gradient: "from-rose-500 to-rose-600",
    bgAccent: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    hoverBorder: "group-hover:border-rose-500/80",
    glowColor: "group-hover:shadow-[0_0_40px_-10px_rgba(244,63,94,0.4)]",
    textColor: "text-rose-400",
    emoji: "🏫"
  },
  {
    id: 2,
    degree: "+2 (XII)",
    institution: "Kathmandu Model College, Balkumari, Lalitpur",
    year: "2021 - 2022",
    level: "Higher Secondary Education",
    location: "Lalitpur, Nepal",
    description: "GPA: 3.13/4.0",
    skills: ["Physics", "Computer Science", "Advanced Math"],
    gradient: "from-teal-400 to-teal-500",
    bgAccent: "bg-teal-400/10",
    borderColor: "border-teal-400/30",
    hoverBorder: "group-hover:border-teal-400/80",
    glowColor: "group-hover:shadow-[0_0_40px_-10px_rgba(45,212,191,0.4)]",
    textColor: "text-teal-300",
    emoji: "🔬"
  },
  {
    id: 3,
    degree: "B.Tech in Computer Science Engineering",
    institution: "Pillai College of Engineering, Mumbai, India",
    year: "2023 - 2027",
    level: "Undergraduate Degree (ongoing)",
    location: "Mumbai, India",
    description: "CGPA: 8.78/10",
    skills: ["Next.js", "React", "System Design"],
    gradient: "from-purple-500 to-purple-600",
    bgAccent: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    hoverBorder: "group-hover:border-purple-500/80",
    glowColor: "group-hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)]",
    textColor: "text-purple-400",
    emoji: "💻"
  }
];

export function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section 
      id="education" 
      ref={sectionRef} 
      className="relative w-full min-h-screen bg-white overflow-hidden py-24 md:py-32 px-6 md:px-12"
    >
      {/* Background Ambient Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute top-1/4 -left-32 md:left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/30 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }} 
        transition={{ duration: 10, repeat: Infinity, delay: 1, ease: "easeInOut" }} 
        className="absolute bottom-1/4 -right-32 md:right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-teal-500/20 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" 
      />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#805ad51a_1px,transparent_1px),linear-gradient(to_bottom,#805ad51a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" 
        style={{ maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%)" }} 
      />

      <div className="relative max-w-7xl mx-auto z-10 h-full">
        
        {/* Top Left Header */}
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
            className="text-[36px] md:text-[50px] font-medium tracking-normal leading-none text-black drop-shadow-xl will-change-[filter,opacity]"
          >
            Education
          </motion.h2>
        </motion.div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative w-full max-w-5xl mx-auto">
          
          {/* Center Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-black/5 rounded-full overflow-hidden">
            <motion.div 
              style={{ height: lineHeight }} 
              className="w-full bg-gradient-to-b from-rose-500 via-teal-400 to-purple-500 origin-top" 
            />
          </div>

          {/* Cards */}
          <div className="space-y-16 md:space-y-32">
            {educationData.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={item.id} className={`relative flex w-full md:justify-between items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`} style={{ perspective: "1200px" }}>
                  
                  {/* Card Container */}
                  <div className={`w-full md:w-[45%] flex pl-20 md:pl-0 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`} style={{ perspective: "1000px" }}>
                    <motion.div 
                      initial={{ opacity: 0, x: isLeft ? -80 : 80, y: 50, rotateY: isLeft ? 30 : -30, rotateX: 15, z: -100 }}
                      whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0, rotateX: 0, z: 0 }}
                      whileHover={{ scale: 1.02, rotateY: isLeft ? 5 : -5, rotateX: 2, z: 20 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className={`group relative w-full bg-white backdrop-blur-xl border border-black/10 rounded-3xl p-6 md:p-8 transition-colors duration-500 ${item.hoverBorder} ${item.glowColor} shadow-xl`}
                    >
                      {/* Year Badge */}
                      <div className="mb-6 flex justify-start">
                        <div className={`px-4 py-1.5 rounded-full ${item.bgAccent} border ${item.borderColor} ${spaceMono.className} ${item.textColor} text-xs font-bold tracking-widest`}>
                          {item.year}
                        </div>
                      </div>

                      {/* Main Content Layout */}
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Large Emoji Left */}
                        <div className="text-4xl md:text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                          {item.emoji}
                        </div>
                        
                        {/* Text Right */}
                        <div className="flex flex-col flex-1">
                          <h3 className={`${syne.className} text-xl md:text-2xl font-extrabold text-black leading-tight mb-1`}>
                            {item.degree}
                          </h3>
                          <p className={`${spaceMono.className} ${item.textColor} font-medium text-sm md:text-base mb-4`}>
                            {item.institution}
                          </p>
                          
                          {/* Bottom Row: Location & Score */}
                          <div className={`flex flex-wrap items-center gap-4 text-xs md:text-sm font-semibold ${spaceMono.className}`}>
                            <div className="flex items-center gap-1.5 text-black/50">
                              <span className="opacity-80">📍</span> 
                              <span>{item.location}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${item.textColor}`}>
                              <span>⭐</span>
                              <span>{item.description}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center z-10">
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }} 
                      whileInView={{ scale: 1, opacity: 1 }} 
                      viewport={{ once: true, margin: "-100px" }} 
                      transition={{ type: "spring", delay: 0.2, stiffness: 200, damping: 15 }}
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br ${item.gradient} shadow-[0_0_20px] ${item.textColor.replace('text', 'shadow')}`} 
                    />
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block w-[45%]"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer spinner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-32 flex flex-col items-center justify-center gap-4"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-4xl"
          >
            🎓
          </motion.div>
          <p className={`${spaceMono.className} text-black/50 text-sm tracking-widest uppercase`}>
            Still learning · Always growing
          </p>
        </motion.div>

      </div>
    </section>
  );
}
