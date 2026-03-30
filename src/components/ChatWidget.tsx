"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const GREETINGS: Record<string, string> = {
  en: "Hey! 👋 What are you looking for?",
  ru: "Привет! 👋 Что ищешь?",
  th: "สวัสดี! 👋 กำลังมองหาอะไรอยู่?",
};

const PLACEHOLDERS: Record<string, string> = {
  en: "Type a message...",
  ru: "Напиши сюда...",
  th: "พิมพ์ที่นี่...",
};

const ERROR_MESSAGES: Record<string, string> = {
  en: "Something went wrong. Please try again.",
  ru: "Что-то пошло не так. Попробуй ещё раз.",
  th: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
};

export function ChatWidget({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greeting = GREETINGS[locale] ?? GREETINGS.en;
  const placeholder = PLACEHOLDERS[locale] ?? PLACEHOLDERS.en;

  // Set greeting on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: greeting }]);
    }
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen, greeting, messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || isLoading) return;

      const next: Message[] = [...messages, { role: "user", content: text }];
      setMessages(next);
      setInput("");
      setIsLoading(true);

      const errorMsg = ERROR_MESSAGES[locale] ?? ERROR_MESSAGES.en;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
        const data = (await res.json()) as { content?: string; error?: string };
        if (data.error) console.error("[chat api error]", data.error);
        const reply = data.content ?? errorMsg;
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        if (!isOpen) setHasUnread(true);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, isOpen],
  );

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: "min(360px, calc(100vw - 2rem))",
            height: "min(500px, calc(100dvh - 8rem))",
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Header */}
          <div
            className="flex shrink-0 items-center justify-between px-4 py-3"
            style={{ background: "#059669" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                🌿
              </div>
              <div>
                <p className="text-sm font-semibold leading-none text-white">Labs Cannabis</p>
                <p className="mt-0.5 text-xs leading-none" style={{ color: "rgba(255,255,255,0.75)" }}>
                  Pattaya
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ gap: "12px", display: "flex", flexDirection: "column" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "#059669", color: "#fff", borderBottomRightRadius: "4px" }
                      : {
                          background: "var(--color-bg-secondary)",
                          color: "var(--color-text-primary)",
                          borderBottomLeftRadius: "4px",
                        }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-1 rounded-2xl px-4 py-3"
                  style={{
                    background: "var(--color-bg-secondary)",
                    borderBottomLeftRadius: "4px",
                  }}
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="block h-2 w-2 rounded-full"
                      style={{
                        background: "var(--color-text-muted)",
                        animation: `bounce 1.2s ease-in-out ${delay}ms infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex shrink-0 items-center gap-2 px-3 py-3"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors disabled:opacity-50"
              style={{
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-40"
              style={{ background: "#059669" }}
              aria-label="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ background: "#059669" }}
        aria-label={isOpen ? "Close chat" : "Chat with us"}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            {hasUnread && (
              <span
                className="absolute right-1 top-1 flex h-3 w-3 items-center justify-center rounded-full"
                style={{ background: "#ef4444" }}
              />
            )}
          </>
        )}
      </button>
    </>
  );
}
