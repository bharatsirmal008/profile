"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MouseTrail() {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Base mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Layered springs for a smooth trail effect
  const spring1 = { damping: 20, stiffness: 250, mass: 0.5 };
  const spring2 = { damping: 25, stiffness: 200, mass: 0.8 };
  const spring3 = { damping: 30, stiffness: 150, mass: 1.0 };
  const spring4 = { damping: 35, stiffness: 100, mass: 1.2 };
  const spring5 = { damping: 40, stiffness: 80,  mass: 1.5 };

  const x1 = useSpring(mouseX, spring1);
  const y1 = useSpring(mouseY, spring1);
  
  const x2 = useSpring(mouseX, spring2);
  const y2 = useSpring(mouseY, spring2);
  
  const x3 = useSpring(mouseX, spring3);
  const y3 = useSpring(mouseY, spring3);

  const x4 = useSpring(mouseX, spring4);
  const y4 = useSpring(mouseY, spring4);

  const x5 = useSpring(mouseX, spring5);
  const y5 = useSpring(mouseY, spring5);

  useEffect(() => {
    setIsMounted(true);
    
    const checkMobile = () => {
      // Hide on touch devices or small screens
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouch || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsHovering(
        !!target.closest('button') || 
        !!target.closest('a') || 
        !!target.closest('[role="button"]') ||
        getComputedStyle(target).cursor === 'pointer'
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!isMounted || isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000]">
      {/* Deepest Glow (Slowest, Most Lag) */}
      <motion.div
        style={{
          x: x5,
          y: y5,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute h-48 w-48 rounded-full bg-white/[0.03] blur-3xl"
      />

      {/* Outer Blur Layer 3 */}
      <motion.div
        style={{
          x: x4,
          y: y4,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute h-24 w-24 rounded-full bg-white/[0.05] blur-2xl"
      />

      {/* Layer 2 Ring */}
      <motion.div
        style={{
          x: x3,
          y: y3,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 1.5 : 1,
        }}
        className="absolute h-12 w-12 rounded-full border border-white/10"
      />

      {/* Layer 1 Soft Glow */}
      <motion.div
        style={{
          x: x2,
          y: y2,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 2 : 1,
        }}
        className="absolute h-8 w-8 rounded-full bg-white/10 blur-[2px]"
      />

      {/* Leading Glow Point (Pure White, Stronger Shadow) */}
      <motion.div
        style={{
          x: x1,
          y: y1,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_20px_4px_rgba(255,255,255,0.7)]"
      />
    </div>
  );
}
