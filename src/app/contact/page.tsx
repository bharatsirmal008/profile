"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowUpRight, Sparkle, ChevronDown, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
   const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
   const [errorMessage, setErrorMessage] = useState("");

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("loading");

      const formData = new FormData(e.currentTarget);

      try {
         const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
         });

         const data = await response.json();

         if (data.success) {
            setStatus("success");
            (e.target as HTMLFormElement).reset();
         } else {
            setStatus("error");
            setErrorMessage(data.message || "Something went wrong. Please try again.");
         }
      } catch (error) {
         setStatus("error");
         setErrorMessage("Network error. Please check your connection.");
      }
   };

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
                  <form onSubmit={handleSubmit} className="space-y-8">
                     <input type="hidden" name="access_key" value="5b5777a6-cb08-4eba-bec2-96f80487542f" /> {/* User should replace this */}
                     <input type="hidden" name="to_email" value="[sirmalbharat99@gmail.com]" />

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Name <span className="text-red-500">*</span></label>
                           <input
                              name="name"
                              type="text"
                              required
                              placeholder="Your Name"
                              className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700 outline-none"
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Email <span className="text-red-500">*</span></label>
                           <input
                              name="email"
                              type="email"
                              required
                              placeholder="Your Email"
                              className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700 outline-none"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Phone <span className="text-red-500">*</span></label>
                           <input
                              name="phone"
                              type="tel"
                              required
                              placeholder="Your Phone Number"
                              className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700 outline-none"
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Subject</label>
                           <input
                              name="subject"
                              type="text"
                              placeholder="Subject"
                              className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700 outline-none"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">MESSAGE</label>
                        <textarea
                           name="message"
                           rows={5}
                           placeholder="Your Message"
                           className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700 resize-none outline-none"
                        />
                     </div>

                     <div className="space-y-6 pt-4 text-center">
                        <button
                           type="submit"
                           disabled={status === "loading"}
                           className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-zinc-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-95 shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                           {status === "loading" ? (
                              <>
                                 <Loader2 className="w-4 h-4 animate-spin" />
                                 Sending...
                              </>
                           ) : (
                              "Send Message"
                           )}
                        </button>

                        <AnimatePresence>
                           {status === "success" && (
                              <motion.div
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -10 }}
                                 className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-400/10 py-3 rounded-xl border border-emerald-400/20"
                              >
                                 <CheckCircle2 className="w-4 h-4" />
                                 Message sent successfully!
                              </motion.div>
                           )}

                           {status === "error" && (
                              <motion.div
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -10 }}
                                 className="flex items-center justify-center gap-2 text-rose-400 font-bold text-xs bg-rose-400/10 py-3 rounded-xl border border-rose-400/20"
                              >
                                 <AlertCircle className="w-4 h-4" />
                                 {errorMessage}
                              </motion.div>
                           )}
                        </AnimatePresence>

                        <p className="text-[11px] font-bold text-zinc-700 font-mono italic">(We will reach out to you within 48hrs)</p>
                     </div>
                  </form>
               </div>
            </div>
         </div>

         <Footer />
      </main>
   );
}
