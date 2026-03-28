"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkle } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      className="fixed top-8 inset-x-0 z-[100] flex justify-center px-6"
    >
      <nav className={`
        relative w-fit mx-auto
        flex items-center gap-8
        px-6 py-2 rounded-full border transition-all duration-500
        ${scrolled 
          ? "bg-black/60 backdrop-blur-3xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" 
          : "bg-zinc-900/40 backdrop-blur-2xl border-white/5"}
      `}>
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer transition-colors duration-300">
            <div className="p-1 px-1.5 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900 group-hover:bg-white/10 group-hover:border-white/20">
              <Sparkle className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white/90">Bharat</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-full text-[13px] font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-tight"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button 
            className="md:hidden p-2 text-zinc-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full mt-4 left-0 right-0 min-w-[200px] bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 flex flex-col gap-4 md:hidden shadow-3xl"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-zinc-400 hover:text-white px-4 py-2 rounded-xl transition-all uppercase tracking-widest border-l-2 border-transparent hover:border-white hover:bg-white/5"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
