"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Instagram, Github, Phone, Mail, Linkedin } from "lucide-react";

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
    <div className="w-full h-full bg-white font-sans overflow-y-auto">
      <div className="max-w-3xl mx-auto p-8 md:p-12 pb-24 flex flex-col min-h-full relative">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          {/* Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1 tracking-tight">Bharat Sirmal</h1>
            <h2 className="text-lg text-gray-500 font-medium">Computer Science Student <span className="text-gray-300 mx-1">|</span> Let's Connect</h2>
          </div>


        </div>

        {/* Form Section */}
        <div className="flex-1 w-full">
          <h3 className="text-xl font-semibold text-gray-500 mb-8">Get In Touch:</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="access_key" value="5b5777a6-cb08-4eba-bec2-96f80487542f" />
            <input type="hidden" name="to_email" value="sirmalbharat99@gmail.com" />

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Name *</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all text-[15px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Email *</label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all text-[15px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Message</label>
              <textarea
                name="message"
                required
                placeholder="Enter your message"
                className="w-full min-h-[140px] bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all resize-y text-[15px]"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-8 py-3 bg-[#f0f0f0] hover:bg-[#e4e4e4] text-gray-900 font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              >
                {status === "loading" ? (
                   <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Sending
                   </>
                ) : (
                   "Submit"
                )}
              </button>

              <AnimatePresence>
                {status === "success" && (
                   <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 flex items-center gap-2 text-green-600 text-sm font-semibold"
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
                      className="mt-4 flex items-center gap-2 text-red-500 text-sm font-semibold"
                   >
                      <AlertCircle className="w-4 h-4" />
                      {errorMessage}
                   </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 text-sm font-medium text-gray-400">
          Turning ideas into bold digital experiences, products, and visual systems that people remember.
        </div>
      </div>
    </div>
   );
}
