"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export function Hero() {
  // Parallax scroll effects
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ["0%", "20%"]);
  const textY = useTransform(scrollY, [0, 1000], ["0%", "50%"]);
  const cutoutY = useTransform(scrollY, [0, 1000], ["0%", "-10%"]);

  return (
    <section className="relative h-[100dvh] w-full flex flex-col justify-end overflow-hidden bg-black text-white">
      
      {/* 1. Background Mountain Layer */}
      <motion.div 
        className="absolute inset-0 z-0 origin-bottom"
        style={{ y: backgroundY }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Image
          src="/hero-mountains.jpg"
          alt="Mountains Background"
          fill
          priority
          className="object-cover object-bottom"
        />
        {/* Gradient overlay to blend the mountains smoothly into the background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        <div className="absolute inset-0 bg-black/10"></div>
      </motion.div>

      {/* 2. Typography Layer (Behind the cutout) */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center pt-[5vh] md:pt-[2vh]"
        style={{ y: textY }}
      >
        <motion.div 
          className="relative flex flex-col items-center justify-center leading-[0.8] tracking-tighter w-full max-w-[90vw] mx-auto py-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          {/* Corner Brackets framing the text */}
          <div className="absolute top-0 left-0 w-6 h-6 md:w-10 md:h-10 border-t-[3px] border-l-[3px] border-white/50" />
          <div className="absolute top-0 right-0 w-6 h-6 md:w-10 md:h-10 border-t-[3px] border-r-[3px] border-white/50" />
          <div className="absolute bottom-0 left-0 w-6 h-6 md:w-10 md:h-10 border-b-[3px] border-l-[3px] border-white/50" />
          <div className="absolute bottom-0 right-0 w-6 h-6 md:w-10 md:h-10 border-b-[3px] border-r-[3px] border-white/50" />

          <h1 className="text-[18vw] md:text-[16vw] xl:text-[200px] font-black font-sans text-white uppercase text-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            BHARAT
          </h1>
          <h1 className="text-[18vw] md:text-[16vw] xl:text-[200px] font-black font-sans text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase text-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            SIRMAL
          </h1>
        </motion.div>
      </motion.div>

      {/* 3. Cutout Image Layer (In front of Typography) */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] h-[80vh] md:h-[80vh] pointer-events-none"
        style={{ y: cutoutY }}
        initial={{ y: 200, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        <Image
          src="/image.PNG"
          alt="Bharat Sirmal"
          fill
          priority
          className="object-contain object-bottom drop-shadow-[0_-20px_50px_rgba(0,0,0,0.4)]"
        />
      </motion.div>

      {/* 4. Bottom Gradient Fade to blend into next section */}
      <div className="absolute bottom-0 left-0 w-full h-16 md:h-24 bg-gradient-to-t from-background via-background/80 to-transparent z-30 pointer-events-none" />
    </section>
  );
}
