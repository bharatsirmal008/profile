"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Paperclip,
  Send,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Mic,
} from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
};

export function Assistant() {
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

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; 
        recognitionRef.current.interimResults = true;

        let finalTranscript = "";

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = "";
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          // Update the chatbox input with what the user said
          setInputValue(finalTranscript + interimTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "network") {
            alert("Network error: Speech recognition requires an active internet connection or is blocked by your browser.");
          }
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("https://personal-ai-assistant-production-e4a6.up.railway.app/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: newUserMsg.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content:
          data.answer || "I couldn't generate a response right now.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newAiMsg]);
    } catch (error) {
      console.error("Error communicating with AI:", error);

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
    } finally {
      setIsLoading(false);
    }
  };

  /* --------------------------------
     Bharat Profile Avatar
  -------------------------------- */

  const UserInitialAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3e3465] to-[#8e85a6] flex items-center justify-center shadow-sm">
      <span className="text-white font-semibold text-sm">B</span>
    </div>
  );

  /* --------------------------------
     Bharat AI Avatar
  -------------------------------- */

  const BotAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#eae5f2] to-[#d8d0e5] flex items-center justify-center border border-[#ddd6e8] shadow-sm">
      <Bot className="w-5 h-5 text-[#5c4f78]" />
    </div>
  );

  /* --------------------------------
     Small User Avatar
  -------------------------------- */

  const UserSmallAvatar = () => (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3e3465] to-[#715c89] flex items-center justify-center shadow-sm">
      <User className="w-4 h-4 text-white" />
    </div>
  );

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white">

      {/* =========================
          HEADER
      ========================== */}

      <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">

        <div className="flex items-center gap-3">
          <UserInitialAvatar />

          <div>
            <h1 className="font-semibold text-gray-900 text-[17px]">
              Bharat AI
            </h1>

            <p className="text-xs text-gray-400">
              Personal AI Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eae5f2] text-[#716587] rounded-full text-sm font-medium">
            <Bot className="w-4 h-4" />
            <span>Online</span>
          </div>

          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

        </div>
      </div>

      {/* =========================
          CHAT AREA
      ========================== */}

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 scroll-smooth bg-white">

        {/* Date Separator */}

        <div className="flex items-center justify-center my-6">

          <div className="h-px bg-gray-100 flex-1" />

          <span className="px-4 text-[13px] text-gray-400 font-medium tracking-wide">
            {todayDate}
          </span>

          <div className="h-px bg-gray-100 flex-1" />

        </div>

        <div className="space-y-6">

          {messages.map((msg) => (

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              } w-full group`}
            >

              {/* AI Avatar */}

              {msg.role === "ai" && (
                <div className="mr-3 mt-1">
                  <BotAvatar />
                </div>
              )}

              <div
                className={`flex flex-col ${
                  msg.role === "user"
                    ? "items-end"
                    : "items-start"
                } max-w-[75%]`}
              >

                {/* Message */}

                <div
                  className={`px-5 py-4 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#3e3465] to-[#715c89] text-white rounded-2xl rounded-tr-sm shadow-sm"
                      : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm"
                  }`}
                >

                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>

                </div>

                {/* Timestamp */}

                <div className="flex items-center gap-4 mt-2 px-1">

                  <span className="text-[12px] text-gray-400 font-medium">
                    {msg.timestamp}
                  </span>

                  {msg.role === "ai" && (
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">

                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  )}

                </div>

              </div>

              {/* User Avatar */}

              {msg.role === "user" && (
                <div className="ml-3 mt-1">
                  <UserSmallAvatar />
                </div>
              )}

            </motion.div>

          ))}

          {/* =========================
              AI TYPING INDICATOR
          ========================== */}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start w-full"
            >

              <div className="mr-3 mt-1">
                <BotAvatar />
              </div>

              <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm flex items-center gap-2 h-[56px]">

                <div className="flex gap-1.5">

                  <div className="w-2 h-2 bg-[#8e85a6] rounded-full animate-bounce [animation-delay:-0.3s]" />

                  <div className="w-2 h-2 bg-[#8e85a6] rounded-full animate-bounce [animation-delay:-0.15s]" />

                  <div className="w-2 h-2 bg-[#8e85a6] rounded-full animate-bounce" />

                </div>

              </div>

            </motion.div>
          )}

          <div ref={messagesEndRef} />

        </div>
      </div>

      {/* =========================
          INPUT AREA
      ========================== */}

      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-white via-white to-transparent pt-10 rounded-b-3xl">

        <form
          onSubmit={handleSendMessage}
          className="max-w-3xl mx-auto bg-[#f0eff5] rounded-full px-2 py-2 flex items-center transition-all focus-within:ring-2 focus-within:ring-[#8e85a6]/30"
        >

          {/* Attachment */}

          <button
            type="button"
            className="p-2 text-[#8e85a6] hover:text-[#4a3b69] transition-colors ml-2"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Voice Input */}

          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 transition-colors ml-1 ${
              isListening
                ? "text-red-500 animate-pulse"
                : "text-[#8e85a6] hover:text-[#4a3b69]"
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Input */}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Bharat AI anything..."
            className="flex-1 bg-transparent text-[15px] text-gray-800 placeholder:text-[#8e85a6] outline-none px-3"
          />

          {/* Send */}

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 bg-[#a699c2] hover:bg-[#8e85a6] disabled:bg-[#d5d0df] disabled:cursor-not-allowed text-white rounded-full transition-all flex items-center justify-center shrink-0 mr-1"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>

        </form>

        <p className="text-center text-[11px] text-gray-400 mt-2">
          Bharat AI can make mistakes. Verify important information.
        </p>

      </div>

    </div>
  );
}

