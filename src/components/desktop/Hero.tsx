"use client";

import React, { useRef, useState, useEffect, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { HalloweenAnimation } from "./HalloweenAnimation";
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
  ChevronLeft,
} from "lucide-react";
import { JoJoWordmark } from "../ui/JoJoWordmark";
import { LetterReveal } from "../ui/LetterReveal";
import { HeaderSocialLinks } from "../ui/HeaderSocialLinks";

const loading = () => <div role="status" className="grid min-h-40 flex-1 place-items-center bg-white p-6 text-sm text-slate-500">Opening app…</div>;
const About = dynamic(() => import("../portfolio/About").then(module => module.About), { loading });
const Projects = dynamic(() => import("../portfolio/Projects").then(module => module.Projects), { loading });
const Education = dynamic(() => import("../portfolio/Education").then(module => module.Education), { loading });
const SkillsMarquee = dynamic(() => import("../portfolio/SkillsMarquee").then(module => module.SkillsMarquee), { loading });
const Contact = dynamic(() => import("../portfolio/Contact").then(module => module.Contact), { loading });
const Resume = dynamic(() => import("../portfolio/Resume").then(module => module.Resume), { loading });
const Assistant = dynamic(() => import("../assistant/Assistant").then(module => module.Assistant), { loading });
const Certificates = dynamic(() => import("../portfolio/Certificates").then(module => module.Certificates), { loading });

// Warm chunks before clicks without putting every app in the initial bundle.
const appLoaders: Record<string, () => Promise<unknown>> = {
  about: () => import("../portfolio/About"), projects: () => import("../portfolio/Projects"),
  education: () => import("../portfolio/Education"), skills: () => import("../portfolio/SkillsMarquee"),
  contact: () => import("../portfolio/Contact"), resume: () => import("../portfolio/Resume"),
  assistant: () => import("../assistant/Assistant"), certificates: () => import("../portfolio/Certificates"),
};
const warmedApps = new Map<string, Promise<unknown>>();
function warmApp(id: string) {
  if (!appLoaders[id]) return Promise.resolve();
  if (!warmedApps.has(id)) {
    warmedApps.set(id, appLoaders[id]().catch(() => { warmedApps.delete(id); }));
  }
  const kind = ({ projects: "project", certificates: "certificate", resume: "resume" } as Record<string, "project" | "certificate" | "resume">)[id];
  if (kind) void import("../../lib/cloud-content").then(module => module.preloadPublicContent(kind)).catch(() => {});
  return warmedApps.get(id)!;
}

