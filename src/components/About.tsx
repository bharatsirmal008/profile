"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Figma, Framer, Sparkles } from "lucide-react";

export function About() {
  return (
    <div className="w-full h-full bg-white font-sans overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 px-6 sm:px-8 md:px-12 pb-24 flex flex-col min-h-full relative">
      
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 tracking-tight">About Me</h1>
      
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
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight text-gray-900">Bharat Sirmal</h2>
          <p className="text-lg leading-relaxed mb-6 max-w-2xl text-gray-500">
            I'm a multidisciplinary designer turning ideas into bold digital experiences, thoughtful products, and visual systems people remember.
          </p>
          
          {/* Status */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"></div>
            <span className="text-[15px] font-medium text-gray-700">Available for work</span>
          </div>

          <hr className="border-gray-200 mb-6" />

          {/* Contact Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[15px] font-medium text-gray-700">
            <span>bharat@designer.com</span>
            <span>+91(123) 456-7890</span>
          </div>
        </motion.div>
      </div>

      {/* Services Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-12 pt-4"
      >
        <h2 className="text-2xl font-semibold mb-6 tracking-tight text-gray-900">Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service 1 */}
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
              <Figma className="w-6 h-6 text-gray-800" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Web Design</h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">Distinctive websites with clear visuals and thoughtful interactions.</p>
          </div>

          {/* Service 2 */}
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
              <Framer className="w-6 h-6 text-gray-800" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Product Design</h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">Simple, user-focused interfaces with clear flows and intuitive experiences.</p>
          </div>

          {/* Service 3 */}
          <div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
              <Sparkles className="w-6 h-6 text-gray-800" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Creative Direction</h3>
            <p className="text-gray-500 leading-relaxed text-[15px]">Visual concepts and art direction that create clear, memorable digital brands.</p>
          </div>
        </div>
      </motion.div>

      {/* Location Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="pb-4"
      >
        <h2 className="text-2xl font-semibold mb-6 tracking-tight text-gray-900">Location</h2>
        <div className="relative w-full h-[300px] rounded-[24px] overflow-hidden shadow-sm bg-gray-50 border border-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
            alt="Map"
            className="w-full h-full object-cover opacity-90"
          />
          {/* Open in Maps Button */}
          <a 
            href="#" 
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 shadow-sm border border-gray-200/50 flex items-center gap-2 hover:bg-white transition-colors"
          >
            Open in Maps
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
      
      </div>
    </div>
  );
}
