"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation, useRawConversation } from "@elevenlabs/react";
import { motion } from "framer-motion";
import { Mic, MicOff, Settings2, Volume2, VolumeX } from "lucide-react";
import { VoiceInterface } from "./VoiceInterface";
import { hideDocumentSources } from "../../lib/chat-format";
import { cloudEnabled, getSupabase } from "../../lib/supabase";
import { VoiceAttempt, voiceAccessToken, voiceRequest, type VoiceCredentials, type VoiceHistoryMessage } from "../../lib/voice-session";
import { DEFAULT_VOICE_SETTINGS, OFFLINE_VOICE_CONFIG, VOICE_SETTINGS_KEY, parseVoiceSettings, transcriptId, voicePhase, type VoiceConfig, type VoiceLanguage, type VoicePhase, type VoiceSettings } from "../../lib/voice-settings";
import styles from "./VoiceInterface.module.css";

type Props = {
  apiBase: string; chatRef: string; history: VoiceHistoryMessage[]; contextRevision?: string;
  onClose: () => void; onBrowserVoice: () => void;
  onMessage: (message: { id: string; role: "user" | "ai"; content: string }) => void;
};

const labels: Record<VoicePhase, string> = { idle: "Ready to talk", connecting: "Connecting…", listening: "Listening…", "user-speaking": "You are speaking…", thinking: "Thinking…", speaking: "JOJO is speaking…", muted: "Microphone muted", reconnecting: "Reconnecting…", error: "Connection needs attention", ended: "Conversation ended" };

export default function ElevenLabsVoice(props: Props) {
  return <ConversationProvider><VoiceSession {...props} /></ConversationProvider>;
}

