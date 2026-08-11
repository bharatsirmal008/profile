"use client";

import React, { useState, useRef, useEffect } from "react";

import {
  MoreHorizontal,
  Send,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Mic,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  X,
} from "lucide-react";

import { motion } from "framer-motion";

/* ============================================================
   MESSAGE TYPE
============================================================ */

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
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
   VOICE CONVERSATION STATE
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
  const sphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sphereRef.current) return;

    sphereRef.current.innerHTML = "";

    const RADIUS = 100;
    const RINGS = 22;
    const PER_RING = 26;

    for (let i = 0; i <= RINGS; i++) {
      const phi = Math.PI * (i / RINGS);

      const y = RADIUS * Math.cos(phi);

      const ringRadius = RADIUS * Math.sin(phi);

      const count = Math.max(1, Math.round(PER_RING * Math.sin(phi)));

      for (let j = 0; j < count; j++) {
        const theta = (2 * Math.PI * j) / count;

        const x = ringRadius * Math.cos(theta);

        const z = ringRadius * Math.sin(theta);

        const dot = document.createElement("div");

        const depth = (z + RADIUS) / (2 * RADIUS);

        const scale = 0.5 + depth * 0.9;

        const opacity = 0.25 + depth * 0.75;

        const r = Math.round(140 + depth * 70);

        const g = Math.round(120 + depth * 130);

        const b = 255;

        dot.style.position = "absolute";

        dot.style.top = "50%";
        dot.style.left = "50%";

        dot.style.width = "3.5px";
        dot.style.height = "3.5px";

        dot.style.borderRadius = "50%";

        dot.style.margin = "-1.75px 0 0 -1.75px";

        dot.style.transform = `translate3d(${x}px, ${-y}px, ${z}px) scale(${scale})`;

        dot.style.opacity = opacity.toString();

        dot.style.background = `rgb(${r}, ${g}, ${b})`;

        sphereRef.current.appendChild(dot);
      }
    }
  }, []);

  // Toast feedback whenever the mic/stop button is tapped, mirroring the
  // reference design's "Starting Bharat AI…" bubble.
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setToastMsg("Starting Bharat AI…");
    toastTimerRef.current = setTimeout(() => setToastMsg(null), 2200);

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleEndTap = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
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
        bg-[#0b0b10]/95
        backdrop-blur-sm
      "
    >
      <style>{`
        .voice-card {
          width: 360px;
          background:
            linear-gradient(
              180deg,
              #14141c 0%,
              #0e0e15 100%
            );
          border: 1px solid #23232f;
          border-radius: 20px;
          padding: 24px 24px 32px;
          box-sizing: border-box;
          box-shadow:
            0 20px 60px
            rgba(0,0,0,0.5);
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
          box-shadow: 0 0 8px 2px rgba(139,123,255,0.7);
          animation: voice-dot-pulse 1.6s ease-in-out infinite;
        }

        @keyframes voice-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .voice-close {
          color: #6b6b7a;
          transition: color 0.15s ease;
        }

        .voice-close:hover {
          color: #f2f2f5;
        }

        .voice-stage {
          position: relative;
          width: 100%;
          height: 260px;
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
          background: radial-gradient(circle at 35% 30%, #9b8bff, #6c56f5 60%, #4a37c9 100%);
          box-shadow: 0 0 0 6px rgba(139,123,255,0.12), 0 8px 24px rgba(108,86,245,0.45);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .voice-mic-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 0 8px rgba(139,123,255,0.18), 0 10px 28px rgba(108,86,245,0.55);
        }

        .voice-mic-btn:active {
          transform: scale(0.96);
        }

        .voice-mic-btn.voice-pulse {
          animation: voice-pulse-animation 1.5s ease-in-out infinite;
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
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .voice-toast.show {
          opacity: 1;
          transform: translate(-50%, -14px);
        }
      `}</style>

      <div className="voice-card" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}

        <div className="voice-header">
          <div>
            <p className="voice-eyebrow">Voice mode</p>
            <h2 className="voice-title">Bharat AI</h2>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="voice-live">
              <span className="voice-live-dot" />
              Live
            </div>

            <button
              onClick={onClose}
              className="voice-close"
              aria-label="Close voice mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SPHERE */}

        <div className="voice-stage">
          <div
            ref={sphereRef}
            className={`
              voice-sphere
              ${isListening || isSpeaking ? "voice-pulse" : ""}
            `}
          />
        </div>

        <p className="voice-caption">{statusLabel}</p>

        {/* END CALL BUTTON */}

        <div className="voice-btn-wrap">
          <button
            type="button"
            onClick={handleEndTap}
            className={`
              voice-mic-btn
              ${isListening || isSpeaking ? "voice-pulse" : ""}
            `}
            title="End voice conversation"
            aria-label="End voice conversation"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>

          <div className={`voice-toast ${toastMsg ? "show" : ""}`}>
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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "Hey Bharat! 👋\nI'm Bharat AI — your personal AI assistant.\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

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
     REAL VOICE CONVERSATION MODE
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
     SPEAK RESPONSE
  ========================================================== */

  const speakResponse = (text: string, continueConversation = false) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[\*#_\`]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    if (!cleanText) {
      if (continueConversation) {
        startConversationListening();
      }

      return;
    }

    const speak = () => {
      const voices = window.speechSynthesis.getVoices();

      /*
       * MALE VOICE NAME HINTS
       *
       * The Web Speech API doesn't expose a
       * reliable "gender" field in most browsers,
       * so we match on common male voice names
       * shipped by Chrome/Edge/Safari platforms.
       */
      const maleNameHints = [
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
      ];

      const isMaleByName = (voice: SpeechSynthesisVoice) =>
        maleNameHints.some((hint) => voice.name.toLowerCase().includes(hint));

      const indianMaleVoice = voices.find(
        (voice) =>
          voice.lang.toLowerCase().includes("en-in") && isMaleByName(voice),
      );

      const englishMaleVoice = voices.find(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en") && isMaleByName(voice),
      );

      const indianVoice = voices.find((voice) =>
        voice.lang.toLowerCase().includes("en-in"),
      );

      const englishVoice = voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en"),
      );

      const selectedVoice =
        indianMaleVoice || englishMaleVoice || indianVoice || englishVoice;

      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.lang = "en-IN";
      utterance.rate = 1;
      utterance.pitch = 0.85;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);

        /*
         * IMPORTANT:
         *
         * If conversation mode is active,
         * automatically start listening again.
         */

        if (continueConversation && conversationModeRef.current) {
          setTimeout(() => {
            startConversationListening();
          }, 350);
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);

        if (continueConversation && conversationModeRef.current) {
          setTimeout(() => {
            startConversationListening();
          }, 350);
        }
      };

      window.speechSynthesis.speak(utterance);
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
     SEND MESSAGE
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

    /* --------------------------------------------------------
       USER MESSAGE
    -------------------------------------------------------- */

    const newUserMsg: Message = {
      id: Date.now().toString(),

      role: "user",

      content: text,

      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMsg]);

    setInputValue("");

    setIsLoading(true);

    try {
      /* ------------------------------------------------------
         BACKEND
      ------------------------------------------------------ */

      const response = await fetch("http://127.0.0.1:8001/ask", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question: text,

          /*
           * Backend can ignore this for now.
           * We send it so later you can
           * support special voice handling.
           */
          voice: fromVoice,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      const answer = data.answer || "I couldn't generate a response right now.";

      /* ------------------------------------------------------
         AI MESSAGE
      ------------------------------------------------------ */

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),

        role: "ai",

        content: answer,

        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newAiMsg]);

      /* ------------------------------------------------------
         VOICE RESPONSE
      ------------------------------------------------------ */

      if (fromVoice || conversation) {
        setTimeout(() => {
          speakResponse(answer, conversation);
        }, 100);
      }
    } catch (error) {
      console.error("Bharat AI error:", error);

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),

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

    /* --------------------------------------------------------
       RESULT
    -------------------------------------------------------- */

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

      /* ----------------------------------------------------
           NORMAL MICROPHONE
        ---------------------------------------------------- */

      if (finalTranscript.trim() && !conversationModeRef.current) {
        voiceInputRef.current = true;

        setTimeout(() => {
          sendMessage(finalTranscript.trim(), true, false);
        }, 250);
      }

      /* ----------------------------------------------------
           REAL VOICE CONVERSATION
        ---------------------------------------------------- */

      if (finalTranscript.trim() && conversationModeRef.current) {
        setInputValue("");

        sendMessage(finalTranscript.trim(), true, true);
      }
    };

    /* --------------------------------------------------------
       START
    -------------------------------------------------------- */

    recognition.onstart = () => {
      setIsListening(true);
    };

    /* --------------------------------------------------------
       END
    -------------------------------------------------------- */

    recognition.onend = () => {
      setIsListening(false);

      /*
       * Do NOT automatically restart here.
       *
       * In conversation mode we restart
       * after Bharat AI finishes speaking.
       */
    };

    /* --------------------------------------------------------
       ERROR
    -------------------------------------------------------- */

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
    } catch (error) {
      /*
       * SpeechRecognition throws
       * InvalidStateError if it is
       * already running.
       *
       * We simply ignore that case.
       */

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

  const UserInitialAvatar = () => (
    <div
      className="
          w-10
          h-10
          rounded-full
          bg-gradient-to-br
          from-[#3e3465]
          to-[#8e85a6]
          flex
          items-center
          justify-center
          shadow-sm
        "
    >
      <span
        className="
            text-white
            font-semibold
            text-sm
          "
      >
        B
      </span>
    </div>
  );

  const BotAvatar = () => (
    <div
      className="
          w-10
          h-10
          rounded-full
          bg-gradient-to-br
          from-[#eae5f2]
          to-[#d8d0e5]
          flex
          items-center
          justify-center
          border
          border-[#ddd6e8]
          shadow-sm
        "
    >
      <Bot
        className="
            w-5
            h-5
            text-[#5c4f78]
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
          bg-gradient-to-br
          from-[#3e3465]
          to-[#715c89]
          flex
          items-center
          justify-center
          shadow-sm
        "
    >
      <User
        className="
            w-4
            h-4
            text-white
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
        rounded-3xl
        bg-white
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          h-20
          border-b
          border-gray-100
          flex
          items-center
          justify-between
          px-6
          bg-white
          shrink-0
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <UserInitialAvatar />

          <div>
            <h1
              className="
                font-semibold
                text-gray-900
                text-[17px]
              "
            >
              Bharat AI
            </h1>

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Personal AI Assistant
            </p>
          </div>
        </div>

        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-1.5
              px-3
              py-1.5
              bg-[#eae5f2]
              text-[#716587]
              rounded-full
              text-sm
              font-medium
            "
          >
            <Bot className="w-4 h-4" />

            <span>Online</span>
          </div>

          <button
            type="button"
            className="
              text-gray-400
              hover:text-gray-600
            "
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ======================================================
          CHAT AREA
      ====================================================== */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-6
          py-6
          pb-28
          scroll-smooth
          bg-white
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
          <div
            className="
              h-px
              bg-gray-100
              flex-1
            "
          />

          <span
            className="
              px-4
              text-[13px]
              text-gray-400
              font-medium
            "
          >
            {todayDate}
          </span>

          <div
            className="
              h-px
              bg-gray-100
              flex-1
            "
          />
        </div>

        {/* MESSAGES */}

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
              className={`
                  flex
                  ${msg.role === "user" ? "justify-end" : "justify-start"}
                  w-full
                  group
                `}
            >
              {msg.role === "ai" && (
                <div
                  className="
                      mr-3
                      mt-1
                    "
                >
                  <BotAvatar />
                </div>
              )}

              <div
                className={`
                    flex
                    flex-col
                    ${msg.role === "user" ? "items-end" : "items-start"}
                    max-w-[75%]
                  `}
              >
                <div
                  className={`
                      px-5
                      py-4
                      ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-[#3e3465] to-[#715c89] text-white rounded-2xl rounded-tr-sm shadow-sm"
                          : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm"
                      }
                    `}
                >
                  <p
                    className="
                        text-[15px]
                        leading-relaxed
                        whitespace-pre-wrap
                      "
                  >
                    {msg.content}
                  </p>
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
                        text-[12px]
                        text-gray-400
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
                            text-gray-400
                            hover:text-[#5c4f78]
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
                            text-gray-400
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
                            text-gray-400
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

          {/* LOADING */}

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
                  bg-white
                  px-5
                  py-4
                  rounded-2xl
                  rounded-tl-sm
                  border
                  border-gray-200
                  shadow-sm
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

      {/* ======================================================
          INPUT
      ====================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          p-4
          bg-gradient-to-t
          from-white
          via-white
          to-transparent
          pt-10
          rounded-b-3xl
        "
      >
        <form
          onSubmit={handleSendMessage}
          className="
            max-w-3xl
            mx-auto
            bg-[#f0eff5]
            rounded-full
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
              text-[15px]
              text-gray-800
              placeholder:text-[#8e85a6]
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
                text-[#5c4f78]
                hover:text-red-500
              "
              title="Stop speaking"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          )}

          {/* ==================================================
              TEXT SEND
          ================================================== */}

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
            /* =================================================
               REAL VOICE MODE BUTTON
            ================================================= */

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
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-[#a699c2] hover:bg-[#8e85a6]"
                }
                text-white
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
                <PhoneOff
                  className="
                    w-5
                    h-5
                  "
                />
              ) : (
                <Phone
                  className="
                    w-5
                    h-5
                  "
                />
              )}
            </button>
          )}
        </form>

        {/* ====================================================
            MODE INFORMATION
        ==================================================== */}

        <p
          className="
            text-center
            text-[11px]
            text-gray-400
            mt-2
          "
        >
          {isConversationMode
            ? "Voice conversation active • Tap red button to end"
            : "Bharat AI can make mistakes. Verify important information."}
        </p>
      </div>

      {/* ======================================================
          VOICE CONVERSATION WINDOW
      ====================================================== */}

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
