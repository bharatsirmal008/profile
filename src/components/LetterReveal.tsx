"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface LetterRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function LetterReveal({
  text,
  className = "",
  delay = 0,
  duration = 0.5,
  stagger = 0.03,
}: LetterRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // ============================================================
  // REDUCED MOTION
  // ============================================================

  if (shouldReduceMotion) {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{
          once: true,
          margin: "-50px",
        }}
        transition={{
          duration,
          delay,
        }}
      >
        {text}
      </motion.span>
    );
  }

  // Split text into words so spaces remain correctly formatted.
  const words = text.split(" ");

  // ============================================================
  // CONTAINER VARIANTS
  // ============================================================

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,

      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
      },
    },
  };

  // ============================================================
  // LETTER VARIANTS
  // ============================================================

  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.96,
      filter: "blur(4px)",
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",

      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 100,
      },
    },
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-50px",
      }}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`word-${wordIndex}`}
          className="inline-block whitespace-nowrap"
        >
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={`letter-${wordIndex}-${charIndex}`}
              className="inline-block"
              variants={letterVariants}
            >
              {char}
            </motion.span>
          ))}

          {/* Preserve spaces */}
          {wordIndex < words.length - 1 && (
            <span aria-hidden="true">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.span>
  );
}
