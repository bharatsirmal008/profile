"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import StudioText from "@/components/StudioText";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/10 overflow-x-hidden">
      {/* Background radial glows for premium feel */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.02),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(30,58,138,0.02),transparent_40%)] pointer-events-none -z-10" />

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
          >
            <StudioText onComplete={() => setShowIntro(false)} />
          </motion.div>
        ) : (
          <motion.div 
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
          >
            <Hero />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
