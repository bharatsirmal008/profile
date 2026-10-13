"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";
import { AssistantSpace } from "./AssistantSpace";
import { JoJoWordmark } from "./JoJoWordmark";
import styles from "./VoiceInterface.module.css";

type Props = {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  speechPulse: RefObject<number>;
  onClose: () => void;
};
const subscribeHydration = () => () => {};

export function VoiceInterface({ isListening, isSpeaking, isThinking, speechPulse, onClose }: Props) {
  const reducedMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [micStatus, setMicStatus] = useState<"connecting" | "ready" | "unavailable">("connecting");
  const [expanded, setExpanded] = useState(false);
  const visualRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const stateRef = useRef({ isListening, isSpeaking, isThinking });

  useEffect(() => { stateRef.current = { isListening, isSpeaking, isThinking }; }, [isListening, isSpeaking, isThinking]);
  useEffect(() => {
    if (!mounted) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLButtonElement>("button")?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const buttons = dialog?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    dialog?.addEventListener("keydown", trapFocus);
    return () => { dialog?.removeEventListener("keydown", trapFocus); if (previous?.isConnected) previous.focus(); };
  }, [mounted]);
  useEffect(() => {
    let disposed = false;
    let stream: MediaStream | null = null;
    let context: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    const connect = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
        if (disposed) { stream.getTracks().forEach(track => track.stop()); return; }
        context = new AudioContext();
        await context.resume();
        if (disposed) { void context.close(); return; }
        source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = .8;
        source.connect(analyser);
        analyserRef.current = analyser;
        setMicStatus("ready");
      } catch {
        if (!disposed) setMicStatus("unavailable");
      }
    };
    void connect();
    return () => {
      disposed = true;
      analyserRef.current = null;
      source?.disconnect();
      stream?.getTracks().forEach(track => track.stop());
      if (context && context.state !== "closed") void context.close();
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const bars = visualRef.current?.querySelectorAll<HTMLElement>("[data-audio-bar]");
    const samples = new Uint8Array(128);
    let frame = 0;
    let smoothed = 0;
    let lastDraw = 0;
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (time - lastDraw < (reducedMotion ? 120 : 32)) return;
      lastDraw = time;
      const state = stateRef.current;
      let level = 0;
      if (state.isListening && analyserRef.current) {
        analyserRef.current.getByteFrequencyData(samples);
        level = samples.slice(2, 45).reduce((sum, sample) => sum + sample, 0) / (43 * 255);
      } else if (state.isSpeaking) {
        // SpeechSynthesis has no PCM stream: use actual word-boundary timing.
        level = Math.max(0, 1 - (performance.now() - speechPulse.current) / 260) * .65;
      }
      smoothed += (level - smoothed) * .22;
      visualRef.current?.style.setProperty("--energy", String(smoothed));
      bars?.forEach((bar, i) => {
        const distance = Math.abs(i - 10) / 10;
        const shape = Math.pow(1 - distance, .8);
        const frequency = state.isListening && analyserRef.current ? samples[3 + Math.abs(i - 10) * 3] / 255 : level;
        const height = 5 + shape * 20 + (smoothed * 65 + frequency * 32) * shape;
        bar.style.transform = `scaleY(${height / 110})`;
      });
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [mounted, reducedMotion, speechPulse]);

  const status = micStatus === "unavailable" ? "Microphone Unavailable" : isSpeaking ? "Speaking…" : isThinking ? "Thinking…" : isListening ? "Listening…" : micStatus === "connecting" ? "Connecting…" : "Ready to Talk";
  const phase = isSpeaking ? "speaking" : isThinking ? "thinking" : isListening ? "listening" : "idle";
  if (!mounted) return null;
  return createPortal(
    <motion.div ref={dialogRef} className={styles.overlay} role="dialog" aria-modal="true" aria-label="JoJo voice conversation" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }} onKeyDown={event => { if (event.key === "Escape") onClose(); }}>
      <motion.div className={`${styles.window} ${expanded ? styles.expanded : ""}`} initial={reducedMotion ? false : { scale: .97 }} animate={{ scale: 1 }} exit={{ scale: .97 }}>
        <div className={styles.titlebar}>
          <div className={styles.controls}>
            <button aria-label="Close voice conversation" onClick={onClose}><X size={12} /></button>
            <button aria-label="Return to chat" onClick={onClose}><Minus size={12} /></button>
            <button aria-label={expanded ? "Restore voice window" : "Maximize voice window"} onClick={() => setExpanded(!expanded)}><Maximize2 size={11} /></button>
          </div>
          <JoJoWordmark />
        </div>
        <div className={styles.scene} ref={visualRef} data-phase={phase}>
          <AssistantSpace />
          <div className={styles.sideClouds} aria-hidden="true" />
          <div className={styles.beams} aria-hidden="true"><i /><i /><i /></div>
          <div className={styles.status} role="status" aria-live="polite">
            <AnimatePresence mode="wait"><motion.span key={status} initial={reducedMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}>{status}</motion.span></AnimatePresence>
          </div>
          <div className={styles.dots} aria-hidden="true"><i /><i /><i /></div>
          <motion.div className={styles.stage} initial={reducedMotion ? false : { opacity: 0, y: 20, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .9, delay: .2 }}>
            <div className={styles.float}>
              <div className={`${styles.ring} ${styles.outer}`} /><div className={`${styles.ring} ${styles.middle}`} /><div className={`${styles.ring} ${styles.inner}`} />
              <div className={styles.ripple} />
              <div className={styles.orb}>
                <div className={styles.orbShine} />
                <div className={styles.waveform} aria-hidden="true">{Array.from({ length: 21 }, (_, i) => <i key={i} data-audio-bar style={{ "--index": i } as CSSProperties} />)}</div>
                <div className={styles.thinkingArcs} aria-hidden="true"><i /><i /><i /></div>
              </div>
            </div>
          </motion.div>
          <div className={styles.platform} aria-hidden="true"><i /><i /><i /><i /></div>
          <motion.button type="button" className={styles.endButton} onClick={onClose} aria-label="End voice conversation" whileHover={reducedMotion ? undefined : { scale: 1.08 }} whileTap={reducedMotion ? undefined : { scale: .94 }}><X size={27} strokeWidth={1.5} /></motion.button>
          {micStatus === "unavailable" && <p className={styles.error}>Allow microphone access in your browser, then reopen voice mode.</p>}
        </div>
      </motion.div>
    </motion.div>, document.body
  );
}
