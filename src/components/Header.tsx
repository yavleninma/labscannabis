"use client";

import { useEffect, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { OpenIndicator } from "./OpenIndicator";
import { ThemeToggle } from "./ThemeToggle";

const locales = ["en", "ru", "th"] as const;

interface HeaderProps {
  openTime?: string;
  closeTime?: string;
  isOpen24h?: boolean;
}

export function Header({ openTime, closeTime, isOpen24h }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function switchLocale(newLocale: string) {
    if (newLocale === locale || isPending) {
      return;
    }

    setPendingLocale(newLocale);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as "en" | "ru" | "th" });
    });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/90 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 min-h-16 py-3 flex items-center justify-between gap-2">
        <a href={`/${locale}`} className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            LABS
          </span>
          <span className="text-emerald-500 text-sm sm:text-base font-medium">Cannabis</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <OpenIndicator openTime={openTime} closeTime={closeTime} isOpen24h={isOpen24h} />
          <ThemeToggle />
          <div className="flex items-center gap-0.5 sm:gap-1 text-[11px] sm:text-xs">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                disabled={isPending}
                aria-busy={isPending}
                className={`px-1.5 sm:px-2 py-1 rounded transition-colors disabled:cursor-not-allowed ${
                  locale === l
                    ? "bg-emerald-500/20 text-emerald-600"
                    : "text-text-muted hover:text-text-secondary"
                } ${isPending ? "opacity-70" : ""} ${
                  pendingLocale === l && isPending ? "animate-pulse" : ""
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
            {isPending && (
              <span className="ml-1 sm:ml-2 hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-emerald-600/90">
                <span className="h-2 w-2 rounded-full border border-emerald-600/80 border-t-transparent animate-spin" />
                {tHeader("switching")}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
