"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeAnswer, hideDocumentSources, conversationPrefix, requestHistory } from "../lib/chat-format";
import { StreamingSpeech, readAnswerStream, detectLanguage, languageLocale, type AssistantLanguage } from "../lib/voice-stream";

import {
  Send,
  Square,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Mic,
  Volume2,
  VolumeX,
  PhoneOff,
  X,
  Menu,
  Plus,
  MessageSquare,
  Edit2,
  Trash2,
} from "lucide-react";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AssistantSpace } from "./AssistantSpace";
import styles from "./Assistant.module.css";

import { RecruiterPanel, type RecruiterStatus } from "./RecruiterPanel";
import { JoJoWordmark } from "./JoJoWordmark";
import { AttachmentCard } from "./AttachmentCard";
import { readAttachment, type ChatAttachment } from "../lib/attachment-store";

import { VoiceInterface } from "./VoiceInterface";



/* ============================================================
   API CONFIGURATION
============================================================ */

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://personal-ai-assistan-production.up.railway.app"
).replace(/\/$/, "");

const ASK_ENDPOINT = `${API_BASE_URL}/ask`;

/* ============================================================
   TYPES
============================================================ */

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

/* ============================================================
   SPEECH RECOGNITION TYPE
============================================================ */

type RecognitionResultEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; [index: number]: { transcript: string } }>;
};
type RecognitionErrorEvent = { error: string };

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onresult: ((event: RecognitionResultEvent) => void) | null;
};

const defaultMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Hey! 👋\nI'm JoJo — Bharat's personal AI assistant.\nHow can I help you today?",
    timestamp: "",
  },
];

