"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  defaultLocale,
  getLocaleDirection,
  isValidLocale,
  localeCodes,
  localeDefinitions,
  type AppLocale,
} from "@/i18n/config";
import { buildLocalizedPathname } from "@/i18n/pathnames";
import { OpenIndicator } from "./OpenIndicator";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  openTime?: string;
  closeTime?: string;
  isOpen24h?: boolean;
}

export function Header({ openTime, closeTime, isOpen24h }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const localeValue = useLocale();
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const isRtl = getLocaleDirection(locale) === "rtl";
  const tHeader = useTranslations("header");
  const pathname = usePathname() || "/";
  const router = useRouter();
  const searchParams = useSearchParams();
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isPickerOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (pickerRef.current?.contains(event.target as Node)) {
        return;
      }
      setIsPickerOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPickerOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPickerOpen]);

  function switchLocale(nextLocale: AppLocale) {
    if (nextLocale === locale || isPending) {
      return;
    }

    const query = searchParams.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const localizedPathname = buildLocalizedPathname(pathname, nextLocale);
    const href = `${localizedPathname}${query ? `?${query}` : ""}${hash}`;

    setIsPickerOpen(false);
    startTransition(() => {
      router.replace(href);
    });
  }

  const currentLocaleDefinition = localeDefinitions[locale];
  const pickerPositionStyle = isRtl ? { left: 0 } : { right: 0 };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-bg-primary/90 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex min-h-16 items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <a href={`/${locale}`} className="flex shrink-0 items-center gap-1.5">
          <span
            className="text-xl font-bold tracking-tight sm:text-2xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            LABS
          </span>
          <span className="text-sm font-medium text-emerald-500 sm:text-base">Cannabis</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <OpenIndicator openTime={openTime} closeTime={closeTime} isOpen24h={isOpen24h} />
          <ThemeToggle />

          <div ref={pickerRef} className="relative text-[11px] sm:text-xs">
            <button
              type="button"
              onClick={() => setIsPickerOpen((value) => !value)}
              disabled={isPending}
              aria-expanded={isPickerOpen}
              aria-label={tHeader("currentLanguage")}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm ring-1 transition-colors ${
                isPickerOpen
                  ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25"
                  : "bg-bg-card/90 text-text-secondary ring-border/50 hover:text-text-primary"
              }`}
            >
              <span className="max-w-[8.5rem] truncate">{currentLocaleDefinition.nativeLabel}</span>
              <svg
                className={`h-3.5 w-3.5 transition-transform ${isPickerOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isPending && (
              <span className="hidden items-center gap-1 text-[10px] uppercase tracking-wide text-emerald-600/90 sm:inline-flex">
                <span className="h-2 w-2 animate-spin rounded-full border border-emerald-600/80 border-t-transparent" />
                {tHeader("switching")}
              </span>
            )}

            {isPickerOpen && (
              <div
                className="absolute top-[calc(100%+0.55rem)] z-50 w-[min(88vw,16rem)] overflow-hidden rounded-[1.5rem] bg-bg-card/95 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.18)] ring-1 ring-border/50 backdrop-blur-xl"
                style={pickerPositionStyle}
              >
                <div className="space-y-1">
                  {localeCodes.map((candidateLocale) => {
                    const definition = localeDefinitions[candidateLocale];
                    const isActive = candidateLocale === locale;

                    return (
                      <button
                        key={candidateLocale}
                        type="button"
                        onClick={() => switchLocale(candidateLocale)}
                        className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "bg-emerald-500/12 text-emerald-700"
                            : "text-text-secondary hover:bg-emerald-500/[0.08] hover:text-text-primary"
                        }`}
                      >
                        <span className="min-w-0 text-left">
                          <span className={`block truncate font-medium ${isActive ? "text-emerald-700" : "text-text-primary"}`}>
                            {definition.nativeLabel}
                          </span>
                          <span className={`block truncate text-xs ${isActive ? "text-emerald-700/70" : "text-text-muted"}`}>
                            {definition.englishLabel}
                          </span>
                        </span>
                        <span className={`ml-3 shrink-0 text-[10px] uppercase tracking-[0.16em] ${isActive ? "text-emerald-700/70" : "text-text-muted"}`}>
                          {candidateLocale}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
