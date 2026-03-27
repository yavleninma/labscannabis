"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { OpenIndicator } from "./OpenIndicator";

const locales = ["en", "ru", "th"] as const;

interface HeaderProps {
  openTime?: string;
  closeTime?: string;
}

export function Header({ openTime, closeTime }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function switchLocale(newLocale: string) {
    router.replace(pathname, { locale: newLocale as "en" | "ru" | "th" });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href={`/${locale}`} className="flex items-center gap-1">
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            LABS
          </span>
          <span className="text-emerald-500 text-sm font-medium">Cannabis</span>
        </a>

        <div className="flex items-center gap-4">
          <OpenIndicator openTime={openTime} closeTime={closeTime} />
          <div className="flex items-center gap-1 text-xs">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`px-2 py-1 rounded transition-colors ${
                  locale === l
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
