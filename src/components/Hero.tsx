"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MousePointer2,
  PenTool,
  Box,
  ArrowRight,
  Phone,
  MessageCircle,
  Compass,
  Mail,
  X,
  Minus,
  Maximize2,
  UserPlus,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";
import { About } from "@/components/About";
import { ChromePicker } from 'react-color';
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { Contact } from "@/components/Contact";
import { Resume } from "@/components/Resume";
import { Assistant } from "@/components/Assistant";

const FOLDERS = [
  { id: "about", label: "About", initialX: 32, initialY: 48, delay: 0.3 },
  {
    id: "projects",
    label: "Projects",
    initialX: 32,
    initialY: 176,
    delay: 0.4,
  },
  {
    id: "education",
    label: "Education",
    initialX: 32,
    initialY: 304,
    delay: 0.5,
  },
  { id: "skills", label: "Skills", initialX: 32, initialY: 432, delay: 0.6 },
];

function DraggableFolder({
  folder,
  onClick,
}: {
  folder: any;
  onClick: () => void;
}) {
  const [pos, setPos] = useState({ x: folder.initialX, y: folder.initialY });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragMode, setIsDragMode] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const stateRef = useRef({
    isDragMode: false,
    pos: { x: folder.initialX, y: folder.initialY },
    startPointer: { x: 0, y: 0 },
    currentPointer: { x: 0, y: 0 },
    initialPointer: { x: 0, y: 0 },
    timer: null as NodeJS.Timeout | null,
    onClick: onClick,
  });

  // Keep ref synchronized
  useEffect(() => {
    stateRef.current.isDragMode = isDragMode;
    stateRef.current.pos = pos;
    stateRef.current.onClick = onClick;
  }, [isDragMode, pos, onClick]);

  useEffect(() => {
    const t = setTimeout(() => setHasAnimated(true), 2000);
    const saved = localStorage.getItem(`folder_pos_${folder.id}`);
    if (saved) {
      try {
        setPos(JSON.parse(saved));
      } catch (e) {}
    }
    return () => clearTimeout(t);
  }, [folder.id]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const state = stateRef.current;
      state.currentPointer = { x: e.clientX, y: e.clientY };

      if (state.isDragMode) {
        setOffset({
          x: e.clientX - state.startPointer.x,
          y: e.clientY - state.startPointer.y,
        });
      } else if (state.timer) {
        // Increased jitter tolerance to 30px so normal hand shake doesn't cancel the long-press
        if (
          Math.abs(e.clientX - state.startPointer.x) > 30 ||
          Math.abs(e.clientY - state.startPointer.y) > 30
        ) {
          clearTimeout(state.timer);
          state.timer = null;
        }
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const state = stateRef.current;

      const totalDist = Math.sqrt(
        Math.pow(e.clientX - state.initialPointer.x, 2) +
          Math.pow(e.clientY - state.initialPointer.y, 2),
      );

      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
        if (totalDist < 20) state.onClick();
      }

      if (state.isDragMode) {
        setIsDragMode(false);

        // If they held the folder but barely moved it, treat it as a click!
        if (totalDist < 10) {
          state.onClick();
        }

        const newPos = {
          x: state.pos.x + e.clientX - state.startPointer.x,
          y: state.pos.y + e.clientY - state.startPointer.y,
        };

        // Basic bounds checking so it doesn't get lost off-screen
        const boundedX = Math.max(
          0,
          Math.min(newPos.x, window.innerWidth - 80),
        );
        const boundedY = Math.max(
          0,
          Math.min(newPos.y, window.innerHeight - 100),
        );

        setPos({ x: boundedX, y: boundedY });
        setOffset({ x: 0, y: 0 });
        localStorage.setItem(
          `folder_pos_${folder.id}`,
          JSON.stringify({ x: boundedX, y: boundedY }),
        );
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (stateRef.current.timer) clearTimeout(stateRef.current.timer);
    };
  }, [folder.id]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Left click only
    e.stopPropagation();

    // Capture pointer so it tracks even if mouse leaves window slightly
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {}

    stateRef.current.startPointer = { x: e.clientX, y: e.clientY };
    stateRef.current.currentPointer = { x: e.clientX, y: e.clientY };
    stateRef.current.initialPointer = { x: e.clientX, y: e.clientY };

    stateRef.current.timer = setTimeout(() => {
      // Once 100ms passes, set the drag origin to exactly where the mouse currently is
      // This prevents snapping if they drifted slightly within the 30px tolerance
      stateRef.current.startPointer = { ...stateRef.current.currentPointer };
      setIsDragMode(true);
      stateRef.current.timer = null;
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: isDragMode ? 1.05 : 1 }}
      transition={{
        type: "spring",
        bounce: 0.5,
        delay: hasAnimated ? 0 : folder.delay,
      }}
      className={`absolute flex flex-col items-center gap-1.5 pointer-events-auto select-none ${isDragMode ? "z-[100] cursor-grabbing" : "cursor-pointer z-20"}`}
      style={{
        left: pos.x + offset.x,
        top: pos.y + offset.y,
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
    >
      <div
        className={`relative w-20 h-20 transition-all drop-shadow-lg flex items-center justify-center ${isDragMode ? "drop-shadow-2xl" : "hover:scale-105"}`}
      >
        <img
          src="https://framerusercontent.com/images/JNuFoJNZB5xor0NzSTUqoFLBk.png"
          alt="Folder"
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
      </div>
      <span
        className={`text-white text-sm font-medium tracking-wide drop-shadow-md mt-1 pointer-events-none transition-opacity ${isDragMode ? "opacity-80" : "opacity-100"}`}
      >
        {folder.label}
      </span>
    </motion.div>
  );
}

