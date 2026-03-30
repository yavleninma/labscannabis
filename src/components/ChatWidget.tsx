"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ContactCard } from "@/app/api/chat/route";

type Message = {
  role: "user" | "assistant";
  content: string;
  contacts?: ContactCard[];
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

const LABEL_TEXTS: Record<string, string> = {
  en: "Looking for something? 👋",
  ru: "Ищешь что-то? 👋",
  th: "กำลังหาอะไรอยู่? 👋",
};

// --- Contact icon SVGs (same as ContactSection) ---

function ContactIcon({ type }: { type: ContactCard["icon"] }) {
  if (type === "whatsapp") {
    return (
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  }
  if (type === "telegram") {
    return (
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    );
  }
  if (type === "line") {
    return (
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.066-.022.137-.033.194-.033.195 0 .375.104.515.254l2.449 3.32V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    );
  }
  // phone
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

// --- Main component ---

export function ChatWidget({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greeting = GREETINGS[locale] ?? GREETINGS.en;
  const placeholder = PLACEHOLDERS[locale] ?? PLACEHOLDERS.en;
  const labelText = LABEL_TEXTS[locale] ?? LABEL_TEXTS.en;

  // Show label after 2.5s
  useEffect(() => {
    const t = setTimeout(() => setShowLabel(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Greeting on first open, hide label
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: greeting }]);
    }
    if (isOpen) {
      setHasUnread(false);
      setShowLabel(false);
    }
  }, [isOpen, greeting, messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input
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
          body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
        });
        const data = (await res.json()) as { content?: string; contacts?: ContactCard[]; error?: string };
        if (data.error) console.error("[chat api error]", data.error);
        const reply = data.content ?? errorMsg;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply, contacts: data.contacts?.length ? data.contacts : undefined },
        ]);
        if (!isOpen) setHasUnread(true);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, isOpen, locale],
  );

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            width: "min(360px, calc(100vw - 2rem))",
            height: "min(520px, calc(100dvh - 8rem))",
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-4 py-3" style={{ background: "#059669" }}>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-sm" style={{ background: "rgba(255,255,255,0.2)" }}>
                🌿
              </div>
              <div>
                <p className="text-sm font-semibold leading-none text-white">Labs Cannabis</p>
                <p className="mt-0.5 text-xs leading-none" style={{ color: "rgba(255,255,255,0.75)" }}>Pattaya</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ gap: "12px", display: "flex", flexDirection: "column" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                  className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "#059669", color: "#fff", borderBottomRightRadius: "4px" }
                      : { background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", borderBottomLeftRadius: "4px" }
                  }
                >
                  {msg.content}
                </div>

                {/* Contact buttons */}
                {msg.role === "assistant" && msg.contacts && msg.contacts.length > 0 && (
                  <div className="mt-2 flex w-full max-w-[82%] flex-col gap-1.5">
                    {msg.contacts.map((card) => (
                      <a
                        key={card.icon}
                        href={card.url}
                        target={card.url.startsWith("http") ? "_blank" : undefined}
                        rel={card.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 active:opacity-75"
                        style={{ background: card.color }}
                      >
                        <ContactIcon type={card.icon} />
                        {card.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl px-4 py-3" style={{ background: "var(--color-bg-secondary)", borderBottomLeftRadius: "4px" }}>
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} className="block h-2 w-2 rounded-full" style={{ background: "var(--color-text-muted)", animation: `bounce 1.2s ease-in-out ${delay}ms infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex shrink-0 items-center gap-2 px-3 py-3" style={{ borderTop: "1px solid var(--color-border)" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors disabled:opacity-50"
              style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-40"
              style={{ background: "#059669" }}
              aria-label="Send"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Label bubble */}
      {!isOpen && showLabel && (
        <div
          className="fixed bottom-7 right-20 z-50 flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-lg"
          style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)", animation: "slideInLabel 0.3s ease-out" }}
        >
          <span className="whitespace-nowrap text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
            {labelText}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); setShowLabel(false); }}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-xs"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ background: "#059669", animation: !isOpen ? "chatPulse 2.5s ease-in-out infinite" : undefined }}
        aria-label={isOpen ? "Close chat" : "Chat with us"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {hasUnread && (
              <span className="absolute right-1 top-1 flex h-3 w-3 items-center justify-center rounded-full" style={{ background: "#ef4444" }} />
            )}
          </>
        )}
      </button>
    </>
  );
}
