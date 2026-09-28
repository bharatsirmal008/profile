"use client";

import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";

type Bounds = { x: number; y: number; width: number; height: number };
type Props = {
  title: string; icon: string; minimized: boolean; zIndex: number; focused: boolean;
  onFocus: () => void; onMinimize: () => void; onClose: () => void; children: ReactNode;
};

function viewportBounds(): Bounds {
  const width = Math.min(980, window.innerWidth - 32);
  const height = Math.min(730, window.innerHeight - 128);
  return { x: (window.innerWidth - width) / 2, y: 24, width, height: Math.max(200, height) };
}

export function DesktopWindow({ title, icon, minimized, zIndex, focused, onFocus, onMinimize, onClose, children }: Props) {
  const [bounds, setBounds] = useState(viewportBounds);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [maximized, setMaximized] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const reduced = useReducedMotion();
  const windowRef = useRef<HTMLDivElement>(null);
  const interaction = useRef<{ kind: "drag" | "resize"; x: number; y: number; bounds: Bounds } | null>(null);

  useEffect(() => {
    const resize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setBounds((previous) => {
        const width = Math.min(previous.width, window.innerWidth - 24);
        const height = Math.min(previous.height, Math.max(180, window.innerHeight - 110));
        return { width, height, x: Math.max(12, Math.min(previous.x, window.innerWidth - width - 12)), y: Math.max(12, Math.min(previous.y, window.innerHeight - height - 90)) };
      });
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (focused && !minimized) windowRef.current?.focus({ preventScroll: true });
  }, [focused, minimized]);

  const start = (event: PointerEvent<HTMLElement>, kind: "drag" | "resize") => {
    if (maximized || event.button !== 0 || (event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    interaction.current = { kind, x: event.clientX, y: event.clientY, bounds };
    setInteracting(true);
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const current = interaction.current;
    if (!current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    const original = current.bounds;
    if (current.kind === "drag") {
      setBounds({ ...original, x: Math.max(8, Math.min(original.x + dx, viewport.width - original.width - 8)), y: Math.max(8, Math.min(original.y + dy, viewport.height - original.height - 88)) });
    } else {
      setBounds({ ...original, width: Math.max(Math.min(360, viewport.width - 24), Math.min(original.width + dx, viewport.width - original.x - 8)), height: Math.max(Math.min(280, viewport.height - 110), Math.min(original.height + dy, viewport.height - original.y - 88)) });
    }
  };
  const end = () => { interaction.current = null; setInteracting(false); };
  const isMobile = viewport.width < 768;
  const effectiveMaximized = maximized || isMobile;
  const visible = effectiveMaximized ? { x: 0, y: 0, width: viewport.width, height: viewport.height } : bounds;

  return (
    <motion.div
      ref={windowRef} role="dialog" aria-label={`${title} window`} tabIndex={-1} inert={minimized}
      data-app-window={title.toLowerCase()} data-maximized={effectiveMaximized} data-minimized={minimized}
      onPointerDownCapture={onFocus} onFocusCapture={onFocus}
      initial={{ ...visible, opacity: 0, scale: 0.94 }}
      animate={{ ...visible, x: minimized ? viewport.width / 2 - visible.width / 2 : visible.x, y: minimized ? viewport.height - visible.height / 2 - 55 : visible.y, scale: minimized ? 0.08 : 1, opacity: minimized ? 0 : 1, visibility: "visible", boxShadow: focused ? "0 24px 100px #000b, 0 0 0 1px #ffffff55" : "0 12px 50px #0007, 0 0 0 1px #ffffff22", transitionEnd: { visibility: minimized ? "hidden" : "visible" } }}
      transition={{ duration: interacting || reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: reduced ? 0 : 0.2 } }}
      style={{ zIndex, pointerEvents: minimized ? "none" : "auto" }}
      className={`absolute left-0 top-0 flex flex-col overflow-hidden bg-white text-slate-900 outline-none ${effectiveMaximized ? "rounded-none" : "rounded-2xl"}`}
    >
      <header onPointerDown={(event) => start(event, "drag")} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onDoubleClick={(event) => { if (!(event.target as HTMLElement).closest(".window-control-btn")) setMaximized(!maximized); }} className={`group flex h-12 shrink-0 touch-none select-none items-center gap-2 border-b border-zinc-200/50 px-4 ${focused ? "bg-zinc-100/80 backdrop-blur-xl" : "bg-zinc-50/80 backdrop-blur-xl"} ${effectiveMaximized ? "" : "cursor-grab active:cursor-grabbing"}`}>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" aria-label={`Close ${title}`} onClick={onClose} className="window-control-btn w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 shadow-sm border border-[#e0443e] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600">
            <X className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button type="button" aria-label={`Minimize ${title}`} onClick={onMinimize} className="window-control-btn w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 shadow-sm border border-[#dea123] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600">
            <Minus className="w-2.5 h-2.5 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button type="button" aria-label={`${effectiveMaximized ? "Restore" : "Maximize"} ${title}`} onClick={() => setMaximized(!maximized)} className="window-control-btn w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 shadow-sm border border-[#1aab29] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600">
            {effectiveMaximized ? <Minimize2 className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" /> : <Maximize2 className="w-2 h-2 text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center pr-14 pointer-events-none gap-2">
          <img src={icon} alt="" draggable={false} className="h-5 w-5 rounded-md" />
          <span className="text-sm font-semibold text-zinc-700">{title}</span>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-window-scroll>{children}</div>
      {!effectiveMaximized && <div role="separator" aria-label={`Resize ${title}`} aria-orientation="horizontal" tabIndex={0} onKeyDown={(event) => {
        const direction = { ArrowRight: [24, 0], ArrowLeft: [-24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] }[event.key];
        if (!direction) return;
        event.preventDefault();
        setBounds((value) => ({ ...value, width: Math.max(Math.min(360, viewport.width - 24), Math.min(value.width + direction[0], viewport.width - value.x - 8)), height: Math.max(180, Math.min(value.height + direction[1], viewport.height - value.y - 88)) }));
      }} onPointerDown={(event) => start(event, "resize")} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} className="absolute bottom-0 right-0 grid h-7 w-7 touch-none cursor-se-resize place-items-center rounded-tl-lg bg-slate-200/80 text-slate-500 focus-visible:outline-2" title="Drag to resize, or use arrow keys">◢</div>}
    </motion.div>
  );
}
