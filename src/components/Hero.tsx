"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HalloweenAnimation } from "./HalloweenAnimation";
import { DesktopWindow } from "./DesktopWindow";
import { LinkedInApp } from "./LinkedInApp";
import { GitHubApp } from "./GitHubApp";
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
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { Contact } from "@/components/Contact";
import { Resume } from "@/components/Resume";
import { Assistant } from "@/components/Assistant";
import { LetterReveal } from "./LetterReveal";

const FOLDERS = [
  {
    id: "about",
    label: "About",
    initialX: 32,
    initialY: 48,
    delay: 0.3,
    image: "/about.avif",
  },
  {
    id: "projects",
    label: "Projects",
    initialX: 32,
    initialY: 176,
    delay: 0.4,
    image: "/projects.png",
  },
  {
    id: "education",
    label: "Education",
    initialX: 32,
    initialY: 304,
    delay: 0.5,
    image: "/education.png",
  },
  {
    id: "skills",
    label: "Skills",
    initialX: 32,
    initialY: 432,
    delay: 0.6,
    image: "/skill.png",
  },
];

const SOCIAL_APPS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    initialX: 136,
    initialY: 48,
    delay: 0.7,
    image: "/linkedin.png",
    href: "https://www.linkedin.com/in/bharat-sirmal/",
  },
  {
    id: "github",
    label: "GitHub",
    initialX: 136,
    initialY: 176,
    delay: 0.8,
    image: "/github.png",
    href: "https://github.com/bharatsirmal008",
  },
];