export function Assistant({ onVoiceModeChange }: { onVoiceModeChange?: (active: boolean) => void } = {}) {
  const reducedMotion = useReducedMotion();
  const speechPulse = useRef(0);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const composer = composerRef.current;
    if (!composer) return;
    const observer = new ResizeObserver(() => {
      if (chatRef.current) chatRef.current.style.paddingBottom = `${composer.offsetHeight + 24}px`;
    });
    observer.observe(composer);
    return () => observer.disconnect();
  }, []);
  const followMessagesRef = useRef(true);
  /* ==========================================================
     MESSAGES
  ========================================================== */



  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("assistantConversations");
    let loadedConversations: Conversation[] = [];
    if (saved) {
      try {
        loadedConversations = JSON.parse(saved);
        setConversations(loadedConversations);
      } catch (e) {
        console.error("Failed to parse conversations from local storage", e);
      }
    }

    const newId = Date.now().toString();
    setActiveConversationId(newId);
    setMessages(defaultMessages.map(message => ({ ...message, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })));

    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!dataLoaded || !activeConversationId) return;

    setConversations((prev) => {
      const exists = prev.find((c) => c.id === activeConversationId);
      if (messages.length <= 1) {
        return prev;
      }

      const firstUserMsg =
        messages.find((m) => m.role === "user")?.content || "New Chat";
      const title =
        firstUserMsg.length > 25
          ? firstUserMsg.slice(0, 25) + "..."
          : firstUserMsg;

      if (exists) {
        return prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, messages, updatedAt: Date.now() }
            : c,
        );
      } else {
        return [
          { id: activeConversationId, title, messages, updatedAt: Date.now() },
          ...prev,
        ];
      }
    });
  }, [messages, activeConversationId, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    const save = () => {
      try { localStorage.setItem("assistantConversations", JSON.stringify(conversations)); }
      catch (error) { console.warn("Unable to save chat history:", error); }
    };
    const timer = setTimeout(save, 300);
    window.addEventListener("pagehide", save);
    return () => { clearTimeout(timer); window.removeEventListener("pagehide", save); };
  }, [conversations, dataLoaded]);

  const startNewChat = () => {
    cancelCurrentResponse();
    followMessagesRef.current = true;
    setActiveConversationId(Date.now().toString());
    setMessages(defaultMessages.map(message => ({ ...message, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })));
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const loadConversation = (id: string) => {
    cancelCurrentResponse();
    followMessagesRef.current = true;
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveConversationId(id);
      setMessages(conv.messages);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    }
  };

  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState("");

  const deleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (activeConversationId === id) cancelCurrentResponse();
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (activeConversationId === id) {
        if (filtered.length > 0) {
          setActiveConversationId(filtered[0].id);
          setMessages(filtered[0].messages);
        } else {
          setActiveConversationId(Date.now().toString());
          setMessages(defaultMessages);
        }
      }
      return filtered;
    });
  };

  const submitRename = (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.stopPropagation();
    if (e.type === "submit") e.preventDefault();
    if (!renameInput.trim()) {
      setRenamingChatId(null);
      return;
    }
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: renameInput.trim() } : c)),
    );
    setRenamingChatId(null);
  };

  /* ==========================================================
     INPUT
  ========================================================== */

  const [inputValue, setInputValue] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  /* ==========================================================
     NORMAL MICROPHONE
  ========================================================== */

  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  /* ==========================================================
     SPEAKING
  ========================================================== */

  const [isSpeaking, setIsSpeaking] = useState(false);

  /* ==========================================================
     SELECTED VOICE
  ========================================================== */

  const languageRef = useRef<AssistantLanguage>("en");
  const [voiceNotice, setVoiceNotice] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("bharat_ai_language");
    if (saved === "en" || saved === "hi" || saved === "ne") {
      languageRef.current = saved;
    }
  }, []);
  const rememberLanguage = (value: AssistantLanguage) => {
    languageRef.current = value;
    try { localStorage.setItem("bharat_ai_language", value); } catch {}
  };
  const speechRef = useRef<StreamingSpeech | null>(null);
  const requestAbortRef = useRef<AbortController | null>(null);
  const requestActiveRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendMessageRef = useRef<(text: string, voice?: boolean, conversation?: boolean) => void>(() => {});
  const activeConversationRef = useRef(activeConversationId);
  useEffect(() => { activeConversationRef.current = activeConversationId; setEditingMessageId(null); setPendingAttachment(null); }, [activeConversationId]);

  /* ==========================================================
     VOICE CONVERSATION MODE
  ========================================================== */

  const [isConversationMode, setIsConversationMode] = useState(false);
  useEffect(() => {
    onVoiceModeChange?.(isConversationMode);
    return () => onVoiceModeChange?.(false);
  }, [isConversationMode, onVoiceModeChange]);

  const conversationModeRef = useRef(false);

  const conversationBusyRef = useRef(false);

  /* ==========================================================
     MESSAGE SCROLL
  ========================================================== */

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ==========================================================
     VOICE INPUT FLAG
  ========================================================== */

  const voiceInputRef = useRef(false);

  /* ==========================================================
     SESSION ID
  ========================================================== */

  const sessionIdRef = useRef<string>("");
  const [recruiterBaseSession, setRecruiterBaseSession] = useState("");
  const excludedHistoryRef = useRef(new Map<string, Set<string>>());
  const recruiterStatusRef = useRef<RecruiterStatus>({ session: "", revision: null, busy: false });
  const recruiterSession = recruiterBaseSession && activeConversationId ? `${recruiterBaseSession}:${activeConversationId}` : "";

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let sessionId = window.localStorage.getItem("bharat_ai_session_id");

    if (!sessionId) {
      sessionId = `session_${crypto.randomUUID()}`;

      window.localStorage.setItem("bharat_ai_session_id", sessionId);
    }

    sessionIdRef.current = sessionId;
    setRecruiterBaseSession(sessionId);
  }, []);

  /* ==========================================================
     SPEAK RESPONSE
  ========================================================== */

  const resumeConversation = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      if (conversationModeRef.current && !requestActiveRef.current && !window.speechSynthesis?.speaking) {
        conversationBusyRef.current = false;
        startConversationListening();
      }
    }, 100);
  };

  const createSpeech = (conversation: boolean, started = performance.now()) => {
    if (!("speechSynthesis" in window)) {
      if (conversation) resumeConversation();
      return null;
    }
    const speech = new StreamingSpeech({
      language: languageRef.current,
      synth: window.speechSynthesis,
      createUtterance: text => new SpeechSynthesisUtterance(text),
      onSpeaking: setIsSpeaking,
      onPulse: () => { speechPulse.current = performance.now(); },
      onFirstAudio: () => console.debug("Bharat AI first audio (ms)", Math.round(performance.now() - started)),
      onDone: () => { if (conversation) resumeConversation(); },
      onError: error => {
        console.warn("Voice playback unavailable:", error);
        const name = { en: "English", hi: "Hindi", ne: "Nepali" }[languageRef.current];
        setVoiceNotice(error === "language-unavailable"
          ? `${name} voice is not available on this device. Install a matching speech voice or continue with text.`
          : `${name} audio could not play. Please check browser audio permission; text replies still work.`);
        // Keep text available and let the user restart voice after a permission/device error.
        conversationModeRef.current = false;
        conversationBusyRef.current = false;
        setIsConversationMode(false);
      },
    });
    speechRef.current = speech;
    return speech;
  };

  const stopSpeaking = () => {
    speechRef.current?.cancel();
    speechRef.current = null;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
    setIsSpeaking(false);
  };

  const cancelCurrentResponse = () => {
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
    requestActiveRef.current = false;
    setIsGenerating(false);
    conversationBusyRef.current = false;
    setIsLoading(false);
    stopSpeaking();
  };

  const speakResponse = (text: string, continueConversation = false) => {
    stopSpeaking();
    rememberLanguage(detectLanguage(text, languageRef.current));
    const speech = createSpeech(continueConversation);
    speech?.append(hideDocumentSources(text));
    speech?.finish();
  };

  const sendMessage = async (messageText: string, fromVoice = false, conversation = false, editId?: string) => {
    const editedMessage = editId ? messages.find(message => message.id === editId) : undefined;
    const attachment = pendingAttachment ?? editedMessage?.attachments?.[0];
    const text = messageText.trim() || (attachment ? "Please analyze the attached file." : "");
    if (!text || requestActiveRef.current || conversationBusyRef.current) return;
    const currentSession = `${sessionIdRef.current || "session"}:${activeConversationRef.current || "chat"}`;
    const recruiterStatus = recruiterStatusRef.current;
    if (recruiterStatus.session !== currentSession || recruiterStatus.busy) {
      setVoiceNotice("Please wait for the job-description panel or stop dictation before asking a question.");
      return;
    }
    stopSpeaking();
    rememberLanguage(detectLanguage(text, languageRef.current));
    setVoiceNotice("");
    try { recognitionRef.current?.stop(); } catch {}
    requestActiveRef.current = true;
    setIsGenerating(true);
    conversationBusyRef.current = conversation;
    const controller = new AbortController();
    requestAbortRef.current = controller;
    const started = performance.now();
    const prefix = conversationPrefix(messages, editId);
    if (!excludedHistoryRef.current.has(currentSession)) {
      try {
        const ids = JSON.parse(localStorage.getItem(`bharat_ai_context_history_${currentSession}`) || "[]");
        excludedHistoryRef.current.set(currentSession, new Set(Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : []));
      } catch { excludedHistoryRef.current.set(currentSession, new Set()); }
    }
    const id = editId || crypto.randomUUID();
    const aiMessageId = `${crypto.randomUUID()}_ai`;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    followMessagesRef.current = true;
    setMessages([...prefix, { id, role: "user", content: text, timestamp, attachments: attachment ? [attachment] : undefined }]);
    setEditingMessageId(null);
    if (!editId) setInputValue("");
    setIsLoading(true);
    const speech = fromVoice || conversation ? createSpeech(conversation, started) : null;
    let fullAnswer = "";
    let published = false;
    let renderTimer: ReturnType<typeof setTimeout> | null = null;
    const publish = () => {
      renderTimer = null;
      if (controller.signal.aborted || !fullAnswer) return;
      const content = fullAnswer;
      if (!published) {
        published = true;
        setIsLoading(false);
        setMessages(prev => [...prev, { id: aiMessageId, role: "ai", content, timestamp }]);
      } else {
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, content } : m));
      }
    };
    try {
      let revision = recruiterStatus.revision;
      let history = requestHistory(prefix.filter(message => !excludedHistoryRef.current.get(currentSession)?.has(message.id)));
      if (attachment && (pendingAttachment || attachment.revision !== revision)) {
        const blob = await readAttachment(attachment.id);
        if (!blob) throw new Error("This file is no longer stored in this browser. Select it again with +.");
        if (controller.signal.aborted) return;
        const upload = await fetch(`${API_BASE_URL}/recruiter/upload?session_id=${encodeURIComponent(currentSession)}&filename=${encodeURIComponent(attachment.name)}`, {
          method: "POST", signal: controller.signal, headers: { "Content-Type": "application/octet-stream" }, body: blob,
        });
        const result = await upload.json();
        if (!upload.ok) throw new Error(typeof result.detail === "string" ? result.detail : "The attachment could not be processed.");
        if (controller.signal.aborted) return;
        revision = result.context.revision;
        recruiterStatusRef.current = { session: currentSession, revision, busy: false };
        const ids = prefix.map(message => message.id);
        excludedHistoryRef.current.set(currentSession, new Set(ids));
        try { localStorage.setItem(`bharat_ai_context_history_${currentSession}`, JSON.stringify(ids)); } catch {}
        history = [];
        setMessages(previous => previous.map(message => message.id === id ? { ...message, attachments: [{ ...attachment, revision: revision ?? undefined }] } : message));
        setPendingAttachment(null);
      }
      const response = await fetch(ASK_ENDPOINT, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
        body: JSON.stringify({
          question: text,
          voice: fromVoice || conversation,
          language: languageRef.current,
          session_id: currentSession,
          recruiter_revision: revision,
          history,
        }),
      });
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        throw new Error(typeof failure?.detail === "string" ? failure.detail : `Backend error: ${response.status}`);
      }
      const contextRevision = response.headers.get("X-Context-Revision");
      if (contextRevision) {
        recruiterStatusRef.current = { session: currentSession, revision: contextRevision, busy: false };
        if (contextRevision !== revision) {
          const ids = prefix.map(message => message.id);
          excludedHistoryRef.current.set(currentSession, new Set(ids));
          try { localStorage.setItem(`bharat_ai_context_history_${currentSession}`, JSON.stringify(ids)); } catch {}
        }
      }
      if (!response.body) throw new Error("Streaming is unavailable.");
      await readAnswerStream(response.body, token => {
        if (controller.signal.aborted) return;
        if (!fullAnswer) console.debug("Bharat AI first text (ms)", Math.round(performance.now() - started));
        fullAnswer += token;
        speech?.append(token);
        if (!published) publish();
        else if (!renderTimer) renderTimer = setTimeout(publish, 40);
      }, metrics => console.debug("Bharat AI server timing", metrics), resolvedLanguage => {
        rememberLanguage(resolvedLanguage);
        speech?.setLanguage(resolvedLanguage);
      });
      if (!fullAnswer.trim()) throw new Error("AI returned an empty response.");
      if (renderTimer) clearTimeout(renderTimer);
      publish();
      speech?.finish();
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error("Bharat AI streaming error:", error);
      speech?.cancel();
      if (renderTimer) clearTimeout(renderTimer);
      publish(); // Preserve useful partial text if the connection drops.
      setMessages(prev => [...prev, {
        id: `${id}_error`, role: "ai", timestamp,
        content: fullAnswer
          ? "The response was interrupted. Please try again."
          : error instanceof Error ? error.message : "I'm having trouble connecting to my AI server. Please try again.",
      }]);
      // Avoid an automatic microphone retry loop after a server failure.
      if (conversation) {
        conversationModeRef.current = false;
        setIsConversationMode(false);
      }
    } finally {
      if (renderTimer) clearTimeout(renderTimer);
      if (requestAbortRef.current === controller) {
        requestAbortRef.current = null;
        requestActiveRef.current = false;
        setIsGenerating(false);
        conversationBusyRef.current = false;
        setIsLoading(false);
        if (conversation && !speech) resumeConversation();
      }
    }
  };

  useEffect(() => { sendMessageRef.current = sendMessage; });

  /* ==========================================================
     SPEECH RECOGNITION
  ========================================================== */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const browser = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRecognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported.");

      return;
    }

    const recognition = new SpeechRecognition();
    let retryAfterSilence = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.lang = languageLocale(languageRef.current);

    /* ========================================================
       RESULT
    ======================================================== */

    recognition.onresult = (event: RecognitionResultEvent) => {
      let finalTranscript = "";

      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const text = finalTranscript + interimTranscript;

      setInputValue(text);

      /* ==================================================
           NORMAL MICROPHONE
        ================================================== */

      if (finalTranscript.trim() && !conversationModeRef.current) {
        voiceInputRef.current = true;

        sendMessageRef.current(finalTranscript.trim(), true, false);
      }

      /* ==================================================
           VOICE CONVERSATION
        ================================================== */

      if (finalTranscript.trim() && conversationModeRef.current) {
        setInputValue("");

        sendMessageRef.current(finalTranscript.trim(), true, true);
      }
    };

    /* ========================================================
       START
    ======================================================== */

    recognition.onstart = () => {
      setIsListening(true);
    };

    /* ========================================================
       END
    ======================================================== */

    recognition.onend = () => {
      setIsListening(false);
      // Wait for recognition to end before restarting after a silence timeout.
      if (retryAfterSilence && conversationModeRef.current) {
        retryAfterSilence = false;
        retryTimer = setTimeout(() => {
          retryTimer = null;
          if (conversationModeRef.current && !conversationBusyRef.current && !window.speechSynthesis?.speaking) {
            startConversationListening();
          }
        }, 500);
      }
    };

    /* ========================================================
       ERROR
    ======================================================== */

    recognition.onerror = (event: RecognitionErrorEvent) => {
      setIsListening(false);

      // Silence and an intentional stop are normal browser recognition events.
      if (event.error === "no-speech") {
        retryAfterSilence = conversationModeRef.current;
        return;
      }
      if (event.error === "aborted") {
        retryAfterSilence = false;
        return;
      }

      console.warn("Speech recognition unavailable:", event.error);
      if (event.error === "language-not-supported") {
        conversationModeRef.current = false;
        setIsConversationMode(false);
        setVoiceNotice("Your browser cannot recognize the selected language. Try Chrome/Edge with that language enabled, or type your question.");
      }

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        conversationModeRef.current = false;
        setIsConversationMode(false);
        alert("Please allow microphone access for Bharat AI.");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      recognitionRef.current = null;
      try {
        recognition.stop();
      } catch {}

      requestAbortRef.current?.abort();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      speechRef.current?.cancel();
    };
  }, []);

  /* ==========================================================
     NORMAL MICROPHONE
  ========================================================== */

  const toggleListening = () => {
    if (recruiterStatusRef.current.busy) {
      setVoiceNotice("Finish attaching or dictating requirements before starting chat voice.");
      return;
    }
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported. Please use Chrome or Edge.");

      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}

      setIsListening(false);

      return;
    }

    cancelCurrentResponse();

    try {
      recognitionRef.current.lang = languageLocale(languageRef.current);
      recognitionRef.current.start();

      setIsListening(true);
    } catch (error) {
      console.error("Unable to start microphone:", error);
    }
  };

  /* ==========================================================
     START CONVERSATION LISTENING
  ========================================================== */

  const startConversationListening = () => {
    if (!conversationModeRef.current) {
      return;
    }

    if (!recognitionRef.current) {
      return;
    }

    if (requestActiveRef.current || window.speechSynthesis?.speaking) {
      return;
    }

    try {
      recognitionRef.current.lang = languageLocale(languageRef.current);
      recognitionRef.current.start();

      setIsListening(true);
    } catch {
      console.log("Recognition already active.");
    }
  };

  /* ==========================================================
     START VOICE CONVERSATION
  ========================================================== */

  const startVoiceConversation = () => {
    if (recruiterStatusRef.current.busy) {
      setVoiceNotice("Finish attaching or dictating requirements before starting chat voice.");
      return;
    }
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported. Please use Chrome or Edge.");

      return;
    }

    cancelCurrentResponse();

    conversationModeRef.current = true;

    setIsConversationMode(true);

    setInputValue("");

    startConversationListening();
  };

  /* ==========================================================
     STOP VOICE CONVERSATION
  ========================================================== */

  const stopVoiceConversation = () => {
    conversationModeRef.current = false;

    setIsConversationMode(false);

    conversationBusyRef.current = false;

    setInputValue("");

    try {
      recognitionRef.current?.stop();
    } catch {}

    cancelCurrentResponse();

    setIsListening(false);
  };

  /* ==========================================================
     FORM SUBMIT
  ========================================================== */

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();

    voiceInputRef.current = false;

    sendMessage(inputValue, false, false);
  };

  /* ==========================================================
     SCROLL
  ========================================================== */

  useEffect(() => {
    if (!followMessagesRef.current) return;
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: reducedMotion || requestActiveRef.current ? "instant" : "smooth",
    });
  }, [messages, isLoading, reducedMotion]);

  /* ==========================================================
     AVATARS
  ========================================================== */

  const BotAvatar = () => (
    <div
      className="
        w-10
        h-10
        rounded-full
        bg-gradient-to-br
        from-white/20
        to-white/5
        flex
        items-center
        justify-center
        border
        border-white/20
        backdrop-blur-md
        shadow-sm
      "
    >
      <Bot
        className="
          w-5
          h-5
          text-white
        "
      />
    </div>
  );

  const UserSmallAvatar = () => (
    <div
      className="
        w-9
        h-9
        rounded-full
        bg-transparent
        border
        border-[#14ff82]/50
        flex
        items-center
        justify-center
      "
    >
      <User
        className="
          w-4
          h-4
          text-[#14ff82]
        "
      />
    </div>
  );

  /* ==========================================================
     DATE
  ========================================================== */

  const todayDate = dataLoaded ? new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }) : "";

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div className={styles.shell}>
      <div
        className="
          absolute
          inset-0
          z-0
          pointer-events-none
          rounded-[var(--portfolio-radius)]
          overflow-hidden
        "
      >
        <AssistantSpace />
      </div>

      {/* ====================================================
          HEADER & SIDEBAR
      ==================================================== */}

      <div className={styles.toolbar}>
        <button
          aria-label="Open chat history" aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={styles.menuButton}
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-[2px] rounded-[var(--portfolio-radius)]"
            />
            <motion.div
              initial={reducedMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.3 }}
              className={`${styles.sidebar} absolute top-0 left-0 bottom-0 w-[280px] max-w-[85%] z-[70] border-r flex flex-col shadow-2xl rounded-l-[var(--portfolio-radius)]`}
            >
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <button
                  onClick={startNewChat}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md text-sm font-medium transition-colors w-full"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </button>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="ml-2 p-2 shrink-0 text-white/60 hover:text-white rounded-md hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1 dark-scrollbar">
                {conversations.length === 0 && (
                  <p className="text-white/40 text-xs text-center mt-4">
                    No chat history yet
                  </p>
                )}
                {[...conversations]
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((conv) => (
                    <div
                      key={conv.id}
                      className={`relative w-full rounded-lg flex items-center group transition-colors ${
                        activeConversationId === conv.id
                          ? "bg-white/15"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <button
                        onClick={() => loadConversation(conv.id)}
                        className={`flex-1 text-left pl-3 pr-2 py-3 flex items-center gap-3 overflow-hidden ${
                          activeConversationId === conv.id
                            ? "text-white"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100" />
                        {renamingChatId === conv.id ? (
                          <form
                            onSubmit={(e) => submitRename(e, conv.id)}
                            className="flex-1 flex items-center"
                          >
                            <input
                              autoFocus
                              value={renameInput}
                              onChange={(e) => setRenameInput(e.target.value)}
                              onBlur={(e) => submitRename(e, conv.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-black/50 text-white text-sm outline-none px-2 py-0.5 rounded border border-white/20"
                            />
                          </form>
                        ) : (
                          <span className="truncate text-sm font-medium pr-12">
                            {conv.title}
                          </span>
                        )}
                      </button>

                      {renamingChatId !== conv.id && (
                        <div className="absolute right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenamingChatId(conv.id);
                              setRenameInput(conv.title);
                            }}
                            className="p-1.5 text-white/50 hover:text-white hover:bg-white/20 rounded-md transition-colors"
                            title="Rename"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => deleteConversation(e, conv.id)}
                            className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ====================================================
          CHAT AREA
      ==================================================== */}

      <div ref={chatRef} onScroll={event => { const el = event.currentTarget; followMessagesRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90; }} className={styles.chat}>
        {/* DATE */}

        <div className={styles.date}>{todayDate}</div>

        {/* ==================================================
            MESSAGES
        ================================================== */}

        <div className={`${styles.messages} space-y-6`}>
          {messages.map((msg, messageIndex) => (
            <motion.div
              initial={reducedMotion ? false : {
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              key={msg.id}
              className="flex justify-center w-full group"
            >
              <div
                className={`
                      flex
                      flex-col
                      ${msg.role === "user" ? "items-end" : "items-start"}
                      w-full
                      max-w-3xl
                    `}
              >
                <div
                  className={`
                        ${
                          msg.role === "user"
                            ? "bg-black/40 backdrop-blur-md text-[#14ff82] rounded-[var(--portfolio-radius)] rounded-tr-sm border border-white/10 shadow-sm px-5 py-4 max-w-[85%]"
                            : "text-white bg-transparent border-transparent py-2 w-full"
                        }
                      `}
                >
                  <div
                    className="
                        font-ibm-plex
                        text-base
                        tracking-wide
                        leading-relaxed
                      "
                  >
                    {msg.attachments && <div className="mb-3 flex flex-wrap gap-2">{msg.attachments.map(attachment => <AttachmentCard key={attachment.id} attachment={attachment}/>)}</div>}
                    {editingMessageId === msg.id ? (
                      <div className="min-w-[min(65vw,400px)] space-y-3">
                        <textarea autoFocus value={editText} onChange={event => setEditText(event.target.value)} rows={4} maxLength={12000}
                          aria-label="Edit message" onKeyDown={event => {
                            if (event.key === "Escape") setEditingMessageId(null);
                            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); void sendMessage(editText, false, false, msg.id); }
                          }} className="w-full resize-y rounded-xl border border-emerald-300/30 bg-[#071a14] p-3 text-white outline-none focus:border-emerald-300"/>
                        <p className="text-xs text-emerald-100/60">Resending replaces this message and the replies after it.</p>
                        <div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingMessageId(null)} className="rounded-lg px-3 py-2 text-sm text-gray-300">Cancel</button>
                          <button type="button" disabled={!editText.trim() || isGenerating} onClick={() => sendMessage(editText, false, false, msg.id)} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white disabled:opacity-50">Save &amp; resend</button></div>
                      </div>
                    ) : messageIndex === 0 && msg.id === "1" ? (
                      <div className={styles.welcome}>
                        <motion.h2 initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>Hey! <span className={styles.wave}>👋</span></motion.h2>
                        <p className={styles.intro}>I’m <strong><JoJoWordmark /></strong> — Bharat’s personal AI assistant.</p>
                        <p className={styles.question}>How can I help you today?</p>
                      </div>
                    ) : msg.role === "user" ? <p className="whitespace-pre-wrap break-words">{msg.content}</p> : <div className={styles.answer}><ReactMarkdown
                      remarkPlugins={[remarkGfm]} skipHtml
                      components={{
                        table: ({ children }) => <div className={styles.tableScroll} role="region" aria-label="Answer table" tabIndex={0}><table>{children}</table></div>,
                        a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-xl font-bold mb-3 text-white"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-lg font-bold mb-2 mt-4 text-white"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-base font-bold mb-2 mt-3 text-white"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="mb-3 last:mb-0 whitespace-pre-wrap"
                            {...props}
                          />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-bold text-white/90"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-5 mb-3" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal pl-5 mb-3" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                      }}
                    >
                      {normalizeAnswer(msg.content)}
                    </ReactMarkdown></div>}
                  </div>
                </div>

                <div
                  className="
                      flex
                      items-center
                      gap-4
                      mt-2
                      px-1
                    "
                >
                  <span className={styles.timestamp}>
                    {msg.timestamp}
                  </span>

                  {msg.role === "user" && editingMessageId !== msg.id && <button type="button" disabled={isGenerating} aria-label="Edit message" title="Edit and resend"
                    onClick={() => { stopSpeaking(); setEditingMessageId(msg.id); setEditText(msg.content); }}
                    className="rounded p-1 text-gray-400 transition-colors hover:text-white focus-visible:text-white disabled:opacity-40"><Edit2 className="h-3.5 w-3.5"/></button>}
                  {msg.role === "ai" && (
                    <div
                      className="
                          flex
                          items-center
                          gap-3
                          opacity-100 sm:opacity-0
                          sm:group-hover:opacity-100 focus-within:opacity-100
                          transition-opacity
                        "
                    >
                      <button
                        type="button"
                        onClick={() => speakResponse(msg.content)}
                        className="
                            text-gray-300
                            hover:text-white
                          "
                        title="Speak response"
                      >
                        <Volume2
                          className="
                              w-3.5
                              h-3.5
                            "
                        />
                      </button>

                      <button
                        type="button"
                        className="
                            text-gray-300
                            hover:text-gray-600
                          "
                      >
                        <ThumbsUp
                          className="
                              w-3.5
                              h-3.5
                            "
                        />
                      </button>

                      <button
                        type="button"
                        className="
                            text-gray-300
                            hover:text-gray-600
                          "
                      >
                        <ThumbsDown
                          className="
                              w-3.5
                              h-3.5
                            "
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {msg.role === "user" && (
                <div
                  className="
                      ml-3
                      mt-1
                    "
                >
                  <UserSmallAvatar />
                </div>
              )}
            </motion.div>
          ))}

          {/* ==================================================
              LOADING
          ================================================== */}

          {isLoading && (
            <motion.div initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={styles.thinking} role="status" aria-label="JoJo is thinking"><i /><i /><i /></motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ====================================================
          INPUT
      ==================================================== */}

      <div
        ref={composerRef}
        className={styles.composerWrap}
      >
        <RecruiterPanel key={recruiterSession} api={API_BASE_URL} session={recruiterSession}
          disabled={isGenerating} pending={pendingAttachment} onAttachment={setPendingAttachment}
          onStatus={status => {
            recruiterStatusRef.current = { ...status, revision: status.preserveRevision && recruiterStatusRef.current.session === status.session ? recruiterStatusRef.current.revision : status.revision };
          }}
          onBegin={() => {
            conversationModeRef.current = false;
            setIsConversationMode(false);
            try { recognitionRef.current?.stop(); } catch {}
            cancelCurrentResponse();
          }}>
        <form
          onSubmit={handleSendMessage}
          className={`${styles.composer} ${styles.inlineComposer}`}
        >
          {/* INPUT */}

          <textarea
            rows={1} maxLength={12000} aria-label="Message JoJo"
            onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); handleSendMessage(); } }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isListening ? "Listening..." : "Ask Bharat AI Anything......"
            }
            className="
              flex-1
              bg-transparent
              text-base
              text-white
              placeholder:text-gray-400
              placeholder:text-sm
              outline-none
              px-3
            "
          />

          {/* NORMAL MICROPHONE */}

          <button
            type="button"
            onClick={toggleListening}
            className={`${styles.mic}
              p-2
              transition-all
              ml-1
              ${
                isListening
                  ? "text-red-500 bg-red-50 rounded-full animate-pulse"
                  : "text-[#a5ffe1] hover:text-white"
              }
            `}
            title={isListening ? "Stop listening" : "Speak to Bharat AI"}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* SPEAKING */}

          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="
                p-2
                text-white
                hover:text-red-500
              "
              title="Stop speaking"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          )}

          {/* SEND / VOICE */}

          {isGenerating ? (
            <button type="button" onClick={cancelCurrentResponse} aria-label="Stop response"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#165b45] text-white mr-1">
              <Square className="w-4 h-4" />
            </button>
          ) : inputValue.trim() || pendingAttachment ? (
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Send message"
              className="
                w-10
                h-10
                bg-[#10b981]
                hover:bg-[#34f5a0]
                disabled:bg-[#165b45]
                text-white
                rounded-full
                transition-all
                flex
                items-center
                justify-center
                shrink-0
                mr-1
              "
            >
              <Send
                className="
                  w-4
                  h-4
                "
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={
                isConversationMode
                  ? stopVoiceConversation
                  : startVoiceConversation
              }
              className={`
                w-10
                h-10
                ${
                  isConversationMode
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "bg-transparent text-[#14ff82] hover:bg-[#14ff82]/10"
                }
                rounded-full
                transition-all
                flex
                items-center
                justify-center
                shrink-0
                mr-1
              `}
              title={
                isConversationMode
                  ? "End voice conversation"
                  : "Start voice conversation"
              }
            >
              {isConversationMode ? (
                <PhoneOff className="w-5 h-5" />
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 21.2 21.2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block overflow-visible"
                >
                  <rect
                    fill="currentColor"
                    height="6px"
                    width="1.2px"
                    rx="0.6"
                    x="0"
                    y="7.6"
                  />

                  <rect
                    fill="currentColor"
                    height="10px"
                    width="1.2px"
                    rx="0.6"
                    x="4"
                    y="5.6"
                  />

                  <rect
                    fill="currentColor"
                    height="16px"
                    width="1.2px"
                    rx="0.6"
                    x="8"
                    y="2.6"
                  />

                  <rect
                    fill="currentColor"
                    height="10px"
                    width="1.2px"
                    rx="0.6"
                    x="12"
                    y="5.6"
                  />

                  <rect
                    fill="currentColor"
                    height="16px"
                    width="1.2px"
                    rx="0.6"
                    x="16"
                    y="2.6"
                  />

                  <rect
                    fill="currentColor"
                    height="6px"
                    width="1.2px"
                    rx="0.6"
                    x="20"
                    y="7.6"
                  />
                </svg>
              )}
            </button>
          )}
        </form>
        </RecruiterPanel>
        {voiceNotice && <p role="status" className="mx-auto max-w-[620px] px-3 pt-2 text-xs text-amber-200">{voiceNotice}</p>}

        {/* MODE INFORMATION */}

        <p className={styles.disclaimer}>
          {isConversationMode
            ? "Voice conversation active • Tap red button to end"
            : "Bharat AI can make mistakes. Verify important information."}
        </p>
      </div>

      {/* ====================================================
          VOICE CONVERSATION WINDOW
      ==================================================== */}

      <AnimatePresence>
      {isConversationMode && (
        <VoiceInterface
          isThinking={isLoading}
          speechPulse={speechPulse}
          isListening={isListening}
          isSpeaking={isSpeaking}
          onClose={stopVoiceConversation}
        />
      )}
      </AnimatePresence>
    </div>
  );
}