const FOLDERS = [
  {
    id: "resume",
    label: "Resume",
    initialX: 136,
    initialY: 48,
    delay: 0.7,
    image: "/resume.svg",
  },
  {
    id: "contact",
    label: "Contact",
    initialX: 136,
    initialY: 176,
    delay: 0.8,
    image: "/contact_image.avif",
  },
  {
    id: "certificates",
    label: "Certificates",
    initialX: 136,
    initialY: 304,
    delay: 0.65,
    image: "/certificates.png",
  },
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
  compact = false,
}: {
  folder: any;
  onClick: () => void;
  running?: boolean;
  compact?: boolean;
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
    if (compact) return;
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
  }, [folder.id, compact]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (compact) return;
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
      className={`desktop-app-icon absolute flex flex-col items-center gap-1.5 pointer-events-auto select-none ${isDragMode ? "z-[100] cursor-grabbing" : "cursor-pointer z-20"}`}
      style={{
        left: pos.x + offset.x,
        top: pos.y + offset.y,
        touchAction: compact ? "pan-y" : "none",
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
      onPointerEnter={() => { void warmApp(folder.id); }}
      onFocus={() => { void warmApp(folder.id); }}
      onPointerDown={event => { void warmApp(folder.id); onPointerDown(event); }}
      onClick={compact ? onClick : undefined}
    >
      <div
        className={`relative w-[68px] h-[68px] transition-all drop-shadow-lg flex items-center justify-center ${isDragMode ? "drop-shadow-2xl" : "hover:scale-105"}`}
      >
        <Image
          src={folder.image}
          alt=""
          width={68}
          height={68}
          sizes="(max-width: 767px) 52px, 68px"
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
  onVoiceModeChange,
  resumeEditable = false,
  mobile = false,
}: {
  activeWindow: string;
  isMaximized: boolean;
  setIsMaximized: (val: boolean) => void;
  setActiveWindow: (val: string | null) => void;
  onVoiceModeChange?: (active: boolean) => void;
  resumeEditable?: boolean;
  mobile?: boolean;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragMode, setIsDragMode] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fitWindow = () => {
      const element = windowRef.current;
      if (!element) return;
      setPos(previous => previous ? {
        x: Math.max(0, Math.min(previous.x, window.innerWidth - element.offsetWidth)),
        y: Math.max(0, Math.min(previous.y, window.innerHeight - element.offsetHeight)),
      } : null);
      setOffset({ x: 0, y: 0 });
    };
    window.addEventListener("resize", fitWindow);
    return () => window.removeEventListener("resize", fitWindow);
  }, []);

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
    if (isMaximized || mobile) return;
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

  const isCentered = !pos && !isMaximized && !isDragMode;
  let dynamicStyle: React.CSSProperties = {
    touchAction: "pan-y", // Keep touch scrolling available inside app content.
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
      data-maximized={isMaximized}
      data-mobile={mobile}
      initial={mobile ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
      animate={
        isMaximized || mobile
          ? { opacity: 1, scale: 1, x: 0, y: 0 }
          : { opacity: 1, scale: isDragMode ? 1.02 : 1, y: 0 }
      }
      transition={{ duration: 0.12, ease: "easeOut" }}
      className={`desktop-window absolute z-50 overflow-hidden flex flex-col transition-none ${
        activeWindow === "resume" || activeWindow === "about" || activeWindow === "certificates"
          ? "bg-white rounded-[var(--portfolio-radius)] border border-gray-200"
          : activeWindow === "assistant"
            ? "bg-black rounded-[var(--portfolio-radius)] border-none"
            : activeWindow === "projects"
              ? `bg-white border border-[#E5EAF2] ${!isMaximized ? "md:!rounded-[var(--portfolio-radius)]" : ""}`
            : "glass bg-white/95 backdrop-blur-3xl border border-white/50"
      } ${
        isDragMode
          ? "shadow-[0_40px_80px_rgba(0,0,0,0.4)] cursor-grabbing"
          : activeWindow === "projects" ? "shadow-[0_24px_70px_rgba(85,110,145,0.18)]" : "shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
      } ${
        isMaximized
          ? "inset-0 w-full h-full rounded-none"
          : "max-md:!inset-0 max-md:!w-full max-md:!h-full max-md:!rounded-none " +
            "w-[70vw] h-[75dvh] rounded-[var(--portfolio-radius)] " +
            (isCentered ? "top-[10%] left-[15%]" : "")
      }`}
      style={dynamicStyle}
      onPointerDown={onPointerDown}
    >
      {/* Window Title Bar */}
      {mobile && !["projects", "education", "skills"].includes(activeWindow) && <header className={`relative flex min-h-12 shrink-0 items-center gap-3 border-b px-3 ${activeWindow === "assistant" ? "border-emerald-300/10 bg-[#06120d] text-emerald-50" : "border-slate-100 bg-white text-slate-800"}`}><button type="button" aria-label="Back to desktop" onClick={() => { setActiveWindow(null); setIsMaximized(false); }} className="flex min-h-11 items-center gap-1 px-1 text-sm"><ChevronLeft size={22} />Back</button><span className={activeWindow === "assistant" ? "pointer-events-none absolute left-1/2 -translate-x-1/2" : "font-medium capitalize"}>{activeWindow === "assistant" ? <JoJoWordmark /> : activeWindow}</span></header>}
      {!mobile && activeWindow !== "projects" &&
        activeWindow !== "education" &&
        activeWindow !== "skills" && (
          <div
            className={`relative h-12 border-b border-zinc-200/50 flex items-center px-4 gap-2 cursor-grab shrink-0 group ${
              activeWindow === "resume" ||
              activeWindow === "certificates" ||
              activeWindow === "about" ||
              activeWindow === "contact"
                ? "bg-white"
                : activeWindow === "assistant"
                  ? "bg-[#06120d]/95 !border-emerald-300/10 text-white"
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
            {activeWindow === "assistant" ? (
              <div className="min-w-0 flex-1 text-center text-emerald-100"><span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><JoJoWordmark><LetterReveal text="JoJo" /></JoJoWordmark></span></div>
            ) : activeWindow === "certificates" ? (
              <div className="min-w-0 flex-1 text-center text-sm font-bold capitalize text-zinc-700"><LetterReveal text="Certificates" /></div>
            ) : <div className="flex-1" />}
            <HeaderSocialLinks dark={activeWindow === "assistant"} />
          </div>
        )}
      {/* Window Content */}
      <div
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain cursor-auto relative ${activeWindow === "resume" || activeWindow === "assistant" || activeWindow === "about" || activeWindow === "projects" || activeWindow === "contact" ? "rounded-b-[var(--portfolio-radius)]" : "rounded-b-[var(--portfolio-radius)]"}`}
        onPointerDown={(e) => e.stopPropagation()} // Let scrollable area swallow pointer events for touch scroll
      >
        <div
          className={`relative ${activeWindow === "about" ? "min-h-full bg-[#fafaff]" : activeWindow === "projects" ? "p-0 bg-white h-full flex flex-col" : activeWindow === "resume" || activeWindow === "certificates" || activeWindow === "contact" || activeWindow === "education" || activeWindow === "skills" ? "p-0 bg-white h-full flex flex-col" : activeWindow === "assistant" ? "p-0 bg-transparent h-full flex flex-col" : "absolute inset-0 p-8"}`}
        >
          {activeWindow === "about" && <About />}
          {activeWindow === "certificates" && <Certificates />}
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
          {activeWindow === "resume" && <Resume editable={resumeEditable} />}
          {activeWindow === "assistant" && <Assistant onVoiceModeChange={onVoiceModeChange} />}
        </div>
      </div>
    </motion.div>
  );
}

const MOBILE_VIEWPORT = "(max-width: 767px), (pointer: coarse) and (max-width: 1023px)";

function subscribeMobileViewport(callback: () => void) {
  const media = window.matchMedia(MOBILE_VIEWPORT);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function Hero({ initialWindow, resumeEditable = false }: { initialWindow?: string; resumeEditable?: boolean } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWindow, setActiveWindow] = useState<string | null>(initialWindow || null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const isMobile = useSyncExternalStore(subscribeMobileViewport, () => window.matchMedia(MOBILE_VIEWPORT).matches, () => false);
  const hideDock = (activeWindow === "assistant" && isVoiceMode) || Boolean(activeWindow && (isMaximized || isMobile));
  const [focusedApp, setFocusedApp] = useState<string | null>(null);
  const [legacyZ, setLegacyZ] = useState(50);
  const topZ = useRef(50);
  const focusSocial = (id: string) => {
    const app = SOCIAL_APPS.find(app => app.id === id);
    if (app) window.open(app.href, "_blank", "noopener,noreferrer");
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
    if (initialWindow) {
      setActiveWindow(initialWindow);
    } else if (storedWindow) {
      setActiveWindow(storedWindow);
    }
    if (storedMaximized === "true") {
      setIsMaximized(true);
    }
  }, [initialWindow]);

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

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || "")) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const queue = ["assistant", "resume", "projects", "education", "about", "contact", "certificates", "skills"];
    const next = () => {
      if (cancelled) return;
      if (document.hidden) { timer = setTimeout(next, 1500); return; }
      const id = queue.shift();
      if (id) void warmApp(id).finally(() => { if (!cancelled) timer = setTimeout(next, 600); });
    };
    timer = setTimeout(next, 2000);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  const toggleWindow = (id: string, maximize = false) => {
    void warmApp(id);
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
      className="relative h-full w-full overflow-hidden overscroll-none bg-black font-sans selection:bg-red-900 selection:text-white"
    >
      {/* Halloween wallpaper; desktop folders and windows remain interactive. */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HalloweenAnimation
          greeting="I AM"
          title="BHARAT SIRMAL"
          speed={0.5}
          controls={false}
          paused={Boolean(activeWindow)}
          className="h-full px-3 md:px-24"
        />
      </div>

      {/* Floating macOS Folders */}
      <div className="desktop-icons absolute inset-0 z-20 pointer-events-none">
        {FOLDERS.map((folder) => (
          <DraggableFolder
            key={folder.id}
            folder={folder}
            compact={isMobile}
            onClick={() => toggleWindow(folder.id, false)}
          />
        ))}
      </div>

      {/* Window Modal */}
      {activeWindow && (
        <div className="pointer-events-none absolute inset-0 [&>div]:pointer-events-auto" style={{ zIndex: legacyZ }} onPointerDownCapture={focusLegacy}>
        <DraggableWindow
          key={activeWindow}
          activeWindow={activeWindow}
          isMaximized={isMaximized}
          setIsMaximized={setIsMaximized}
          setActiveWindow={setActiveWindow}
          onVoiceModeChange={setIsVoiceMode}
          resumeEditable={resumeEditable}
          mobile={isMobile}
        />
        </div>
      )}



      {/* Bottom Dock (macOS Format) */}
      {!hideDock && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="desktop-dock absolute bottom-8 left-1/2 -translate-x-1/2 z-20 rounded-[15px] px-2 sm:px-4 py-2 flex items-center gap-2 sm:gap-4 bg-black/30 border border-white/30 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
      >
        {/* LinkedIn Icon */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute -top-12 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10 whitespace-nowrap">
            LinkedIn
          </div>
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-[22.5%] shadow-sm flex items-center justify-center border border-white/50 hover:scale-110 transition-transform cursor-pointer overflow-hidden"
            onClick={() => focusSocial("linkedin")}
          >
            <Image
              src="/linkedin.png" width={56} height={56} sizes="56px"
              alt="LinkedIn"
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
            onPointerEnter={() => { void warmApp("assistant"); }}
            onFocus={() => { void warmApp("assistant"); }}
            onPointerDown={() => { void warmApp("assistant"); }}
            onClick={() => toggleWindow("assistant", false)}
          >
            <Image
              src="/jojo-ai-assistant-app.svg" width={56} height={56} sizes="56px"
              alt="Assistant"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-10 bg-white/20 mx-1 rounded-full"></div>



        {/* GitHub Icon */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute -top-12 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-white/10 whitespace-nowrap">
            GitHub
          </div>
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-[22.5%] shadow-sm flex items-center justify-center border border-white/50 hover:scale-110 transition-transform cursor-pointer overflow-hidden"
            onClick={() => focusSocial("github")}
          >
            <Image
              src="/github.png" width={56} height={56} sizes="56px"
              alt="GitHub"
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        </div>

      </motion.div>
      )}
    </section>
  );
}
