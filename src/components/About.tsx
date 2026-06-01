"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const text = "I, Bharat Sirmal, 23, am a driven Computer Science student with a relentless passion for building technology that creates real impact. I have consistently pushed boundaries — developing and deploying full-stack platforms that serve real communities, turning complex problems into powerful solutions";

const Word = ({ word, i, total, scrollYProgress }: { word: string; i: number; total: number; scrollYProgress: any }) => {
  const start = i / total;
  const end = start + (1 / total);
  
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
  const blurRaw = useTransform(scrollYProgress, [start, end], [5, 0]);
  const filter = useTransform(blurRaw, (v) => `blur(${v}px)`);

  return (
    <React.Fragment>
      <motion.span
        style={{ 
          display: "inline-block", 
          whiteSpace: "pre",
          opacity,
          filter,
        }}
        className="will-change-[filter,opacity]"
      >
        {word}
      </motion.span>
      {i < total - 1 && (
        <span style={{ display: "inline-block", whiteSpace: "pre" }}> </span>
      )}
    </React.Fragment>
  );
};

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.95", "end 0.6"], 
  });

  const words = text.split(" ");

  return (
    <section ref={containerRef} id="about" className="py-20 md:py-32 px-6 md:px-[100px] w-full flex justify-center bg-background items-center overflow-hidden">
      <div className="max-w-6xl flex flex-col items-center justify-center" style={{ perspective: "1000px" }}>
        <p className="font-sans font-medium text-[36px] md:text-[50px] leading-[1.3em] tracking-wide text-center text-foreground">
          {words.map((word, i) => (
            <Word key={i} word={word} i={i} total={words.length} scrollYProgress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}
