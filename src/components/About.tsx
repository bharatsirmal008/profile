"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Figma, Framer, Sparkles } from "lucide-react";
import { LetterReveal } from "./LetterReveal";

export function About() {
  return (
    <div className="w-full h-full bg-white font-sans overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 px-6 sm:px-8 md:px-12 pb-24 flex flex-col min-h-full relative">
      
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 tracking-tight">
        <LetterReveal text="About Me" />
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full md:w-[45%] h-[350px] rounded-[24px] overflow-hidden shadow-sm shrink-0 border border-gray-100"
        >
          <img 
            src="/profile_image.jpeg" 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Bio Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 flex flex-col justify-center"
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight text-gray-900">
            <LetterReveal text="Bharat Sirmal" delay={0.2} />
          </h2>
          <p className="text-lg leading-relaxed mb-6 max-w-2xl text-gray-500 text-justify tracking-tight">
            Detail-oriented Computer Science student seeking a Data Entry internship to leverage strong analytical skills, database knowledge, and meticulous attention to detail. Adept at managing structured data, maintaining accuracy under volume, and working efficiently with data management tools including SQL, Excel, and cloud platforms.
          </p>
          
          {/* Status */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"></div>
            <span className="text-[15px] font-medium text-gray-700">
              Available for work
            </span>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Contact Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[15px] font-medium text-gray-700">
            <span>
              sirmalbharat99@gmail.com
            </span>
          </div>
        </motion.div>
      </div>


      </div>
    </div>
  );
}
