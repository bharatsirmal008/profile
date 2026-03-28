"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PremiumButton } from "./PremiumButton";

export function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
   <section className="
  relative min-h-screen flex flex-col justify-center
  px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20
  py-20
  bg-black overflow-hidden
">
      {/* Background Layer: Deep Glows & Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse transition-all duration-[10s]" />
        
        {/* Abstract Floating Sphere (Glassy) */}
        <motion.div 
          animate={{ 
            y: [0, -40, 0],
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/[0.05] rounded-full bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-[2px] shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]"
        />

        {isMounted && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
          >
            <source src="/bg_video.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full max-w-7xl mx-auto">
        {/* Left Side: Content (Center on Mobile, Left on Desktop) */}
        <div className="flex flex-col lg:items-start items-center lg:text-left text-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/5 bg-zinc-900/40 backdrop-blur-3xl text-[12px] font-bold text-white shadow-xl">
              <span className="w-2 h-2 rounded-full border-2 border-white/20 flex items-center justify-center">
                <span className="w-0.5 h-0.5 rounded-full bg-white" />
              </span>
              Computer Science Engineering
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8 w-full"
          >
            <h1 className="text-4xl md:text-5xl lg:text-[70px] font-bold tracking-tight leading-[1] text-white flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-x-6 gap-y-4 whitespace-nowrap overflow-visible uppercase">
              <span>Bharat</span> <span className="text-zinc-600 font-extralight tracking-widest">Sirmal</span>
              <div className="flex flex-col items-center gap-1.5 translate-y-2">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xl group cursor-pointer hover:bg-white/10 transition-all shadow-2xl">
                  <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-zinc-400 font-medium leading-[1.6] max-w-2xl mb-12"
          >
           I’m a Computer Science Engineer dedicated to creating innovative, efficient, and scalable solutions through code and technology!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-5"
          >
            <PremiumButton href="/projects" variant="secondary">
              See All Projects
            </PremiumButton>
            <PremiumButton href="/contact" variant="primary">
              Contact Now
            </PremiumButton>
          </motion.div>

        </div>

        {/* Right Side: Floating Testimonials & Interaction */}
        <div className="relative h-[600px] w-full lg:flex items-center justify-end hidden">
          <div className="relative w-full h-full">
            
            {/* Background Glow Dot matching screenshot */}
            <div className="absolute top-[5%] left-[10%] w-2 h-2 rounded-full bg-white shadow-[0_0_20px_white] animate-pulse" />

            {/* Top Card (Nepali Quote) */}
            <motion.div
              style={{
                x: mousePosition.x * 0.5,
                y: mousePosition.y * 0.5,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 40, rotate: -6 }}
              whileInView={{ opacity: 1, rotate: -8, y: 0 }}
              animate={{ 
                rotate: [-8, -7, -8]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 1 }
              }}
              className="absolute top-[10%] left-[15%] w-[320px] bg-[#0d0d0f]/80 backdrop-blur-3xl border border-white/5 p-10 rounded-[45px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-10 cursor-default"
            >
              <p className="text-white text-xl font-bold leading-relaxed mb-8">
                " ऐनामा गएर आफनो मुख हेरेर छाति फुलाएर भनछु जिउदै छु म प्रयास जारि छ दुनियाँ को नजर मा हारेहुला तर म भित्रको म कहिले हारेन! "
              </p>
              <div className="flex justify-end pr-2">
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">—psycho</span>
              </div>
            </motion.div>

            {/* Bottom Card (English Quote) */}
            <motion.div
               style={{
                x: mousePosition.x * -0.8,
                y: mousePosition.y * -0.8,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 80, rotate: 4 }}
              whileInView={{ opacity: 1, rotate: 6, y: 0 }}
              animate={{ 
                rotate: [6, 7, 6]
              }}
              transition={{ 
                rotate: { duration: 11, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 1 },
                delay: 0.3
              }}
              className="absolute top-[40%] left-[40%] w-[340px] bg-[#0d0d0f]/80 backdrop-blur-3xl border border-white/5 p-10 rounded-[45px] shadow-[0_60px_120px_rgba(0,0,0,0.9)] z-20 cursor-default"
            >
              <p className="text-white text-lg font-bold leading-relaxed mb-8">
                " I stand before the mirror, hold my head high, and remind myself—I’m still alive, still trying. The world may see me as defeated, but the person within me has never lost. "
              </p>
              <div className="flex justify-end pr-2">
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">—psycho</span>
              </div>
            </motion.div>

            {/* Subtle floating cursor icons for aesthetic 'moving motion' */}
            <motion.div 
               animate={{ x: mousePosition.x * 0.2, y: mousePosition.y * 0.2 }}
               className="absolute top-[40%] left-[32%] text-white/20 -rotate-12"
            >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10.07 2.42L3.29 17.43c-.34.76.43 1.53 1.19 1.19l15.01-6.78c.88-.4.76-1.67-.18-1.9L4.82 8.35c-.83-.16-1-1.3-.23-1.63L18.41 1.07c.88-.4.76-1.67-.18-1.9L4.82 1.35z" className="opacity-0 invisible" /><path d="M3.7 1.8l1.4 17.4c.1 1.2 1.5 1.7 2.4.8l5-5 5.2 9.6c.4.8 1.4 1.1 2.2.7l1.7-.9c.8-.4 1.1-1.4.7-2.2l-5.2-9.6 6.8-.7c1.2-.1 1.7-1.5.8-2.4L5.3.3c-.9-.9-1.7-.1-1.6 1.5z" /></svg>
            </motion.div>
            <motion.div 
               animate={{ x: mousePosition.x * -0.3, y: mousePosition.y * -0.3 }}
               className="absolute top-[28%] left-[48%] text-white/10 rotate-12"
            >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.7 1.8l1.4 17.4c.1 1.2 1.5 1.7 2.4.8l5-5 5.2 9.6c.4.8 1.4 1.1 2.2.7l1.7-.9c.8-.4 1.1-1.4.7-2.2l-5.2-9.6 6.8-.7c1.2-.1 1.7-1.5.8-2.4L5.3.3c-.9-.9-1.7-.1-1.6 1.5z" /></svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Arrow (Premium Line) */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 px-4 py-8"
      >
        <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </section>
  );
}
