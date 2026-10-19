export type VoiceLanguage = "en" | "hi" | "ne" | "auto";
export type SpokenLanguage = Exclude<VoiceLanguage, "auto">;
export type VoicePhase = "idle" | "connecting" | "listening" | "user-speaking" | "thinking" | "speaking" | "muted" | "reconnecting" | "error" | "ended";
export type LanguageCapability = { code: VoiceLanguage; label: string; locale: string | null; available: boolean; model: string | null; voices: { id: string; label: string }[] };
export type VoiceConfig = { enabled: boolean; test_mode?: boolean; reason: string | null; allow_anonymous: boolean; max_seconds: number; languages: LanguageCapability[] };
export type VoiceSettings = { language: VoiceLanguage; volume: number; outputEnabled: boolean; subtitles: boolean; voiceId: string };
export const DEFAULT_VOICE_SETTINGS: VoiceSettings = { language: "en", volume: .8, outputEnabled: true, subtitles: true, voiceId: "" };
export const VOICE_SETTINGS_KEY = "bharat_ai_realtime_voice";
// Display-only fallback while the canonical server capabilities cannot be reached.
// No fallback entry grants voice access or asserts language support.
export const OFFLINE_VOICE_CONFIG: VoiceConfig = {
  enabled: false, reason: "Real-time voice is awaiting server configuration.", allow_anonymous: false, max_seconds: 600,
  languages: [
    { code: "en", label: "English", locale: "en-US", available: false, model: null, voices: [] },
    { code: "hi", label: "हिन्दी", locale: "hi-IN", available: false, model: null, voices: [] },
    { code: "ne", label: "नेपाली", locale: "ne-NP", available: false, model: null, voices: [] },
    { code: "auto", label: "Auto", locale: null, available: false, model: null, voices: [] },
  ],
};

export function parseVoiceSettings(raw: string | null): VoiceSettings {
  try {
    const value = JSON.parse(raw || "null");
    if (!value || typeof value !== "object") return { ...DEFAULT_VOICE_SETTINGS };
    return {
      language: ["en", "hi", "ne", "auto"].includes(value.language) ? value.language : "en",
      volume: typeof value.volume === "number" && Number.isFinite(value.volume) ? Math.max(0, Math.min(1, value.volume)) : .8,
      outputEnabled: typeof value.outputEnabled === "boolean" ? value.outputEnabled : true,
      subtitles: typeof value.subtitles === "boolean" ? value.subtitles : true,
      voiceId: typeof value.voiceId === "string" ? value.voiceId.slice(0, 100) : "",
    };
  } catch { return { ...DEFAULT_VOICE_SETTINGS }; }
}

export type VoiceSignal = { type: "connect" | "user" | "thinking" | "speak" | "listen" | "interrupt" | "mute" | "unmute" | "reconnect" | "fail" | "end" | "start" };
export function voicePhase(previous: VoicePhase, signal: VoiceSignal): VoicePhase {
  if (signal.type === "start") return "connecting";
  if (signal.type === "end") return "ended";
  if (signal.type === "fail") return "error";
  if (["ended", "error", "idle"].includes(previous)) return previous;
  if (signal.type === "mute") return "muted";
  if (previous === "muted" && !["unmute", "speak"].includes(signal.type)) return previous;
  return ({ connect: "listening", user: "user-speaking", thinking: "thinking", speak: "speaking", listen: "listening", interrupt: "listening", unmute: "listening", reconnect: "reconnecting" } as Partial<Record<VoiceSignal["type"], VoicePhase>>)[signal.type] || previous;
}

/** Suppress duplicate SDK events while permitting agent response corrections. */
export function transcriptId(session: string, role: string, eventId: number, responseId?: string): string {
  return `voice:${session}:${role}:${responseId || eventId}`;
}
