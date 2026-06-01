"use client";

import React from "react";
import { motion } from "framer-motion";

const skills = [
  { name: "NEXT.JS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
  { name: "REACT", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "PYTHON", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "JAVA", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
  { name: "JAVASCRIPT", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "TAILWIND", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "EXPRESS.JS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" },
  { name: "MONGODB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "POSTGRESQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "FIREBASE", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" },
  { name: "GIT", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" }
];

// We double the array so the marquee seamlessly loops when it translates -50%
const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

export function SkillsMarquee() {
  return (
    <section className="pt-10 pb-10 md:pt-16 md:pb-16 bg-background overflow-hidden flex flex-col items-center px-[50px]">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full relative flex overflow-hidden group border-y border-border/30 py-8"
      >
        
        {/* Animated Marquee Container using Framer Motion */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 200, repeat: Infinity }}
          className="flex whitespace-nowrap items-center w-max"
        >
          {duplicatedSkills.map((skill, idx) => (
              <div key={idx} className="flex items-center px-6 md:px-12 group/skill">
                {/* Skill Icon */}
                <motion.div 
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className="w-20 h-20 md:w-32 md:h-32 relative bg-white/10 rounded-3xl p-4 md:p-6 backdrop-blur-md border border-white/20 shadow-xl"
                >
                  <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" title={skill.name} />
                </motion.div>
              </div>
          ))}
        </motion.div>
        
      </motion.div>
    </section>
  );
}
