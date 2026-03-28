"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  href?: string;
  onClick?: () => void;
}

export const PremiumButton = ({ children, variant = "primary", className, href, onClick }: PremiumButtonProps) => {
  const isPrimary = variant === "primary";

  // Base transition timing
  const springConfig = { type: "spring", stiffness: 400, damping: 30 } as const;

  const buttonContent = (
    <>
      {/* Glossy top highlight for primary button */}
      {isPrimary && (
        <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      )}
      
      {/* Subtle border for light variant */}
      {isPrimary && (
        <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
      )}

      {/* Glass shimmer for secondary button */}
      {!isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
      )}

      <span className="relative z-10">{children}</span>
    </>
  );

  const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 rounded-2xl text-[15px] font-bold transition-all duration-300 overflow-hidden active:scale-95";
  
  const styles = isPrimary 
    ? "bg-white text-black shadow-[0_4px_24px_rgba(255,255,255,0.12),inset_0_-2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.18)]"
    : "bg-[#111113] backdrop-blur-md text-white border border-white/[0.04] hover:bg-[#1a1a1c] hover:border-white/[0.08] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.6)]";

  if (href) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={springConfig}
        className={className}
      >
        <Link 
          href={href} 
          className={cn(baseStyles, styles, "w-full")}
        >
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={springConfig}
      className={cn(baseStyles, styles, className)}
    >
      {buttonContent}
    </motion.button>
  );
};