function VoiceSession(props: Props) {
  const [config, setConfig] = useState<VoiceConfig | null>(null);
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState<VoicePhase>("idle");
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("English");
  const [subtitle, setSubtitle] = useState("");
  const [permission, setPermission] = useState("Not requested");
  const [latency, setLatency] = useState<number | null>(null);
  const credentials = useRef<VoiceCredentials | null>(null);
  const auth = useRef("");
  const attempt = useRef(new VoiceAttempt());
  const alive = useRef(true);
  const accepting = useRef(false);
  const working = useRef(false);
  const connected = useRef(false);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const utteranceEnded = useRef<number | null>(null);
  const speechPulse = useRef(0);
  const propsRef = useRef(props);
  const phaseRef = useRef<VoicePhase>("idle");
  const activeCode = useRef("en");
  const seen = useRef(new Map<string, string>());
  const interrupted = useRef(new Set<string>());
  const lastAssistantId = useRef<string | null>(null);
  const settingsRef = useRef(settings);
  useEffect(() => { propsRef.current = props; }, [props]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  const signal = useCallback((type: Parameters<typeof voicePhase>[1]["type"]) => {
    if (!alive.current) return;
    phaseRef.current = voicePhase(phaseRef.current, { type });
    setPhase(phaseRef.current);
  }, []);

  const postEvent = useCallback(async (event: Record<string, unknown>) => {
    const current = credentials.current;
    if (!current || !auth.current) return;
    try {
      const result = await voiceRequest<{ language: string }>(propsRef.current.apiBase, "events", auth.current, { ...event, session_id: current.session_id });
      if (credentials.current !== current || !alive.current) return;
      activeCode.current = result.language;
      setActiveLanguage(config?.languages.find(language => language.code === result.language)?.label || result.language);
    } catch {
      if (alive.current) setError("Voice transcript sync failed. This chat still keeps the visible messages locally.");
    }
  }, [config]);

  const conversation = useConversation({
    micMuted: muted,
    onConnect: ({ conversationId }) => {
      if (!accepting.current || !alive.current) { void sdk.current.endSession(); return; }
      setPermission("Allowed");
      connected.current = true;
      sdk.current.setVolume({ volume: settingsRef.current.outputEnabled ? settingsRef.current.volume : 0 });
      signal("connect");
      void postEvent({ kind: "connected", conversation_id: conversationId, event_id: "connected" });
    },
    onDisconnect: details => {
      if (!accepting.current || !alive.current) return;
      accepting.current = false;
      connected.current = false;
      signal(details.reason === "error" ? "fail" : "end");
      if (details.reason === "error") setError("Voice disconnected. Check your connection and microphone, then reconnect.");
      void releaseBackend();
    },
    onError: (_message, context) => {
      if (!accepting.current || !alive.current) return;
      const denied = context instanceof Error && context.name === "NotAllowedError";
      setPermission(denied ? "Denied" : "Check browser permissions");
      setError(denied ? "Microphone access was denied. Allow it in browser settings, then retry." : "Voice connection failed. Check microphone access and server configuration, then retry.");
      signal("fail");
      void stop();
    },
    onMessage: message => {
      if (!accepting.current || !credentials.current || !alive.current) return;
      const role = message.source === "user" ? "user" : "ai";
      const id = transcriptId(credentials.current.session_id, role, message.event_id, message.response_id);
      if (role === "ai" && interrupted.current.has(id)) return;
      const text = hideDocumentSources(message.message).trim();
      if (!text || seen.current.get(id) === text) return;
      seen.current.set(id, text);
      if (role === "ai") lastAssistantId.current = id;
      propsRef.current.onMessage({ id, role, content: text });
      setSubtitle(text);
      if (role === "user") { utteranceEnded.current = performance.now(); signal("thinking"); }
      void postEvent({ kind: "message", role: role === "ai" ? "assistant" : "user", text, event_id: id });
    },
    onModeChange: ({ mode }) => {
      if (!accepting.current) return;
      signal(mode === "speaking" ? "speak" : "listen");
      if (mode === "speaking" && utteranceEnded.current !== null) {
        // SDK speaking event is an approximation of audible first audio; not a guaranteed latency.
        const value = Math.round(performance.now() - utteranceEnded.current);
        setLatency(value);
        utteranceEnded.current = null;
        void postEvent({ kind: "latency", event_id: crypto.randomUUID(), latency_ms: value });
      }
    },
    onVadScore: ({ vadScore }) => {
      if (!accepting.current || muted) return;
      if (vadScore > .6 && phaseRef.current !== "speaking") signal("user");
      else if (vadScore < .2 && phaseRef.current === "user-speaking") {
        utteranceEnded.current = performance.now(); signal("thinking");
      }
    },
    // SDK handles audio truncation/barge-in; do not play or queue our own TTS.
    onInterruption: () => {
      if (accepting.current) {
        if (lastAssistantId.current) interrupted.current.add(lastAssistantId.current);
        utteranceEnded.current = null;
        signal("interrupt");
      }
    },
    onAgentResponseCorrection: correction => {
      if (!accepting.current || !credentials.current) return;
      const id = transcriptId(credentials.current.session_id, "ai", correction.event_id, correction.response_id);
      const content = hideDocumentSources(correction.corrected_agent_response);
      propsRef.current.onMessage({ id, role: "ai", content });
      setSubtitle(content);
      void postEvent({ kind: "message", role: "assistant", text: content, event_id: id });
    },
  });
  const sdk = useRef(conversation);
  const rawConversation = useRawConversation();
  const raw = useRef(rawConversation);
  useEffect(() => { raw.current = rawConversation; }, [rawConversation]);
  useEffect(() => { sdk.current = conversation; }, [conversation]);

  async function releaseBackend() {
    const current = credentials.current;
    credentials.current = null;
    if (current && auth.current) {
      await voiceRequest(propsRef.current.apiBase, "end", auth.current, { session_id: current.session_id }).catch(() => {});
    }
  }
  function stop() {
    attempt.current.cancel();
    accepting.current = false;
    connected.current = false;
    const task = async () => {
      try { if (raw.current) await raw.current.endSession(); sdk.current.endSession(); } finally { await releaseBackend(); }
    };
    queue.current = queue.current.then(task, task);
    return queue.current;
  }

  async function start(language = settingsRef.current.language, voiceId = settingsRef.current.voiceId, reconnect = false) {
    if (!config?.enabled || working.current) return;
    working.current = true;
    const ticket = attempt.current.begin();
    setError("");
    signal("start");
    if (reconnect) signal("reconnect");
    const task = async () => {
      try {
        accepting.current = false;
        connected.current = false;
        if (raw.current) await raw.current.endSession();
        sdk.current.endSession();
        await releaseBackend();
        if (!ticket.current() || !alive.current) return;
        auth.current = await voiceAccessToken(config);
        if (!ticket.current() || !alive.current) return;
        // Do not abort token issuance: if stopped during fetch, obtain and revoke the reservation.
        const result = await voiceRequest<VoiceCredentials>(propsRef.current.apiBase, "session", auth.current, {
          chat_ref: propsRef.current.chatRef, language, voice_id: voiceId || undefined,
          history: propsRef.current.history.slice(-12).map(message => ({ ...message, content: message.content.slice(-6000) })),
          context_revision: propsRef.current.contextRevision,
        });
        credentials.current = result;
        if (!ticket.current() || !alive.current) { await releaseBackend(); return; }
        activeCode.current = result.active_language;
        setActiveLanguage(config.languages.find(item => item.code === result.active_language)?.label || result.active_language);
        accepting.current = true;
        await sdk.current.startSession({
          conversationToken: result.conversation_token, connectionType: "webrtc",
          customLlmExtraBody: { voice_session_id: result.session_id },
          ...(result.voice_id ? { overrides: { tts: { voiceId: result.voice_id } } } : {}),
        });
        if (!ticket.current() || !alive.current || !accepting.current) { await sdk.current.endSession(); await releaseBackend(); return; }
      } catch (failure) {
        accepting.current = false;
        sdk.current.endSession();
        await releaseBackend();
        if (!ticket.current() || !alive.current) return;
        const denied = failure instanceof DOMException && ["NotAllowedError", "PermissionDeniedError"].includes(failure.name);
        const unavailable = failure instanceof DOMException && ["NotFoundError", "NotReadableError"].includes(failure.name);
        setPermission(denied ? "Denied" : unavailable ? "Unavailable" : "Check browser permissions");
        setError(denied ? "Microphone access was denied. Allow it in browser settings, then retry." : unavailable ? "No usable microphone was found. Connect one and retry." : failure instanceof Error ? failure.message : "Could not start voice. Please retry.");
        signal("fail");
      } finally { working.current = false; }
    };
    queue.current = queue.current.then(task, task);
    await queue.current;
  }

  useEffect(() => {
    alive.current = true;
    try { setSettings(parseVoiceSettings(localStorage.getItem(VOICE_SETTINGS_KEY))); } catch {}
    setLoaded(true);
    const controller = new AbortController();
    void voiceRequest<VoiceConfig>(props.apiBase, "config", undefined, undefined, controller.signal).then(value => {
      if (alive.current) setConfig(value);
    }).catch(() => {
      if (!controller.signal.aborted && alive.current) {
        setConfig(OFFLINE_VOICE_CONFIG);
        setError("Real-time voice setup is not available on this server yet. You can still use browser voice.");
      }
    });
    const unsubscribe = cloudEnabled ? getSupabase().auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") { void stop(); signal("end"); }
      else if (session && auth.current) auth.current = session.access_token;
    }).data.subscription : null;
    const exit = () => { void stop(); };
    window.addEventListener("pagehide", exit);
    return () => {
      alive.current = false;
      controller.abort(); unsubscribe?.unsubscribe();
      window.removeEventListener("pagehide", exit);
      void stop();
    };
    // The transport belongs to this mounted chat only; chat changes remount it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.apiBase]);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(settings)); } catch {}
    if (connected.current) sdk.current.setVolume({ volume: settings.outputEnabled ? settings.volume : 0 });
  }, [settings, loaded]);
  useEffect(() => {
    if (credentials.current) {
      void stop(); signal("end"); setError("The attached requirements changed. Reconnect to use the current document.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contextRevision]);
  useEffect(() => {
    if (!credentials.current) return;
    const timer = setTimeout(() => {
      void stop(); signal("end"); setError("Voice session limit reached. Reconnect to continue.");
    }, Math.max(0, credentials.current.expires_at * 1000 - Date.now()));
    return () => clearTimeout(timer);
    // Real expiry timer, never a simulated conversation state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === "connecting", phase === "listening"]);

  const levels = useCallback(() => ({ input: sdk.current.getInputVolume() || 0, output: sdk.current.getOutputVolume() || 0 }), []);
  const updateSettings = (change: Partial<VoiceSettings>) => setSettings(previous => ({ ...previous, ...change }));
  const changeLanguage = async (language: VoiceLanguage) => {
    if (language === settings.language || working.current) return;
    const wasActive = accepting.current;
    updateSettings({ language, voiceId: "" });
    settingsRef.current = { ...settingsRef.current, language, voiceId: "" };
    if (wasActive) await start(language, "", true);
  };
  const chooseVoice = async (voiceId: string) => {
    const wasActive = accepting.current;
    updateSettings({ voiceId });
    if (wasActive) await start(settings.language, voiceId, true);
  };
  const active = ["listening", "user-speaking", "thinking", "speaking", "muted"].includes(phase);
  const toolbar = <div className={styles.voiceToolbar}>
    <div role="group" aria-label="Voice language" className={styles.languageOptions}>
      {(config?.languages || OFFLINE_VOICE_CONFIG.languages).map(language => <button type="button" key={language.code} aria-pressed={settings.language === language.code} disabled={!config?.enabled || !language.available || phase === "connecting" || phase === "reconnecting"} onClick={() => void changeLanguage(language.code)} title={language.available ? language.label : "Awaiting configuration and live language verification"}>
        {settings.language === language.code && <motion.i layoutId="voice-language" className={styles.languageHighlight} />}
        <span>{language.label}</span>
      </button>)}
    </div>
    <button type="button" disabled={!active} aria-label={muted ? "Unmute microphone" : "Mute microphone"} aria-pressed={muted} onClick={() => { setMuted(!muted); signal(muted ? "unmute" : "mute"); }}>{muted ? <MicOff size={17} /> : <Mic size={17} />}</button>
    <button type="button" aria-label={settings.outputEnabled ? "Disable voice responses" : "Enable voice responses"} aria-pressed={!settings.outputEnabled} onClick={() => updateSettings({ outputEnabled: !settings.outputEnabled })}>{settings.outputEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
    <details className={styles.voiceSettings}><summary aria-label="Voice settings"><Settings2 size={17} /></summary><div>
      <label>Output volume <input aria-label="Output volume" type="range" min="0" max="1" step=".05" value={settings.volume} onChange={event => updateSettings({ volume: Number(event.target.value) })} /></label>
      <label><input type="checkbox" checked={settings.subtitles} onChange={event => updateSettings({ subtitles: event.target.checked })} /> Subtitles</label>
      {(config?.languages.find(language => language.code === settings.language)?.voices.length || 0) > 0 && <label>Voice <select value={settings.voiceId} disabled={phase === "connecting" || phase === "reconnecting"} onChange={event => void chooseVoice(event.target.value)}><option value="">Agent default</option>{config?.languages.find(language => language.code === settings.language)?.voices.map(voice => <option key={voice.id} value={voice.id}>{voice.label}</option>)}</select></label>}
      <small>Microphone: {permission}</small>
      {latency !== null && <small>Last turn to SDK speaking event: {latency} ms</small>}
    </div></details>
  </div>;
  const content = <div className={styles.voiceTranscript}>
    {config?.test_mode && <p>Private voice test · Language quality has not been verified.</p>}
    {settings.subtitles && subtitle && <p aria-live="polite">{subtitle}</p>}
    {error && <p role="alert">{error}</p>}
    {!config?.enabled && <p>{config?.reason || (!error ? "Checking voice availability…" : "")}</p>}
    {!active && !["connecting", "reconnecting"].includes(phase) && <>
      {config?.enabled && <><p>Voice audio is sent to ElevenLabs. Text is processed by Bharat AI and saved with this chat. Raw audio is not saved by this app.</p><button type="button" disabled={!config.languages.find(language => language.code === settings.language)?.available} onClick={() => void start()}>{phase === "idle" ? "Start voice" : "Reconnect"}</button></>}
      <button type="button" onClick={() => { void stop().finally(props.onBrowserVoice); }}>Use browser voice</button>
    </>}
  </div>;
  return <VoiceInterface isListening={!muted && (phase === "listening" || phase === "user-speaking")} isSpeaking={phase === "speaking"} isThinking={phase === "thinking"} speechPulse={speechPulse} onClose={() => { void stop(); props.onClose(); }} audioLevels={levels} statusOverride={`${!config?.enabled ? "Voice setup pending" : muted && active && phase !== "speaking" ? labels.muted : labels[phase]} · ${activeLanguage}`} toolbar={toolbar} subtitles={content} />;
}
