"use client";

import React from "react";
import { Sparkle } from "lucide-react";

export function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
      {/* Left side: Name Logo */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 group cursor-pointer transition-colors duration-300">
          <div className="p-1 px-1.5 rounded-full border border-white/20 flex items-center justify-center bg-white group-hover:border-blue-500/50 transition-all">
            <Sparkle className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-white font-bold tracking-tight text-xl md:text-3xl leading-none">
            BHARAT.
          </span>
        </div>
        <span className="text-white/60 text-sm font-light ml-9">
          Computer Science Engineer
        </span>
      </div>



      {/* Right side: Contact Button */}
      <div>
        <a 
          href="/#contact" 
          className="inline-flex items-center justify-center bg-white text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium text-xs md:text-sm hover:bg-white/90 transition-colors shadow-sm"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
