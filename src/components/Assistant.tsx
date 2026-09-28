"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import {
  Send,
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
  Check,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import RobotLoader from "@/components/RobotLoader";
import { VoiceBackground } from "@/components/VoiceBackground";

/* ============================================================
   TYPES
============================================================ */

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
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

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
  onresult: ((event: any) => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

/* ============================================================
   ANIMATED SOUND BARS
============================================================ */

const AnimatedSoundBars = ({
  isAnimating,
  onClick,
}: {
  isAnimating: boolean;
  onClick: () => void;
}) => {
  const heights = [48, 69, 90, 58, 34, 70, 90, 70, 58, 36];

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 h-[120px] bg-transparent border-none cursor-pointer outline-none hover:scale-105 transition-transform my-4"
      title="End voice conversation"
    >
      {heights.map((h, i) => {
        const duration = (0.9 + (i % 3) * 0.2).toFixed(2);
        const delay = (i * 0.07).toFixed(2);

        return (
          <div
            key={i}
            className="relative w-[12px] rounded-full bg-transparent border-[2px] border-[#14ff82] origin-center"
            style={{
              height: `${h}px`,
              boxShadow:
                "0 0 6px rgba(20,255,130,0.8), inset 0 0 4px rgba(20,255,130,0.25)",
              animation: isAnimating
                ? `sound-bounce ${duration}s ease-in-out ${delay}s infinite`
                : "none",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-[#14ff82]/10" />
          </div>
        );
      })}

      <style jsx>{`
        @keyframes sound-bounce {
          0%,
          100% {
            transform: scaleY(1);
          }

          50% {
            transform: scaleY(0.4);
          }
        }
      `}</style>
    </button>
  );
};

/* ============================================================
   VOICE THINKING STATE
============================================================ */

function VoiceThinkingState({
  isConversationMode,
  isListening,
  isSpeaking,
  onClose,
}: {
  isConversationMode: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onClose: () => void;
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setToastMsg("Starting Bharat AI…");

    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 2200);

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleEndTap = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToastMsg("Ending conversation…");

    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
      onClose();
    }, 260);
  };

  const statusLabel = isSpeaking
    ? "Bharat AI is speaking…"
    : isListening
      ? "Listening…"
      : isConversationMode
        ? "Voice conversation"
        : "Ready";

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black
      "
    >
      <VoiceBackground />

      <style>{`
        .voice-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 360px;
          background: transparent;
          border: none;
          padding: 24px 16px 32px;
          box-sizing: border-box;
          box-shadow: none;
        }

        .voice-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .voice-eyebrow {
          color: #8a8a9a;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          margin: 0 0 6px;
          text-transform: uppercase;
        }

        .voice-title {
          color: #f2f2f5;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .voice-live {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #a99bff;
          font-size: 13px;
          font-weight: 500;
          padding-top: 4px;
        }

        .voice-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8b7bff;
          box-shadow:
            0 0 8px 2px
            rgba(139,123,255,0.7);
          animation:
            voice-dot-pulse
            1.6s ease-in-out infinite;
        }

        @keyframes voice-dot-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        .voice-close {
          color: #6b6b7a;
          transition: color 0.15s ease;
          padding: 8px;
        }

        .voice-close:hover {
          color: #f2f2f5;
        }

        .voice-stage {
          position: relative;
          width: 100%;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 900px;
          margin: 8px 0 6px;
        }

        .voice-sphere {
          position: relative;
          width: 200px;
          height: 200px;
          transform-style: preserve-3d;
          animation:
            voice-spin
            9s linear infinite;
        }

        @keyframes voice-spin {
          from {
            transform:
              rotateY(0deg)
              rotateX(8deg);
          }

          to {
            transform:
              rotateY(360deg)
              rotateX(8deg);
          }
        }

        .voice-caption {
          text-align: center;
          color: #d6d6e0;
          font-size: 14px;
          font-weight: 500;
          margin: 4px 0 20px;
        }

        .voice-btn-wrap {
          position: relative;
          display: flex;
          justify-content: center;
        }

        .voice-mic-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 4px auto 4px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background:
            radial-gradient(
              circle at 35% 30%,
              #9b8bff,
              #6c56f5 60%,
              #4a37c9 100%
            );
          box-shadow:
            0 0 0 6px
            rgba(139,123,255,0.12),
            0 8px 24px
            rgba(108,86,245,0.45);
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }

        .voice-mic-btn:hover {
          transform: scale(1.05);

          box-shadow:
            0 0 0 8px
            rgba(139,123,255,0.18),
            0 10px 28px
            rgba(108,86,245,0.55);
        }

        .voice-mic-btn:active {
          transform: scale(0.96);
        }

        .voice-mic-btn.voice-pulse {
          animation:
            voice-pulse-animation
            1.5s ease-in-out infinite;
        }

        @keyframes voice-pulse-animation {
          0%, 100% {
            transform: scale(1);

            box-shadow:
              0 0 0 6px
              rgba(139,123,255,0.12),
              0 8px 24px
              rgba(108,86,245,0.45);
          }

          50% {
            transform: scale(1.08);

            box-shadow:
              0 0 0 18px
              rgba(139,123,255,0.05),
              0 12px 40px
              rgba(108,86,245,0.7);
          }
        }

        .voice-toast {
          position: absolute;
          left: 50%;
          bottom: -6px;
          transform: translate(-50%, 0);
          background: #1c1c28;
          border: 1px solid #34344a;
          color: #f2f2f5;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow:
            0 8px 20px
            rgba(0,0,0,0.4);
          opacity: 0;
          pointer-events: none;
          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .voice-toast.show {
          opacity: 1;
          transform:
            translate(-50%, -14px);
        }

        .dark-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .dark-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .dark-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .dark-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <div className="voice-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="voice-close"
            aria-label="Close voice mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="voice-stage">
          <RobotLoader
            isLoading={true}
            isThinking={!isSpeaking}
            isSpeaking={isSpeaking}
            size={200}
          />
        </div>

        <p className="voice-caption">{statusLabel}</p>

        <div className="voice-btn-wrap">
          <AnimatedSoundBars isAnimating={isListening} onClick={handleEndTap} />

          <div
            className={`
              voice-toast
              ${toastMsg ? "show" : ""}
            `}
          >
            {toastMsg}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ASSISTANT
============================================================ */

export function Assistant() {
  /* ==========================================================
     MESSAGES
  ========================================================== */

  const defaultMessages: Message[] = [
    {
      id: "1",
      role: "ai",
      content:
        "Hey! 👋\nI'm Jojo — Bharat's personal AI assistant.\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ];

  const [messages, setMessages] = useState<Message[]>(defaultMessages);
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
    setMessages(defaultMessages);

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
    if (dataLoaded) {
      localStorage.setItem(
        "assistantConversations",
        JSON.stringify(conversations),
      );
    }
  }, [conversations, dataLoaded]);

  const startNewChat = () => {
    setActiveConversationId(Date.now().toString());
    setMessages(defaultMessages);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const loadConversation = (id: string) => {
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

  const utterancesQueueRef = useRef<SpeechSynthesisUtterance[]>([]);

  /* ==========================================================
     VOICE CONVERSATION MODE
  ========================================================== */

  const [isConversationMode, setIsConversationMode] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let sessionId = window.localStorage.getItem("bharat_ai_session_id");

    if (!sessionId) {
      sessionId =
        "session_" +
        Date.now() +
        "_" +
        Math.random().toString(36).substring(2, 10);

      window.localStorage.setItem("bharat_ai_session_id", sessionId);
    }

    sessionIdRef.current = sessionId;
  }, []);

  /* ==========================================================
     SPEAK RESPONSE
  ========================================================== */

  const speakResponse = (text: string, continueConversation = false) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[\\*#_`]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    if (!cleanText) {
      if (continueConversation) {
        startConversationListening();
      }

      return;
    }

    /* ========================================================
       CHOOSE MALE VOICE
    ======================================================== */

    const chooseMaleVoice = (
      voices: SpeechSynthesisVoice[],
    ): SpeechSynthesisVoice | null => {
      const maleHints = [
        "male",
        "david",
        "mark",
        "guy",
        "ravi",
        "prabhat",
        "daniel",
        "aaron",
        "fred",
        "alex",
        "microsoft david",
        "google uk english male",
        "google us english male",
        "english male",
      ];

      const femaleHints = [
        "female",
        "zira",
        "samantha",
        "karen",
        "susan",
        "heera",
        "priya",
        "neerja",
        "google uk english female",
        "google us english female",
        "english female",
      ];

      const isMale = (voice: SpeechSynthesisVoice) => {
        const name = voice.name.toLowerCase();

        return maleHints.some((hint) => name.includes(hint));
      };

      const isFemale = (voice: SpeechSynthesisVoice) => {
        const name = voice.name.toLowerCase();

        return femaleHints.some((hint) => name.includes(hint));
      };

      const isAsianMale = (voice: SpeechSynthesisVoice) => {
        const lang = voice.lang.toLowerCase();
        const name = voice.name.toLowerCase();

        // Match Asian language codes or specific Asian male voice names
        const isAsianLang =
          lang.includes("en-in") ||
          lang.includes("en-sg") ||
          lang.includes("en-ph") ||
          lang.includes("en-hk") ||
          lang.includes("zh") ||
          lang.includes("ko") ||
          lang.includes("ja");
        const asianNames = [
          "ravi",
          "prabhat",
          "rishi",
          "zhiwei",
          "kazuha",
          "keita",
          "tian",
          "yunjian",
        ];

        const hasAsianName = asianNames.some((hint) => name.includes(hint));

        // MUST be explicitly male (either by male name, or has 'male' in the voice profile)
        return (
          (isAsianLang && isMale(voice)) || (hasAsianName && !isFemale(voice))
        );
      };

      const youngMaleHints = [
        "google uk english male",
        "google us english",
        "mark",
        "aaron",
        "alex",
        "daniel",
        "guy",
      ];

      const isYoungMale = (voice: SpeechSynthesisVoice) => {
        const name = voice.name.toLowerCase();
        return youngMaleHints.some((hint) => name.includes(hint));
      };

      // 1. Try to find an Asian/Indian male voice specifically
      const asianMale = voices.find((voice) => isAsianMale(voice));
      if (asianMale) return asianMale;

      // 2. Try to find a young western male voice
      const youngMale = voices.find((voice) => isYoungMale(voice));
      if (youngMale) return youngMale;

      const indianEnglish = voices.find(
        (voice) =>
          voice.lang.toLowerCase().includes("en-in") && !isFemale(voice),
      );

      if (indianEnglish) {
        return indianEnglish;
      }

      const englishMale = voices.find(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en") &&
          isMale(voice) &&
          !isFemale(voice),
      );

      if (englishMale) {
        return englishMale;
      }

      const englishVoice = voices.find(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en") && !isFemale(voice),
      );

      if (englishVoice) {
        return englishVoice;
      }

      return voices[0] || null;
    };

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) {
        return;
      }

      const selectedVoice = chooseMaleVoice(voices);

      if (selectedVoice) {
        console.log(
          "Bharat AI selected voice:",
          selectedVoice.name,
          selectedVoice.lang,
        );
      }

      const sentences = cleanText.match(/[^.!?]+[.!?]*/g) || [cleanText];

      utterancesQueueRef.current = [];

      sentences.forEach((sentence, index) => {
        const textChunk = sentence.trim();
        if (!textChunk) return;

        const utterance = new SpeechSynthesisUtterance(textChunk);
        utterancesQueueRef.current.push(utterance);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          utterance.lang = "en-IN";
        }

        utterance.rate = 1.15; // Faster, more energetic
        utterance.pitch = 1.25; // Higher pitch for a younger boy
        utterance.volume = 1;

        if (index === 0) {
          utterance.onstart = () => {
            setIsSpeaking(true);
          };
        }

        if (index === sentences.length - 1) {
          utterance.onend = () => {
            setIsSpeaking(false);

            if (continueConversation && conversationModeRef.current) {
              setTimeout(() => {
                startConversationListening();
              }, 350);
            }
          };

          utterance.onerror = (event) => {
            console.error("Speech synthesis error:", event);

            setIsSpeaking(false);

            if (continueConversation && conversationModeRef.current) {
              setTimeout(() => {
                startConversationListening();
              }, 350);
            }
          };
        } else {
          utterance.onerror = (event) => {
            console.error("Speech synthesis error on chunk:", event);
          };
        }

        window.speechSynthesis.speak(utterance);
      });
    };

    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      speak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();

        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  };

  /* ==========================================================
     STOP SPEAKING
  ========================================================== */

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      setIsSpeaking(false);
    }
  };

  /* ==========================================================
     STREAM RESPONSE PARSER
  ========================================================== */

  const parseStreamChunk = (chunk: string): string => {
    if (!chunk) {
      return "";
    }

    /*
     * Supports:
     *
     * 1. Raw text streaming
     * 2. SSE:
     *    data: hello
     * 3. JSON:
     *    {"token":"hello"}
     * 4. JSON:
     *    {"text":"hello"}
     * 5. JSON:
     *    {"answer":"hello"}
     */

    let result = "";

    const lines = chunk.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        continue;
      }

      if (trimmed === "data: [DONE]") {
        continue;
      }

      let value = trimmed;

      if (value.startsWith("data:")) {
        value = value.substring(5).trim();
      }

      try {
        const parsed = JSON.parse(value);

        if (typeof parsed === "string") {
          result += parsed;
        } else if (typeof parsed.token === "string") {
          result += parsed.token;
        } else if (typeof parsed.text === "string") {
          result += parsed.text;
        } else if (typeof parsed.answer === "string") {
          result += parsed.answer;
        }
      } catch {
        result += value;
      }
    }

    return result;
  };

  /* ==========================================================
     SEND MESSAGE — STREAMING
  ========================================================== */

  const sendMessage = async (
    messageText: string,
    fromVoice = false,
    conversation = false,
  ) => {
    const text = messageText.trim();

    if (!text || isLoading || conversationBusyRef.current) {
      return;
    }

    if (conversation) {
      conversationBusyRef.current = true;
    }

    const userMessageId = Date.now().toString();

    const aiMessageId = `${Date.now()}_ai`;

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    /* ========================================================
       USER MESSAGE
    ======================================================== */

    const newUserMsg: Message = {
      id: userMessageId,
      role: "user",
      content: text,
      timestamp,
    };

    setMessages((prev) => [...prev, newUserMsg]);

    setInputValue("");

    setIsLoading(true);

    /* ========================================================
       STREAM STATE
    ======================================================== */

    let fullAnswer = "";

    let aiMessageCreated = false;

    try {
      console.log("Sending streaming request...");

      /* ======================================================
         BACKEND
      ====================================================== */

      const backendUrl = "personal-ai-assistan-production.up.railway.app/ask";

      const response = await fetch(backendUrl, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Accept: "text/event-stream",
        },

        body: JSON.stringify({
          question: text,

          voice: fromVoice,

          session_id: sessionIdRef.current || "default",
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      /* ======================================================
         STREAM CHECK
      ====================================================== */

      if (!response.body) {
        throw new Error("Streaming is not supported by this response.");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder("utf-8");

      /* ======================================================
         READ STREAM
      ====================================================== */

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, {
          stream: true,
        });

        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const token = parseStreamChunk(line + "\n");

          if (!token) {
            continue;
          }

          fullAnswer += token;

          /* ====================================================
           CREATE AI MESSAGE ON FIRST TOKEN
        ==================================================== */

          if (!aiMessageCreated && fullAnswer) {
            aiMessageCreated = true;

            setIsLoading(false);

            const firstAiMessage: Message = {
              id: aiMessageId,
              role: "ai",
              content: fullAnswer,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };

            setMessages((prev) => [...prev, firstAiMessage]);
          } else if (aiMessageCreated) {
            /* ==================================================
             UPDATE EXISTING AI MESSAGE
          ================================================== */

            setMessages((prev) =>
              prev.map((message) =>
                message.id === aiMessageId
                  ? {
                      ...message,
                      content: fullAnswer,
                    }
                  : message,
              ),
            );
          }
        }
      }

      /* ======================================================
         FLUSH DECODER
      ====================================================== */

      const remaining = decoder.decode();
      const finalBuffer = buffer + remaining;

      if (finalBuffer) {
        const token = parseStreamChunk(finalBuffer);

        if (token) {
          fullAnswer += token;

          if (!aiMessageCreated) {
            aiMessageCreated = true;

            setIsLoading(false);

            setMessages((prev) => [
              ...prev,
              {
                id: aiMessageId,
                role: "ai",
                content: fullAnswer,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
          } else {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === aiMessageId
                  ? {
                      ...message,
                      content: fullAnswer,
                    }
                  : message,
              ),
            );
          }
        }
      }

      /* ======================================================
         EMPTY RESPONSE
      ====================================================== */

      if (!fullAnswer.trim()) {
        throw new Error("AI returned an empty response.");
      }

      /* ======================================================
         STREAM COMPLETE
      ====================================================== */

      console.log("Streaming completed.");

      console.log("Final answer:", fullAnswer);

      /* ======================================================
         VOICE AFTER STREAM
      ====================================================== */

      if (fromVoice || conversation) {
        setTimeout(() => {
          speakResponse(fullAnswer, conversation);
        }, 100);
      }
    } catch (error) {
      console.error("Bharat AI streaming error:", error);

      /* ======================================================
         REMOVE PARTIAL AI MESSAGE
      ====================================================== */

      if (aiMessageCreated) {
        setMessages((prev) =>
          prev.filter((message) => message.id !== aiMessageId),
        );
      }

      const errorMsg: Message = {
        id: `${Date.now()}_error`,
        role: "ai",
        content:
          "I'm having trouble connecting to my AI server right now. Please make sure the Bharat AI backend is running.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMsg]);

      if (conversation) {
        setTimeout(() => {
          if (conversationModeRef.current) {
            startConversationListening();
          }
        }, 1000);
      }
    } finally {
      setIsLoading(false);

      if (conversation) {
        conversationBusyRef.current = false;
      }
    }
  };

  /* ==========================================================
     SPEECH RECOGNITION
  ========================================================== */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported.");

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.lang = "en-IN";

    /* ========================================================
       RESULT
    ======================================================== */

    recognition.onresult = (event: any) => {
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

        setTimeout(() => {
          sendMessage(finalTranscript.trim(), true, false);
        }, 250);
      }

      /* ==================================================
           VOICE CONVERSATION
        ================================================== */

      if (finalTranscript.trim() && conversationModeRef.current) {
        setInputValue("");

        sendMessage(finalTranscript.trim(), true, true);
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
    };

    /* ========================================================
       ERROR
    ======================================================== */

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);

      setIsListening(false);

      if (event.error === "not-allowed") {
        alert("Please allow microphone access for Bharat AI.");
      }

      if (event.error === "no-speech" && conversationModeRef.current) {
        setTimeout(() => {
          startConversationListening();
        }, 500);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}

      window.speechSynthesis?.cancel();
    };
  }, []);

  /* ==========================================================
     NORMAL MICROPHONE
  ========================================================== */

  const toggleListening = () => {
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

    stopSpeaking();

    try {
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

    if (isLoading || isSpeaking) {
      return;
    }

    try {
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
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported. Please use Chrome or Edge.");

      return;
    }

    stopSpeaking();

    conversationModeRef.current = true;

    setIsConversationMode(true);

    setInputValue("");

    setTimeout(() => {
      startConversationListening();
    }, 400);
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

    stopSpeaking();

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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

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

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div
      className="
        relative
        flex
        h-full
        w-full
        flex-col
        overflow-hidden
        rounded-[10px]
        bg-transparent
        font-ibm-plex
      "
    >
      <div
        className="
          absolute
          inset-0
          z-0
          pointer-events-none
          rounded-[10px]
          overflow-hidden
        "
      >
        <VoiceBackground />
      </div>

      {/* ====================================================
          HEADER & SIDEBAR
      ==================================================== */}

      <div className="absolute top-0 left-0 right-0 h-16 z-[45] flex items-center px-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors pointer-events-auto shadow-sm backdrop-blur-sm"
        >
          <Menu className="w-5 h-5" />
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
              className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-[2px] rounded-[10px]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="absolute top-0 left-0 bottom-0 w-[280px] max-w-[85%] z-[70] bg-[#0c0d10] border-r border-white/10 flex flex-col shadow-2xl rounded-l-[10px]"
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
                {conversations
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

      <div
        className="
          flex-1
          overflow-y-auto
          px-6
          pt-14
          pb-28
          scroll-smooth
          bg-transparent
          relative
          z-10
          dark-scrollbar
        "
      >
        {/* DATE */}

        <div
          className="
            flex
            items-center
            justify-center
            my-6
          "
        >
          <span
            className="
              px-4
              text-[20px]
              text-gray-300
              font-medium
            "
          >
            {todayDate}
          </span>
        </div>

        {/* ==================================================
            MESSAGES
        ================================================== */}

        <div className="space-y-6">
          {messages.map((msg) => (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              key={msg.id}
              className="flex justify-center w-full group px-4"
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
                            ? "bg-black/40 backdrop-blur-md text-[#14ff82] rounded-2xl rounded-tr-sm border border-white/10 shadow-sm px-5 py-4 max-w-[85%]"
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
                    <ReactMarkdown
                      components={{
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
                      {msg.content}
                    </ReactMarkdown>
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
                  <span
                    className="
                        text-[18px]
                        text-gray-300
                        font-medium
                      "
                  >
                    {msg.timestamp}
                  </span>

                  {msg.role === "ai" && (
                    <div
                      className="
                          flex
                          items-center
                          gap-3
                          opacity-0
                          group-hover:opacity-100
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
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                flex
                justify-start
                w-full
              "
            >
              <div
                className="
                  mr-3
                  mt-1
                "
              >
                <BotAvatar />
              </div>

              <div
                className="
                  bg-transparent
                  px-5
                  py-4
                  rounded-2xl
                  rounded-tl-sm
                  border-transparent
                  flex
                  items-center
                  gap-2
                  h-[56px]
                "
              >
                <div
                  className="
                    flex
                    gap-1.5
                  "
                >
                  <div
                    className="
                      w-2
                      h-2
                      bg-[#8e85a6]
                      rounded-full
                      animate-bounce
                      [animation-delay:-0.3s]
                    "
                  />

                  <div
                    className="
                      w-2
                      h-2
                      bg-[#8e85a6]
                      rounded-full
                      animate-bounce
                      [animation-delay:-0.15s]
                    "
                  />

                  <div
                    className="
                      w-2
                      h-2
                      bg-[#8e85a6]
                      rounded-full
                      animate-bounce
                    "
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ====================================================
          INPUT
      ==================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          p-4
          bg-gradient-to-t
          from-black/80
          via-black/50
          to-transparent
          pt-10
          rounded-b-[10px]
          z-10
        "
      >
        <form
          onSubmit={handleSendMessage}
          className="
            max-w-3xl
            mx-auto
            bg-black/40
            backdrop-blur-md
            border
            border-white/20
            rounded-[15px]
            px-2
            py-2
            flex
            items-center
            transition-all
            focus-within:ring-2
            focus-within:ring-[#8e85a6]/30
          "
        >
          {/* NORMAL MICROPHONE */}

          <button
            type="button"
            onClick={toggleListening}
            className={`
              p-2
              transition-all
              ml-1
              ${
                isListening
                  ? "text-red-500 bg-red-50 rounded-full animate-pulse"
                  : "text-[#8e85a6] hover:text-[#4a3b69]"
              }
            `}
            title={isListening ? "Stop listening" : "Speak to Bharat AI"}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* INPUT */}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isListening ? "Listening..." : "Ask Bharat AI anything..."
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

          {inputValue.trim() ? (
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-10
                h-10
                bg-[#a699c2]
                hover:bg-[#8e85a6]
                disabled:bg-[#d5d0df]
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

        {/* MODE INFORMATION */}

        <p
          className="
            text-center
            text-xs
            text-gray-400
            mt-2
          "
        >
          {isConversationMode
            ? "Voice conversation active • Tap red button to end"
            : "Bharat AI can make mistakes. Verify important information."}
        </p>
      </div>

      {/* ====================================================
          VOICE CONVERSATION WINDOW
      ==================================================== */}

      {isConversationMode && (
        <VoiceThinkingState
          isConversationMode={isConversationMode}
          isListening={isListening}
          isSpeaking={isSpeaking}
          onClose={stopVoiceConversation}
        />
      )}
    </div>
  );
}