function DraggableWindow({
  activeWindow,
  isMaximized,
  setIsMaximized,
  setActiveWindow,
  duotoneColor,
  setDuotoneColor,
}: {
  activeWindow: string;
  isMaximized: boolean;
  setIsMaximized: (val: boolean) => void;
  setActiveWindow: (val: string | null) => void;
  duotoneColor: { r: number, g: number, b: number };
  setDuotoneColor: (c: { r: number, g: number, b: number }) => void;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragMode, setIsDragMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    isDragMode: false,
    pos: null as { x: number; y: number } | null,
    startPointer: { x: 0, y: 0 },
    currentPointer: { x: 0, y: 0 },
    timer: null as NodeJS.Timeout | null,
  });

  useEffect(() => {
    stateRef.current.isDragMode = isDragMode;
    stateRef.current.pos = pos;
  }, [isDragMode, pos]);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(`window_pos_${activeWindow}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPos(parsed);
        stateRef.current.pos = parsed;
      } catch (e) {}
    } else {
      setPos(null);
      stateRef.current.pos = null;
    }
  }, [activeWindow]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isMaximized) return;

      const state = stateRef.current;
      state.currentPointer = { x: e.clientX, y: e.clientY };

      if (state.isDragMode) {
        setOffset({
          x: e.clientX - state.startPointer.x,
          y: e.clientY - state.startPointer.y,
        });
      } else if (state.timer) {
        if (
          Math.abs(e.clientX - state.startPointer.x) > 30 ||
          Math.abs(e.clientY - state.startPointer.y) > 30
        ) {
          clearTimeout(state.timer);
          state.timer = null;
        }
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const state = stateRef.current;
      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }

      if (state.isDragMode) {
        setIsDragMode(false);

        let startX = state.pos?.x ?? 0;
        let startY = state.pos?.y ?? 0;

        if (!state.pos && windowRef.current) {
          const rect = windowRef.current.getBoundingClientRect();
          startX = rect.left;
          startY = rect.top;
        }

        const newPos = {
          x: startX + e.clientX - state.startPointer.x,
          y: startY + e.clientY - state.startPointer.y,
        };

        const boundedX = Math.max(
          -200,
          Math.min(newPos.x, window.innerWidth - 100),
        );
        const boundedY = Math.max(
          0,
          Math.min(newPos.y, window.innerHeight - 50),
        );

        setPos({ x: boundedX, y: boundedY });
        setOffset({ x: 0, y: 0 });
        localStorage.setItem(
          `window_pos_${activeWindow}`,
          JSON.stringify({ x: boundedX, y: boundedY }),
        );
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (stateRef.current.timer) clearTimeout(stateRef.current.timer);
    };
  }, [activeWindow, isMaximized]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (isMaximized) return;
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    // Prevent dragging if clicking on interactive elements or scrollable content
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest(".overflow-y-auto") ||
      target.closest(".window-control-btn")
    ) {
      return;
    }

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (err) {}

    stateRef.current.startPointer = { x: e.clientX, y: e.clientY };
    stateRef.current.currentPointer = { x: e.clientX, y: e.clientY };

    stateRef.current.timer = setTimeout(() => {
      stateRef.current.startPointer = { ...stateRef.current.currentPointer };
      setIsDragMode(true);
      stateRef.current.timer = null;
    }, 100);
  };

  if (!isMounted) return null;

  const isCentered = !pos && !isMaximized;
  let dynamicStyle: React.CSSProperties = {
    touchAction: "none", // Prevent scrolling on the wrapper to keep touch drag smooth
  };

  if (isMaximized) {
    // maximized handled by tailwind classes
  } else if (pos) {
    dynamicStyle.left = pos.x + offset.x;
    dynamicStyle.top = pos.y + offset.y;
    dynamicStyle.margin = 0;
  } else if (isDragMode && windowRef.current) {
    const rect = windowRef.current.getBoundingClientRect();
    dynamicStyle.left = rect.left + offset.x;
    dynamicStyle.top = rect.top + offset.y;
    dynamicStyle.margin = 0;
  }

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={
        isMaximized
          ? { opacity: 1, scale: 1, x: 0, y: 0 }
          : { opacity: 1, scale: isDragMode ? 1.02 : 1, y: 0 }
      }
      className={`absolute z-50 overflow-hidden flex flex-col transition-all duration-300 ${
        activeWindow === "resume" ||
        activeWindow === "assistant" ||
        activeWindow === "about"
          ? "bg-white rounded-[10px] border border-gray-200"
          : "glass bg-white/95 backdrop-blur-3xl border border-white/50"
      } ${
        isDragMode
          ? "shadow-[0_40px_80px_rgba(0,0,0,0.4)] cursor-grabbing"
          : "shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
      } ${
        isMaximized
          ? "inset-0 w-full h-full rounded-none"
          : "max-md:!inset-0 max-md:!w-full max-md:!h-full max-md:!rounded-none " + (isCentered
            ? activeWindow === "assistant"
              ? "top-[10%] left-0 right-0 mx-auto w-[95vw] max-w-[700px] h-[75vh] max-h-[calc(100vh-160px)] rounded-[10px]"
              : activeWindow === "contact"
                ? "top-[10%] left-0 right-0 mx-auto w-[95vw] max-w-[750px] h-auto max-h-[calc(100vh-160px)] rounded-[10px]"
                : activeWindow === "resume" || activeWindow === "about"
                  ? "top-[10%] left-0 right-0 mx-auto w-[95vw] max-w-[900px] h-auto max-h-[calc(100vh-160px)] rounded-[10px]"
                  : activeWindow === "services"
                    ? "top-[20%] left-0 right-0 mx-auto w-[320px] h-[340px] rounded-[10px]"
                    : "top-[10%] left-[15%] w-[70vw] h-[75vh] rounded-2xl"
            : // Absolute positioned layout (stripped of top/left/right/mx-auto)
              activeWindow === "assistant"
              ? "w-[95vw] max-w-[700px] h-[75vh] max-h-[calc(100vh-160px)] rounded-[10px]"
              : activeWindow === "contact"
                ? "w-[95vw] max-w-[750px] h-auto max-h-[calc(100vh-160px)] rounded-[10px]"
                : activeWindow === "resume" || activeWindow === "about"
                  ? "w-[95vw] max-w-[900px] h-auto max-h-[calc(100vh-160px)] rounded-[10px]"
                  : activeWindow === "services"
                    ? "w-[320px] h-[340px] rounded-[10px]"
                    : "w-[70vw] h-[75vh] rounded-2xl")
      }`}
      style={dynamicStyle}
      onPointerDown={onPointerDown}
    >
      {/* Window Title Bar */}
      {activeWindow !== "projects" && activeWindow !== "education" && activeWindow !== "skills" && (
        <div
          className={`h-12 border-b border-zinc-200/50 flex items-center px-4 gap-2 cursor-grab shrink-0 group ${
            activeWindow === "resume" ||
            activeWindow === "about" ||
            activeWindow === "contact"
              ? "bg-white"
              : activeWindow === "assistant"
                ? "bg-[#f5f5f5]"
                : "bg-zinc-100/50 backdrop-blur-xl"
          }`}
        >
          {/* Close */}
          <div
            className="window-control-btn w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer shadow-sm border border-[#e0443e] flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setActiveWindow(null);
              setIsMaximized(false);
            }}
          >
            <X className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Minimize */}
          <div
            className="window-control-btn w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer shadow-sm border border-[#dea123] flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setActiveWindow(null);
              setIsMaximized(false);
            }}
          >
            <Minus className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Maximize */}
          <div
            className="window-control-btn w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer shadow-sm border border-[#1aab29] flex items-center justify-center transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
          >
            <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {activeWindow === "resume" || activeWindow === "about" || activeWindow === "contact" ? (
            <>
              <div className="flex-1"></div>
              <div className="flex items-center gap-4 text-gray-600 mr-2 pointer-events-auto">
                <a href="https://www.linkedin.com/in/bharat-sirmal/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://github.com/bharatsirmal008" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/bharat_sirmal008/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </>
          ) : activeWindow === "assistant" ? (
            <div className="flex-1 text-center font-bold text-[13px] text-gray-700 pr-10 pointer-events-none">
              Bharat AI
            </div>
          ) : (
            <div className="flex-1 text-center font-bold text-sm text-zinc-700 capitalize pr-10 pointer-events-none">
              {activeWindow}
            </div>
          )}
        </div>
      )}
      {/* Window Content */}
      <div
        className={`flex-1 overflow-y-auto cursor-auto relative ${activeWindow === "resume" || activeWindow === "assistant" || activeWindow === "about" || activeWindow === "contact" || activeWindow === "services" ? "rounded-b-[10px]" : "rounded-b-2xl"}`}
        onPointerDown={(e) => e.stopPropagation()} // Let scrollable area swallow pointer events for touch scroll
      >
        <div
          className={`relative ${activeWindow === "resume" || activeWindow === "assistant" || activeWindow === "about" || activeWindow === "contact" || activeWindow === "projects" || activeWindow === "services" || activeWindow === "education" || activeWindow === "skills" ? "p-0 bg-white h-full flex flex-col" : "absolute inset-0 p-8"}`}
        >
          {activeWindow === "about" && <About />}
          {activeWindow === "projects" && (
            <Projects
              onClose={() => {
                setActiveWindow(null);
                setIsMaximized(false);
              }}
              onMinimize={() => {
                setActiveWindow(null);
                setIsMaximized(false);
              }}
              onMaximize={() => setIsMaximized(!isMaximized)}
            />
          )}
          {activeWindow === "education" && (
            <Education 
              onClose={() => {
                setActiveWindow(null);
                setIsMaximized(false);
              }}
              onMinimize={() => {
                setActiveWindow(null);
                setIsMaximized(false);
              }}
              onMaximize={() => setIsMaximized(!isMaximized)}
            />
          )}
          {activeWindow === "skills" && (
            <SkillsMarquee
              isMaximized={isMaximized}
              onClose={() => {
                setActiveWindow(null);
                setIsMaximized(false);
              }}
              onMinimize={() => {
                setActiveWindow(null);
                setIsMaximized(false);
              }}
              onMaximize={() => setIsMaximized(!isMaximized)}
            />
          )}
          {activeWindow === "contact" && <Contact />}
          {activeWindow === "services" && <DuotonePicker color={duotoneColor} onChange={setDuotoneColor} />}
          {activeWindow === "resume" && <Resume />}
          {activeWindow === "assistant" && <Assistant />}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   ASCII BACKGROUND
   Cream canvas covered in a monospace character field whose
   density is driven by layered noise plus a soft central mask —
   sparse "." "-" ":" dots fading out to edges, dense "#" "%" "@"
   clusters in indigo/violet toward the center.
============================================================ */



function DuotonePicker({ color, onChange }: { color: { r: number, g: number, b: number }, onChange: (c: { r: number, g: number, b: number }) => void }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-white">
      <ChromePicker 
        color={color} 
        onChange={(colorResult) => onChange({ r: colorResult.rgb.r, g: colorResult.rgb.g, b: colorResult.rgb.b })} 
        disableAlpha={true}
      />
    </div>
  )
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [duotoneColor, setDuotoneColor] = useState({ r: 50, g: 12, b: 240 });

  const toggleWindow = (id: string, maximize = false) => {
    if (activeWindow === id) {
      setActiveWindow(null);
    } else {
      setActiveWindow(id);
      setIsMaximized(maximize);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0b0d] font-sans selection:bg-black selection:text-white"
    >
      <svg width="0" height="0" className="absolute hidden">
        <filter id="duotone">
          <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
          <feComponentTransfer colorInterpolationFilters="sRGB">
            <feFuncR type="table" tableValues={`0 ${duotoneColor.r / 255}`} />
            <feFuncG type="table" tableValues={`0 ${duotoneColor.g / 255}`} />
            <feFuncB type="table" tableValues={`0 ${duotoneColor.b / 255}`} />
          </feComponentTransfer>
        </filter>
      </svg>
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Mobile Background */}
        <Image
          src="/hero_bg.png"
          alt="Hero Background Mobile"
          fill
          priority
          className="object-cover md:hidden"
          style={{ filter: "url(#duotone)" }}
        />
        {/* Desktop Background */}
        <Image
          src="/hero_desktop.png"
          alt="Hero Background Desktop"
          fill
          priority
          className="object-cover hidden md:block"
          style={{ filter: "url(#duotone)" }}
        />
      </div>



      {/* Floating macOS Folders */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {FOLDERS.map((folder) => (
          <DraggableFolder
            key={folder.id}
            folder={folder}
            onClick={() => toggleWindow(folder.id, false)}
          />
        ))}
      </div>

      {/* Window Modal */}
      {activeWindow && (
        <DraggableWindow
          activeWindow={activeWindow}
          isMaximized={isMaximized}
          setIsMaximized={setIsMaximized}
          setActiveWindow={setActiveWindow}
          duotoneColor={duotoneColor}
          setDuotoneColor={setDuotoneColor}
        />
      )}

      {/* Bottom Dock (macOS Format) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 rounded-[15px] p-2 flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl"
      >
        {/* Resume Icon */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute -top-12 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10 whitespace-nowrap">
            Resume
          </div>
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-[22.5%] shadow-sm flex items-center justify-center border border-white/50 hover:scale-110 transition-transform cursor-pointer overflow-hidden"
            onClick={() => toggleWindow("resume", false)}
          >
            <img
              src="https://framerusercontent.com/images/VCIQF7ylF9U0o5QZkTgji0mxx28.png"
              alt="Resume"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Siri Icon */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute -top-12 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10 whitespace-nowrap">
            Assistant
          </div>
          <div
            className="w-12 h-12 md:w-14 md:h-14 bg-zinc-900 rounded-[22.5%] shadow-sm flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer overflow-hidden relative"
            onClick={() => toggleWindow("assistant", false)}
          >
            <div
              className="absolute w-6 h-6 rounded-full bg-blue-500 blur-[8px] mix-blend-screen animate-pulse"
              style={{ transform: "translate(-3px, -3px)" }}
            ></div>
            <div
              className="absolute w-6 h-6 rounded-full bg-purple-500 blur-[8px] mix-blend-screen animate-pulse"
              style={{
                transform: "translate(3px, 3px)",
                animationDelay: "0.5s",
              }}
            ></div>
            <div
              className="absolute w-6 h-6 rounded-full bg-pink-500 blur-[8px] mix-blend-screen animate-pulse"
              style={{
                transform: "translate(-3px, 3px)",
                animationDelay: "1s",
              }}
            ></div>
            <div
              className="absolute w-6 h-6 rounded-full bg-cyan-400 blur-[8px] mix-blend-screen animate-pulse"
              style={{
                transform: "translate(3px, -3px)",
                animationDelay: "1.5s",
              }}
            ></div>
            <div className="absolute w-full h-full rounded-[22.5%] shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] pointer-events-none"></div>
          </div>
        </div>

        {/* Finder Icon */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute -top-12 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10 whitespace-nowrap">
            Services
          </div>
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-[22.5%] shadow-sm flex overflow-hidden border border-white/50 hover:scale-110 transition-transform cursor-pointer relative bg-[#f0f0f0]"
            onClick={() => toggleWindow("services", false)}
          >
            <div className="w-1/2 h-full bg-[#1e88e5]"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full relative">
                {/* left eye */}
                <div className="absolute left-[28%] top-[35%] w-1.5 h-2.5 bg-black rounded-full opacity-80"></div>
                {/* right eye */}
                <div className="absolute right-[28%] top-[35%] w-1.5 h-2.5 bg-black rounded-full opacity-80"></div>
                {/* smile */}
                <div className="absolute left-[20%] bottom-[25%] w-[60%] h-4 border-b-2 border-black rounded-[50%] opacity-80"></div>
                {/* nose */}
                <div className="absolute left-1/2 top-[30%] bottom-[35%] w-0.5 bg-black -translate-x-1/2 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Icon */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute -top-12 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10 whitespace-nowrap">
            Contact
          </div>
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-[22.5%] shadow-sm flex items-center justify-center border border-white/50 hover:scale-110 transition-transform cursor-pointer overflow-hidden"
            onClick={() => toggleWindow("contact", false)}
          >
            <img
              src="https://framerusercontent.com/images/ZAH3C8amQUigspCjEG1FJWPjI.png"
              alt="Contact"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
