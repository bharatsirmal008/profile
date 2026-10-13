"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";

export function AssistantWindowControls() {
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    update();
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  async function toggleFullscreen() {
    setNotice("");
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { setNotice("Fullscreen is unavailable in this browser."); }
  }
  const circle = "grid h-3.5 w-3.5 place-items-center rounded-full border shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200";
  const icon = "h-2.5 w-2.5 text-black/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100";
  return <div className="group flex shrink-0 items-center gap-2" aria-label="Window controls">
    <Link href="/" aria-label="Close assistant and return to desktop" title="Close" className={`${circle} border-[#e0443e] bg-[#ff5f56] hover:bg-[#ff5f56]/80`}><X className={icon}/></Link>
    <Link href="/" aria-label="Minimize assistant to desktop" title="Minimize" className={`${circle} border-[#dea123] bg-[#ffbd2e] hover:bg-[#ffbd2e]/80`}><Minus className={icon}/></Link>
    <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"} title={fullscreen ? "Restore" : "Maximize"} className={`${circle} border-[#1aab29] bg-[#27c93f] hover:bg-[#27c93f]/80`}>{fullscreen ? <Minimize2 className={icon}/> : <Maximize2 className={icon}/>}</button>
    {notice && <p role="status" className="absolute left-4 top-full z-50 mt-2 rounded-lg bg-[#10271d] px-3 py-2 text-xs text-emerald-100">{notice}</p>}
  </div>;
}
