"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, Sparkle, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/10 overflow-x-hidden pt-40 pb-0">
       <Navbar />
       
       {/* Background radial glows */}
       <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.03),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.03),transparent_40%)] pointer-events-none -z-10" />

       <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
             
             {/* Left Column: Info & Stats */}
             <div className="space-y-12">
                <div className="space-y-8">
                   <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[20px] border border-white/5 bg-zinc-900/50 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] shadow-sm"
                   >
                      <div className="w-1.5 h-1.5 rounded-[20px] bg-white/40 shadow-[0_0_10px_white]" />
                      Let's Connect
                   </motion.div>
                   
                   <h1 className="text-3xl md:text-5xl tracking-tighter leading-[1.1] text-white">
                      Let's <span className="text-zinc-600 block sm:inline">Collaborate and</span> <br /> 
                       Begin the work
                   </h1>
                </div>
             </div>

             {/* Right Column: Contact Form */}
             <div className="bg-zinc-900/20 backdrop-blur-2xl border border-white/5 rounded-[20px] p-10 md:p-14 space-y-10 shadow-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Name</label>
                      <input type="text" placeholder="Your Name" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Email</label>
                      <input type="email" placeholder="Your Email" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700" />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Phone</label>
                      <input type="tel" placeholder="Your Phone Number" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Subject</label>
                      <input type="text" placeholder="Subject" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700" />
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">MESSAGE</label>
                   <textarea rows={5} placeholder="Your Message" className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700 resize-none" />
                </div>

                <div className="space-y-6 pt-4 text-center">
                   <button className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-95 shadow-white/5">
                      Send Message
                   </button>
                   <p className="text-[11px] font-bold text-zinc-700">(We will reach out to you within 48hrs)</p>
                </div>
             </div>
          </div>
       </div>

       <Footer />
    </main>
  );
}
