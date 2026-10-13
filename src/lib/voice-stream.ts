export type AssistantLanguage = "en" | "hi" | "ne";
export const languageLocale = (language: AssistantLanguage) => ({ en: "en-IN", hi: "hi-IN", ne: "ne-NP" })[language];

export function detectLanguage(text: string, preferred: AssistantLanguage = "en"): AssistantLanguage {
  const q = text.toLowerCase();
  if (/speak|talk|reply|respond|answer|switch|भाषा|बोल|बात|जवाफ|जवाब|बताओ|b[oau]l|baat/.test(q)
      && !/don't|do not|नहीं.*बोल|नबोल/.test(q)) {
    if (/nepali|नेपाली/.test(q)) return "ne";
    if (/hindi|हिन्दी|हिंदी/.test(q)) return "hi";
    if (/english|अंग्रेजी|अंग्रेज़ी|अङ्ग्रेजी/.test(q)) return "en";
  }
  if (/[\u0900-\u097f]/.test(q)) {
    if (/(?:^|[^\u0900-\u097f])(?:छ|छन्|छौ|हुन्छ|गर्छ|गर्न|कस्तो|तपाईं|तिमी|मेरो|उसको|बताउनु)(?=$|[^\u0900-\u097f])/.test(q)) return "ne";
    if (/क्या|कैसे|है|हैं|बताओ|करेंगे/.test(q)) return "hi";
    return preferred === "ne" ? "ne" : "hi";
  }
  if (/\b(kya|kaise|batao|bataiye|hai|hain|hoga|kamzori)\b/.test(q)) return "hi";
  if (/\b(chha|cha|kasari|kasto|mero|tapai|garcha)\b/.test(q)) return "ne";
  return preferred;
}

// Small, testable browser helpers for incremental text and speech.
export class SentenceBuffer {
  private text = "";

  push(token: string, final = false): string[] {
    this.text += token;
    const ready: string[] = [];
    while (this.text) {
      let end = -1;
      const boundaries = /[।॥]|[.!?](?=\s)|\n\n/g;
      for (const match of this.text.matchAll(boundaries)) {
        const candidate = this.text.slice(0, match.index + match[0].length);
        if (/\b(?:Mr|Mrs|Ms|Dr|Prof|e\.g|i\.e)\.$/i.test(candidate)) continue;
        end = candidate.length;
        break;
      }
      // Long sentences should not hold up speech indefinitely.
      if (end < 0 && this.text.length > 220) end = this.text.lastIndexOf(" ", 220);
      if (end < 0 && final) end = this.text.length;
      if (end <= 0) break;
      const sentence = this.text.slice(0, end).trim();
      this.text = this.text.slice(end).trimStart();
      if (sentence) ready.push(sentence);
    }
    return ready;
  }
}

type SpeechOptions = {
  language?: AssistantLanguage;
  synth: Pick<SpeechSynthesis, "speak" | "cancel" | "getVoices">;
  createUtterance: (text: string) => SpeechSynthesisUtterance;
  onSpeaking: (speaking: boolean) => void;
  onDone: () => void;
  onPulse: () => void;
  onFirstAudio?: () => void;
  onError?: (error: string) => void;
};

export class StreamingSpeech {
  private sentences = new SentenceBuffer();
  private queue: string[] = [];
  private finished = false;
  private cancelled = false;
  private active: SpeechSynthesisUtterance | null = null;
  private firstAudio = false;
  private completed = false;
  private options: SpeechOptions;

  constructor(options: SpeechOptions) { this.options = options; }

  append(text: string) {
    if (this.cancelled || this.finished) return;
    this.queue.push(...this.sentences.push(text));
    this.pump();
  }

  setLanguage(language: AssistantLanguage) { this.options.language = language; }

  finish() {
    if (this.cancelled || this.finished) return;
    this.finished = true;
    this.queue.push(...this.sentences.push("", true));
    this.pump();
  }

  cancel() {
    this.cancelled = true;
    this.queue = [];
    this.active = null;
    this.options.synth.cancel();
    this.options.onSpeaking(false);
  }

  private pump() {
    if (this.cancelled || this.active) return;
    const next = this.queue.shift();
    if (next === undefined) {
      this.options.onSpeaking(false);
      if (this.finished && !this.completed) {
        this.completed = true;
        this.options.onDone();
      }
      return;
    }
    const clean = next.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*#_`]/g, "").replace(/\s+/g, " ").trim();
    if (!clean) { this.pump(); return; }
    const utterance = this.options.createUtterance(clean);
    const language = this.options.language || "en";
    const available = this.options.synth.getVoices();
    const voices = available.filter(v => v.lang.toLowerCase().split(/[-_]/)[0] === language);
    if (available.length && !voices.length && language !== "en") {
      this.options.onError?.("language-unavailable");
      this.cancel();
      return;
    }
    const male = (v: SpeechSynthesisVoice) => !/female/i.test(v.name) && /male|ravi|prabhat|rishi|david|mark|guy|daniel/i.test(v.name);
    const locale = languageLocale(language);
    const voice = voices.find(v => v.lang.toLowerCase() === locale.toLowerCase() && male(v))
      || voices.find(v => v.lang.toLowerCase() === locale.toLowerCase()) || voices.find(male) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || locale;
    utterance.rate = 1.15;
    utterance.pitch = 1.25;
    this.active = utterance;
    utterance.onstart = () => {
      if (this.cancelled) return;
      this.options.onSpeaking(true);
      this.options.onPulse();
      if (!this.firstAudio) { this.firstAudio = true; this.options.onFirstAudio?.(); }
    };
    utterance.onboundary = () => { if (!this.cancelled) this.options.onPulse(); };
    utterance.onend = () => {
      if (this.cancelled) return;
      this.active = null;
      this.pump();
    };
    utterance.onerror = (event) => {
      if (this.cancelled) return;
      this.options.onError?.(event.error);
      this.cancel();
    };
    try { this.options.synth.speak(utterance); }
    catch { this.options.onError?.("speech-unavailable"); this.cancel(); }
  }
}

export async function readAnswerStream(
  body: ReadableStream<Uint8Array>,
  onToken: (token: string) => void,
  onMetrics: (metrics: Record<string, unknown>) => void,
  onLanguage?: (language: AssistantLanguage) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let complete = false;
  const consume = (line: string) => {
    if (!line.trim()) return;
    const event = JSON.parse(line);
    if (event.type === "error") throw new Error(event.error || "Answer generation failed.");
    if (event.type === "done") { complete = true; return; }
    if (event.type === "language" && ["en", "hi", "ne"].includes(event.language)) { onLanguage?.(event.language); return; }
    if (event.type === "metrics") { onMetrics(event); return; }
    if (event.type === "token" && typeof event.token === "string") onToken(event.token);
  };
  try {
    while (!complete) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) { consume(line); if (complete) break; }
      if (done) { if (buffer.trim()) consume(buffer); break; }
    }
    if (!complete) throw new Error("The response was interrupted. Please try again.");
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
