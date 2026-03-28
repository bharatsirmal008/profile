"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Pointer, 
  ListTodo, 
  Sparkle, 
  Rocket,
  Wand
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: <Pointer size={18} strokeWidth={2} />,
    title: "💻 Programming Languages",
    desc: "Proficient in Python, Java, C++, and JavaScript, with strong foundations in HTML and CSS for building modern web applications.",
    step: "Skill",
    num: "1"
  },
  {
    icon: <ListTodo size={18} strokeWidth={2} />,
    title: "⚙️ Frameworks & Libraries",
    desc: "Experienced with React, Next.js, and Express.js, using Tailwind CSS and Bootstrap to design responsive and user-friendly interfaces.",
    step: "Skill",
    num: "2"
  },
  {
    icon: <Wand size={18} strokeWidth={2} />,
    title: "🛠️ Tools & Technologies",
    desc: "Skilled in Firebase, Git/GitHub, Postman, and Canva, with hands-on experience in modern development workflows and deployment.",
    step: "Skill",
    num: "3"
  },
  {
    icon: <Rocket size={18} strokeWidth={2} />,
    title: "Database Systems",
    desc: "Managing structured and unstructured data efficiently with MySQL, PostgreSQL, and MongoDB.",
    step: "Skill",
    num: "4"
  }
];

export function Process() {
  return (
    <section className="py-20 md:py-40 bg-black overflow-hidden px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-zinc-900/40 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-8">
             <div className="w-1.5 h-1.5 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-white/40" />
             </div>
             What do I have?
          </div>
          <h2 className="text-5xl md:text-[64px] font-bold tracking-tighter mb-4 text-white">
            Process <span className="text-zinc-500">Is Everything</span>
          </h2>
          <p className="text-zinc-600 text-[13px] font-medium tracking-wide">
            Simple, streamlined process is what gets you results.
          </p>
        </motion.div>

        {/* Floating Right-to-Left Slide Cards (Refined to Pixel Perfect) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6 mb-24 items-stretch">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 1, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-[#0b0b0d] border border-white/[0.02] rounded-[20px] p-10 pt-16 flex flex-col justify-between hover:bg-[#0f0f12] transition-colors shadow-3xl"
            >
               {/* Tiny White Number Circle in Top Right */}
               <div className="absolute top-8 right-8 w-6 h-6 rounded-full bg-black border border-white/5 flex items-center justify-center text-[9px] font-bold text-white shadow-xl">
                  {item.num}
               </div>

               <div className="space-y-10">
                  {/* Clean Icon (No Frame as per screenshot) */}
                  <div className="text-zinc-600 group-hover:text-white transition-colors duration-500">
                    {item.icon}
                  </div>
                  
                  <div className="space-y-4">
                     <h3 className="text-[20px] font-bold text-white tracking-tight leading-tight">{item.title}</h3>
                     <p className="text-zinc-500 text-[13px] leading-[1.7] font-medium">
                        {item.desc}
                     </p>
                  </div>
               </div>

               <div className="pt-10 space-y-8">
                  <div className="w-full h-[1px] bg-white/[0.04]" />
                  <div className="px-5 py-2.5 w-fit rounded-full bg-black border border-white/[0.05] text-[9px] font-black text-zinc-600 uppercase tracking-widest cursor-default">
                     {item.step}
                  </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Status Capsule */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[20px] p-3 pl-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-3xl"
        >
           <div className="flex flex-col">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/90 uppercase tracking-widest">
                 <div className="w-2.5 h-2.5 rounded-full border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                 </div>
                 I CREATE WITH CODE AND PURPOSE
              </div>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wide ml-5 mt-1">
                 Developing modern applications and systems that solve real-world problems.
              </span>
           </div>

           <div className="flex items-center gap-3">
              <Link href="/projects" className="px-6 py-4 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-all">
                 See All Projects
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-[20px] bg-white text-black font-black uppercase tracking-widest text-[10px] shadow-3xl hover:bg-zinc-200 transition-all active:scale-95">
                 Contact Now
              </Link>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
