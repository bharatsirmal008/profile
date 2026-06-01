"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function Contact() {
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
      } catch {
         setStatus("error");
         setErrorMessage("Network error. Please check your connection.");
      }
   };

   return (
    <section id="contact" className="py-24 md:py-40 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            
            {/* Left Column: Info & Stats */}
            <div className="space-y-12">
                  <motion.h2 
                    initial={{ filter: "blur(10px)", opacity: 0 }}
                    whileInView={{ filter: "blur(0px)", opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-[36px] md:text-[50px] font-medium tracking-normal leading-[1.3] text-foreground drop-shadow-xl will-change-[filter,opacity]"
                  >
                     Let&apos;s Collaborate <br />
                     and <br />
                     Begin the work
                  </motion.h2>
            </div>

            {/* Right Column: Contact Form (MacBook VS Code UI) */}
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, type: "spring" }}
               className="bg-[#1e1e1e] border border-white/10 rounded-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.2)] transition-all overflow-hidden flex flex-col font-mono"
            >
               {/* macOS Top Bar */}
               <div className="h-10 bg-[#2d2d2d] border-b border-white/5 flex items-center px-4 relative">
                  <div className="flex gap-2 z-10">
                     <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner"></div>
                     <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                     <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-gray-400 text-xs font-medium">contact.tsx — jojo.code</span>
                  </div>
               </div>

               {/* Editor Content Area */}
               <div className="p-8 md:p-10 space-y-8 relative">
                  {/* Line Numbers Background Hint */}
                  <div className="absolute top-0 bottom-0 left-0 w-12 bg-[#1e1e1e] border-r border-white/5 pointer-events-none hidden md:block"></div>

                  <form onSubmit={handleSubmit} className="space-y-8 md:pl-8">
                     <input type="hidden" name="access_key" value="5b5777a6-cb08-4eba-bec2-96f80487542f" />
                     <input type="hidden" name="to_email" value="sirmalbharat99@gmail.com" />

                     {/* Code comment for context */}
                     <div className="text-[#6A9955] text-xs md:text-sm mb-4">
                        {`// Fill out the payload object to initialize communication`}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-xs text-[#569CD6] font-medium">const <span className="text-[#9CDCFE]">name</span> <span className="text-[#D4D4D4]">=</span></label>
                           <input
                              name="name"
                              type="text"
                              required
                              placeholder="'Your Name'"
                              className="w-full bg-[#252526] border border-white/10 rounded-[10px] p-4 text-sm focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] transition-all text-[#CE9178] placeholder:text-gray-500 outline-none shadow-sm"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-xs text-[#569CD6] font-medium">const <span className="text-[#9CDCFE]">email</span> <span className="text-[#D4D4D4]">=</span></label>
                           <input
                              name="email"
                              type="email"
                              required
                              placeholder="'Your Email'"
                              className="w-full bg-[#252526] border border-white/10 rounded-[10px] p-4 text-sm focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] transition-all text-[#CE9178] placeholder:text-gray-500 outline-none shadow-sm"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-xs text-[#569CD6] font-medium">const <span className="text-[#9CDCFE]">phone</span> <span className="text-[#D4D4D4]">=</span></label>
                           <input
                              name="phone"
                              type="tel"
                              required
                              placeholder="'Your Phone'"
                              className="w-full bg-[#252526] border border-white/10 rounded-[10px] p-4 text-sm focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] transition-all text-[#CE9178] placeholder:text-gray-500 outline-none shadow-sm"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-xs text-[#569CD6] font-medium">const <span className="text-[#9CDCFE]">subject</span> <span className="text-[#D4D4D4]">=</span></label>
                           <input
                              name="subject"
                              type="text"
                              placeholder="'Subject'"
                              className="w-full bg-[#252526] border border-white/10 rounded-[10px] p-4 text-sm focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] transition-all text-[#CE9178] placeholder:text-gray-500 outline-none shadow-sm"
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-xs text-[#569CD6] font-medium">const <span className="text-[#9CDCFE]">message</span> <span className="text-[#D4D4D4]">=</span></label>
                        <textarea
                           name="message"
                           rows={4}
                           placeholder="`Your Message Here`"
                           className="w-full bg-[#252526] border border-white/10 rounded-[10px] p-4 text-sm focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] transition-all text-[#CE9178] placeholder:text-gray-500 resize-none outline-none shadow-sm"
                        />
                     </div>

                     <div className="space-y-6 pt-6">
                        <button
                           type="submit"
                           disabled={status === "loading"}
                           className="w-full py-5 rounded-[10px] bg-[#007acc] text-white font-bold tracking-wide text-sm hover:bg-[#005f9e] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-[#007acc] shadow-md"
                        >
                           {status === "loading" ? (
                              <>
                                 <Loader2 className="w-4 h-4 animate-spin" />
                                 await fetch(&apos;/api/send&apos;)...
                              </>
                           ) : (
                              "execute()"
                           )}
                        </button>

                        <AnimatePresence>
                           {status === "success" && (
                              <motion.div
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -10 }}
                                 className="flex items-center gap-2 text-blue-700 text-xs font-bold bg-blue-50 p-3 rounded-[10px] border border-blue-200"
                              >
                                 <CheckCircle2 className="w-4 h-4" />
                                 {`// Status: 200 OK - Message delivered`}
                              </motion.div>
                           )}

                           {status === "error" && (
                              <motion.div
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, y: -10 }}
                                 className="flex items-center gap-2 text-red-700 text-xs font-bold bg-red-50 p-3 rounded-[10px] border border-red-200"
                              >
                                 <AlertCircle className="w-4 h-4" />
                                 {`// Error: ${errorMessage}`}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  </form>
               </div>
            </motion.div>
         </div>
      </div>
    </section>
   );
}