function DraggableFolder({
  folder,
  onClick,
  running = false,
}: {
  folder: any;
  onClick: () => void;
  running?: boolean;
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
      role="button"
      tabIndex={0}
      aria-label={`Open ${folder.label}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      onPointerDown={onPointerDown}
    >
      <div
        className={`relative w-[68px] h-[68px] transition-all drop-shadow-lg flex items-center justify-center ${isDragMode ? "drop-shadow-2xl" : "hover:scale-105"}`}
      >
        <img
          src={
            folder.image ||
            "https://framerusercontent.com/images/JNuFoJNZB5xor0NzSTUqoFLBk.png"
          }
          alt="Folder"
          className="w-full h-full object-cover pointer-events-none rounded-[15px]"
          draggable={false}
        />
      </div>
      <span
        className={`text-white text-sm font-medium tracking-wide drop-shadow-md mt-1 pointer-events-none transition-opacity ${isDragMode ? "opacity-80" : "opacity-100"}`}
      >
        <LetterReveal text={folder.label} />
      </span>
      {running && <span aria-label={`${folder.label} is running`} className="h-1 w-1 rounded-full bg-sky-300 shadow-[0_0_8px_#7dd3fc]" />}
    </motion.div>
  );
}

function DraggableWindow({
  activeWindow,
  isMaximized,
  setIsMaximized,
  setActiveWindow,
  focusSocial,
}: {
  activeWindow: string;
  isMaximized: boolean;
  setIsMaximized: (val: boolean) => void;
  setActiveWindow: (val: string | null) => void;
  focusSocial?: (id: string) => void;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragMode, setIsDragMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    isDragMode: false,
    pos: null as { x: number; y: number } | null,
    initialDragPos: null as { x: number; y: number } | null,
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

        let startX = state.initialDragPos?.x ?? 0;
        let startY = state.initialDragPos?.y ?? 0;

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
      
      if (!pos && windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        stateRef.current.initialDragPos = { x: rect.left, y: rect.top };
      } else {
        stateRef.current.initialDragPos = pos;
      }

      setIsDragMode(true);
      stateRef.current.timer = null;
    }, 100);
  };

  if (!isMounted) return null;

  const isCentered = !pos && !isMaximized && !isDragMode;
  let dynamicStyle: React.CSSProperties = {
    touchAction: "none", // Prevent scrolling on the wrapper to keep touch drag smooth
  };

  if (isMaximized) {
    // maximized handled by tailwind classes
  } else if (pos) {
    dynamicStyle.left = pos.x + offset.x;
    dynamicStyle.top = pos.y + offset.y;
    dynamicStyle.margin = 0;
  } else if (isDragMode) {
    const startX = stateRef.current.initialDragPos?.x ?? 0;
    const startY = stateRef.current.initialDragPos?.y ?? 0;
    dynamicStyle.left = startX + offset.x;
    dynamicStyle.top = startY + offset.y;
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
      className={`absolute z-50 overflow-hidden flex flex-col ${isDragMode ? "" : "transition-all duration-300"} ${
        activeWindow === "resume" || activeWindow === "about"
          ? "bg-white rounded-[10px] border border-gray-200"
          : activeWindow === "assistant"
            ? "bg-black rounded-[10px] border-none"
            : "glass bg-white/95 backdrop-blur-3xl border border-white/50"
      } ${
        isDragMode
          ? "shadow-[0_40px_80px_rgba(0,0,0,0.4)] cursor-grabbing"
          : "shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
      } ${
        isMaximized
          ? "inset-0 w-full h-full rounded-none"
          : "max-md:!inset-0 max-md:!w-full max-md:!h-full max-md:!rounded-none " +
            (isCentered
              ? activeWindow === "assistant"
                ? "top-[5%] left-0 right-0 mx-auto w-[95vw] max-w-[550px] h-[85vh] max-h-[calc(100vh-100px)] rounded-[10px]"
                : activeWindow === "contact"
                  ? "top-[10%] left-0 right-0 mx-auto w-[95vw] max-w-[750px] h-auto max-h-[calc(100vh-160px)] rounded-[10px]"
                  : activeWindow === "resume" || activeWindow === "about"
                    ? "top-[10%] left-0 right-0 mx-auto w-[95vw] max-w-[900px] h-auto max-h-[calc(100vh-160px)] rounded-[10px]"
                    : "top-[10%] left-[15%] w-[70vw] h-[75vh] rounded-2xl"
              : // Absolute positioned layout (stripped of top/left/right/mx-auto)
                activeWindow === "assistant"
                ? "w-[95vw] max-w-[550px] h-[85vh] max-h-[calc(100vh-100px)] rounded-[10px]"
                : activeWindow === "contact"
                  ? "w-[95vw] max-w-[750px] h-auto max-h-[calc(100vh-160px)] rounded-[10px]"
                  : activeWindow === "resume" || activeWindow === "about"
                    ? "w-[95vw] max-w-[900px] h-auto max-h-[calc(100vh-160px)] rounded-[10px]"
                    : "w-[70vw] h-[75vh] rounded-2xl")
      }`}
      style={dynamicStyle}
      onPointerDown={onPointerDown}
    >
      {/* Window Title Bar */}
      {activeWindow !== "projects" &&
        activeWindow !== "education" &&
        activeWindow !== "skills" && (
          <div
            className={`h-12 border-b border-zinc-200/50 flex items-center px-4 gap-2 cursor-grab shrink-0 group ${
              activeWindow === "resume" ||
              activeWindow === "about" ||
              activeWindow === "contact"
                ? "bg-white"
                : activeWindow === "assistant"
                  ? "bg-[#050508] !border-white/10 text-white"
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
            {activeWindow === "resume" ||
            activeWindow === "about" ||
            activeWindow === "contact" ? (
              <>
                <div className="flex-1"></div>
                <div className="flex items-center gap-4 text-gray-600 mr-2 pointer-events-auto">
                  <button
                    onClick={() => focusSocial?.("linkedin")}
                    className="hover:text-gray-900 transition-colors"
                    aria-label="Open LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => focusSocial?.("github")}
                    className="hover:text-gray-900 transition-colors"
                    aria-label="Open GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </button>
                  <a
                    href="https://www.instagram.com/bharat_sirmal008/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </>
            ) : activeWindow === "assistant" ? (
              <div className="flex-1 text-center font-bold text-[20px] pr-10 pointer-events-none tracking-wide">
                <span 
                  className="bg-gradient-to-r from-cyan-300 via-white to-orange-400 text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient-x drop-shadow-sm"
                  style={{ fontFamily: "'Amarna', sans-serif" }}
                >
                  <LetterReveal text="JOJO" />
                </span>
              </div>
            ) : (
              <div className="flex-1 text-center font-bold text-sm text-zinc-700 capitalize pr-10 pointer-events-none">
                <LetterReveal text={activeWindow} />
              </div>
            )}
          </div>
        )}
      {/* Window Content */}
      <div
        className={`flex-1 overflow-y-auto cursor-auto relative ${activeWindow === "resume" || activeWindow === "assistant" || activeWindow === "about" || activeWindow === "contact" ? "rounded-b-[10px]" : "rounded-b-2xl"}`}
        onPointerDown={(e) => e.stopPropagation()} // Let scrollable area swallow pointer events for touch scroll
      >
        <div
          className={`relative ${activeWindow === "resume" || activeWindow === "about" || activeWindow === "contact" || activeWindow === "projects" || activeWindow === "education" || activeWindow === "skills" ? "p-0 bg-white h-full flex flex-col" : activeWindow === "assistant" ? "p-0 bg-transparent h-full flex flex-col" : "absolute inset-0 p-8"}`}
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
          {activeWindow === "resume" && <Resume focusSocial={focusSocial} />}
          {activeWindow === "assistant" && <Assistant />}
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [socialWindows, setSocialWindows] = useState<Record<string, { minimized: boolean; zIndex: number }>>({});
  const [focusedApp, setFocusedApp] = useState<string | null>(null);
  const [legacyZ, setLegacyZ] = useState(50);
  const topZ = useRef(50);
  const focusSocial = (id: string) => {
    if (focusedApp === id && !socialWindows[id]?.minimized) return;
    const zIndex = ++topZ.current;
    setFocusedApp(id);
    setSocialWindows((previous) => ({ ...previous, [id]: { minimized: false, zIndex } }));
  };
  const focusLegacy = () => {
    if (focusedApp === "legacy") return;
    setFocusedApp("legacy");
    setLegacyZ(++topZ.current);
  };

  useEffect(() => {
    setIsMounted(true);
    const storedWindow = sessionStorage.getItem("activeWindow");
    const storedMaximized = sessionStorage.getItem("isMaximized");
    if (storedWindow) {
      setActiveWindow(storedWindow);
    }
    if (storedMaximized === "true") {
      setIsMaximized(true);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (activeWindow) {
      sessionStorage.setItem("activeWindow", activeWindow);
      sessionStorage.setItem("isMaximized", isMaximized.toString());
    } else {
      sessionStorage.removeItem("activeWindow");
      sessionStorage.removeItem("isMaximized");
    }
  }, [activeWindow, isMaximized, isMounted]);

  const toggleWindow = (id: string, maximize = false) => {
    focusLegacy();
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
      className="relative h-[100dvh] w-full overflow-hidden bg-black font-sans selection:bg-red-900 selection:text-white"
    >
      {/* Halloween wallpaper; desktop folders and windows remain interactive. */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HalloweenAnimation
          greeting="I AM"
          title="BHARAT SIRMAL"
          speed={0.5}
          controls={false}
          className="h-full pl-24 pr-3 sm:px-24"
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
        {SOCIAL_APPS.map((app) => (
          <DraggableFolder
            key={app.id}
            folder={app}
            running={Boolean(socialWindows[app.id])}
            onClick={() => focusSocial(app.id)}
          />
        ))}
      </div>

      {/* Window Modal */}
      {activeWindow && (
        <div className="pointer-events-none absolute inset-0 [&>div]:pointer-events-auto" style={{ zIndex: legacyZ }} onPointerDownCapture={focusLegacy}>
        <DraggableWindow
          activeWindow={activeWindow}
          isMaximized={isMaximized}
          setIsMaximized={setIsMaximized}
          setActiveWindow={setActiveWindow}
          focusSocial={focusSocial}
        />
        </div>
      )}

      <AnimatePresence>
        {SOCIAL_APPS.filter((app) => socialWindows[app.id]).map((app) => (
          <DesktopWindow
            key={app.id}
            title={app.label}
            icon={app.image}
            minimized={socialWindows[app.id].minimized}
            zIndex={socialWindows[app.id].zIndex}
            focused={focusedApp === app.id}
            onFocus={() => focusSocial(app.id)}
            onMinimize={() => {
              setSocialWindows((previous) => ({ ...previous, [app.id]: { ...previous[app.id], minimized: true } }));
              setFocusedApp(null);
            }}
            onClose={() => {
              setSocialWindows((previous) => {
                const next = { ...previous };
                delete next[app.id];
                return next;
              });
              setFocusedApp(null);
            }}
          >
            {app.id === "linkedin" ? <LinkedInApp /> : <GitHubApp />}
          </DesktopWindow>
        ))}
      </AnimatePresence>

      {/* Bottom Dock (macOS Format) */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10000] rounded-[15px] px-2 sm:px-4 py-2 flex items-center gap-2 sm:gap-4 bg-black/30 border border-white/30 backdrop-blur-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
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
              src="/resume.svg"
              alt="Resume"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Jojo AI Assistant Icon */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute -top-12 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10 whitespace-nowrap">
            Assistant
          </div>
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-[22.5%] shadow-sm flex items-center justify-center border border-white/50 hover:scale-110 transition-transform cursor-pointer overflow-hidden"
            onClick={() => toggleWindow("assistant", false)}
          >
            <img
              src="/jojo-ai-assistant-app.svg"
              alt="Assistant"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-10 bg-white/20 mx-1 rounded-full"></div>



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
              src="/contact_image.avif"
              alt="Contact"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        </div>
        {SOCIAL_APPS.filter((app) => socialWindows[app.id]).map((app) => (
          <button key={app.id} type="button" aria-label={`Restore ${app.label} window`} onClick={() => focusSocial(app.id)} className="group relative h-12 w-12 shrink-0 rounded-[22.5%] border border-white/50 shadow-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-white md:h-14 md:w-14">
            <img src={app.image} alt="" className="h-full w-full rounded-[22.5%] object-cover" draggable={false} />
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">{app.label}</span>
            <span aria-label={`${app.label} is running`} className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_8px_#7dd3fc]" />
          </button>
        ))}
      </motion.div>
    </section>
  );
}
