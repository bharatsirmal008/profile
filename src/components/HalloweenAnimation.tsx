"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { motion, useAnimationFrame, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";

export type HalloweenAnimationProps = {
  greeting?: string;
  title?: string;
  color?: string;
  /** Playback multiplier. 1 = a six-second loop. */
  speed?: number;
  controls?: boolean;
  className?: string;
};

const DURATION = 6;
const TITLE_FONT = "Impact, Haettenschweiler, 'Arial Narrow', sans-serif";
// Identical M/L/Q/Q/Z commands make the upper eyelid morph smoothly.
export const EYE_OPEN = "M 302 160 L 471 207 Q 425 258 360 222 Q 323 202 302 160 Z";
const LID_OPEN = "M 302 160 L 471 207 Q 424 194 361 177 Q 323 166 302 160 Z";
const LID_CLOSED = EYE_OPEN;

function subscribeMotionPreference(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function TitleLetter({ letter, index, count, clock }: { letter: string; index: number; count: number; clock: MotionValue<number> }) {
  const start = 0.8 + (index / Math.max(1, count - 1)) * 1.7;
  const opacity = useTransform(clock, [0, start, start + 0.06, start + 0.12, start + 0.2, start + 0.3, 6], [0, 0, 0.85, 0.5, 0.9, 1, 1]);
  const y = useTransform(clock, [0, start, start + 0.1, start + 0.3, 6], [8, 8, -3, 0, 0]);
  const width = Math.min(63, 670 / Math.max(count, 1));
  return (
    <motion.text x={480 + (index - (count - 1) / 2) * width} y={377} textAnchor="middle" fontSize={width * 1.45} fontWeight="900" fontFamily={TITLE_FONT} style={{ opacity, y }}>
      {letter}
    </motion.text>
  );
}

function Timeline({ clock, onSeek }: { clock: MotionValue<number>; onSeek: (value: number) => void }) {
  const [position, setPosition] = useState(clock.get());
  useMotionValueEvent(clock, "change", setPosition);
  return (
    <>
      <input aria-label="Animation timeline" aria-valuetext={`${position.toFixed(1)} of 6 seconds`} type="range" min="0" max="6" step="0.01" value={position} onChange={(event) => onSeek(Number(event.target.value))} className="h-1 w-20 flex-1 cursor-pointer accent-red-600 sm:w-32" />
      <span className="w-16 text-right font-mono text-[10px] tabular-nums text-white/50">{position.toFixed(1)} / 6s</span>
    </>
  );
}

/** Code-only SVG wallpaper. Set controls={false} for a clean 16:9 embed. */
export function HalloweenAnimation({ greeting = "Happy", title = "HALLOWEEN", color = "#ed151f", speed = 1, controls = true, className = "" }: HalloweenAnimationProps) {
  const id = useId().replace(/:/g, "");
  const reducedMotion = useSyncExternalStore(subscribeMotionPreference, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const [requestedPlayback, setRequestedPlayback] = useState<boolean | null>(null);
  const playing = requestedPlayback ?? !reducedMotion;
  const started = useRef(false);
  const clock = useMotionValue(2.8);
  const rate = Number.isFinite(speed) && speed > 0 ? Math.min(speed, 4) : 1;
  const letters = Array.from(title);

  useEffect(() => {
    if (reducedMotion && requestedPlayback === null) clock.set(2.8);
  }, [reducedMotion, requestedPlayback, clock]);

  // One Motion clock keeps morphs, text, seeking, replay and pauses in sync.
  // Clamping the delta avoids skipping the sequence after a background tab resumes.
  useAnimationFrame((_, delta) => {
    if (!playing) return;
    if (!started.current) {
      started.current = true;
      clock.set(0);
    } else {
      clock.set((clock.get() + Math.min(delta, 64) / 1000 * rate) % DURATION);
    }
  });

  const eyelid = useTransform(clock, [0, 0.2, 0.46, 0.58, 0.9, 1.75, 1.89, 1.96, 2.12, 6], [LID_OPEN, LID_OPEN, LID_CLOSED, LID_CLOSED, LID_OPEN, LID_OPEN, LID_CLOSED, LID_CLOSED, LID_OPEN, LID_OPEN]);
  const pupilX = useTransform(clock, [0, 1, 1.3, 1.6, 2.12, 2.42, 2.8, 6], [0, 0, -19, -19, 22, 22, 0, 0]);
  const greetingWidth = useTransform(clock, [0, 0.3, 1.1, 6], [0, 0, 640, 640]);
  const glitch = useTransform(clock, [0, 3.35, 3.38, 3.46, 3.49, 4.61, 4.64, 4.73, 4.76, 5.42, 5.45, 5.53, 5.56, 6], [0, 0, 10, -6, 0, 0, -12, 7, 0, 0, 8, -5, 0, 0]);
  const glitchOpacity = useTransform(glitch, (x) => x === 0 ? 0 : 1);
  const replay = () => { started.current = true; clock.set(0); setRequestedPlayback(true); };
  const toggle = () => { if (!started.current && !playing) replay(); else setRequestedPlayback(!playing); };

  return (
    <div className={`relative isolate flex w-full flex-col items-center justify-center bg-black ${className}`}>
      <svg viewBox="0 0 960 540" role="img" aria-label={`${greeting} ${title}: sinister red eyes and distressed lettering`} className="pointer-events-none aspect-video w-full max-w-[1280px] shrink-0 overflow-visible" fill={color}>
        <defs>
          <clipPath id={`${id}-eye`}><path d={EYE_OPEN} /></clipPath>
          <clipPath id={`${id}-greeting`}><motion.rect x="160" y="232" height="80" width={greetingWidth} /></clipPath>
          <clipPath id={`${id}-slices`}><path d="M 100 327 H 860 V 332 H 100 Z M 100 352 H 860 V 359 H 100 Z M 100 372 H 860 V 375 H 100 Z" /></clipPath>
          <mask id={`${id}-distress`} maskUnits="userSpaceOnUse" x="80" y="232" width="800" height="168">
            <rect x="80" y="232" width="800" height="168" fill="white" />
            {/* Deterministic scratches: stable across SSR, replay and instances. */}
            {Array.from({ length: 95 }, (_, i) => {
              const x = 140 + (i * 137 % 680);
              const y = 307 + (i * 31 % 76);
              return <path key={i} d={`M ${x} ${y} l ${3 + i % 14} ${-2 - i % 4} l ${-2 - i % 6} ${4 + i % 3} Z`} fill="black" />;
            })}
            {Array.from({ length: 60 }, (_, i) => {
              const x = 180 + (i * 137 % 600);
              const y = 240 + (i * 31 % 64);
              return <path key={`greeting-${i}`} d={`M ${x} ${y} l ${3 + i % 14} ${-2 - i % 4} l ${-2 - i % 6} ${4 + i % 3} Z`} fill="black" />;
            })}
            <path d="M 180 273 L 780 267 M 230 293 L 730 288" stroke="black" strokeWidth="1.1" />
            <path d="M 154 343 L 799 337 M 191 367 L 734 362" stroke="black" strokeWidth="1.1" />
          </mask>
          <g id={`${id}-title`} mask={`url(#${id}-distress)`}>
            {letters.map((letter, index) => <TitleLetter key={`${index}-${letter}`} letter={letter} index={index} count={letters.length} clock={clock} />)}
          </g>
        </defs>
        <g transform="translate(480 211) scale(1.35) translate(-480 -235)">
          {[false, true].map((mirror) => (
            <g key={String(mirror)} transform={mirror ? "translate(960 0) scale(-1 1)" : undefined}>
              <path d={EYE_OPEN} />
              <g clipPath={`url(#${id}-eye)`}>
                {/* Invert local translation on the mirrored eye for a coordinated gaze. */}
                <g transform={mirror ? "translate(790 0) scale(-1 1)" : undefined}>
                  <motion.path d="M 391 170 Q 382 207 396 238 Q 405 205 399 174 Z" fill="black" style={{ x: pupilX }} />
                </g>
                <path d="M 304 168 Q 389 225 457 212 M 319 183 Q 371 236 442 220 M 310 163 L 456 207" fill="none" stroke="black" strokeWidth="1.2" />
                <motion.path d={eyelid} fill="black" />
              </g>
            </g>
          ))}
        </g>
        <g clipPath={`url(#${id}-greeting)`} mask={`url(#${id}-distress)`}>
          <text x="480" y="302" textAnchor="middle" fontFamily={TITLE_FONT} fontSize="70" fontWeight="900" textLength={Math.min(580, Math.max(100, Array.from(greeting).length * 42))} lengthAdjust="spacingAndGlyphs">{greeting}</text>
        </g>
        <use href={`#${id}-title`} />
        <motion.g clipPath={`url(#${id}-slices)`} style={{ opacity: glitchOpacity }}>
          <rect x="100" y="305" width="760" height="90" fill="black" />
          <motion.g style={{ x: glitch }}><use href={`#${id}-title`} /></motion.g>
        </motion.g>
      </svg>
      {controls && (
        <div role="group" aria-label="Halloween animation playback" className="pointer-events-auto absolute right-4 top-4 z-10 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-xs text-white/70 backdrop-blur-sm sm:right-6 sm:top-6">
          <button type="button" onClick={toggle} aria-label={playing ? "Pause Halloween animation" : "Play Halloween animation"} className="min-h-8 min-w-10 rounded hover:text-white focus-visible:outline-2 focus-visible:outline-red-500">{playing ? "Pause" : "Play"}</button>
          <button type="button" onClick={replay} className="min-h-8 rounded hover:text-white focus-visible:outline-2 focus-visible:outline-red-500">Replay</button>
          <Timeline clock={clock} onSeek={(value) => { started.current = true; setRequestedPlayback(false); clock.set(value); }} />
        </div>
      )}
    </div>
  );
}
