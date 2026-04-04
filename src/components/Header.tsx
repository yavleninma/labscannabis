"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  defaultLocale,
  getLocaleDirection,
  isValidLocale,
  localeDefinitions,
  primaryLocaleCodes,
  secondaryLocaleCodes,
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
  const [pendingLocale, setPendingLocale] = useState<AppLocale | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const localeValue = useLocale();
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const isRtl = getLocaleDirection(locale) === "rtl";
  const tHeader = useTranslations("header");
  const pathname = usePathname() || "/";
  const router = useRouter();
  const searchParams = useSearchParams();
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const deferredSearchValue = useDeferredValue(searchValue.trim().toLowerCase());

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

  const filteredSecondaryLocales = useMemo(() => {
    if (!deferredSearchValue) {
      return secondaryLocaleCodes;
    }

    return secondaryLocaleCodes.filter((candidateLocale) => {
      const definition = localeDefinitions[candidateLocale];
      const haystack = `${definition.nativeLabel} ${definition.englishLabel} ${candidateLocale}`
        .toLowerCase();

      return haystack.includes(deferredSearchValue);
    });
  }, [deferredSearchValue]);

  function switchLocale(nextLocale: AppLocale) {
    if (nextLocale === locale || isPending) {
      return;
    }

    const query = searchParams.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const localizedPathname = buildLocalizedPathname(pathname, nextLocale);
    const href = `${localizedPathname}${query ? `?${query}` : ""}${hash}`;

    setPendingLocale(nextLocale);
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

          <div ref={pickerRef} className="relative flex items-center gap-1 text-[11px] sm:text-xs">
            <div className="hidden items-center gap-1 sm:flex">
              {primaryLocaleCodes.map((primaryLocale) => (
                <button
                  key={primaryLocale}
                  type="button"
                  onClick={() => switchLocale(primaryLocale)}
                  disabled={isPending}
                  aria-busy={isPending}
                  aria-current={locale === primaryLocale ? "page" : undefined}
                  className={`rounded-full px-2.5 py-1.5 transition-colors disabled:cursor-not-allowed ${
                    locale === primaryLocale
                      ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-600"
                      : "text-text-muted hover:text-text-secondary"
                  } ${pendingLocale === primaryLocale && isPending ? "animate-pulse" : ""}`}
                >
                  {primaryLocale.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsPickerOpen((value) => !value)}
              disabled={isPending}
              aria-expanded={isPickerOpen}
              aria-label={tHeader("allLanguages")}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${
                isPickerOpen
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                  : "border-border bg-bg-card text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className="hidden sm:inline">{currentLocaleDefinition.nativeLabel}</span>
              <span className="sm:hidden">{locale.toUpperCase()}</span>
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
                className="absolute top-[calc(100%+0.75rem)] z-50 w-[min(88vw,20rem)] overflow-hidden rounded-2xl border border-border bg-bg-card/95 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                style={pickerPositionStyle}
              >
                <div className="mb-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
                    {tHeader("currentLanguage")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-text-primary">
                    {currentLocaleDefinition.nativeLabel}
                    <span className="ml-2 text-text-muted">
                      {currentLocaleDefinition.englishLabel}
                    </span>
                  </p>
                </div>

                <label className="mb-3 block">
                  <span className="sr-only">{tHeader("searchLanguages")}</span>
                  <input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder={tHeader("searchLanguages")}
                    className="w-full rounded-xl border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-emerald-500/40"
                  />
                </label>

                <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-text-muted">
                      {tHeader("menu")}
                    </p>
                    <div className="space-y-1">
                      {primaryLocaleCodes.map((primaryLocale) => {
                        const definition = localeDefinitions[primaryLocale];

                        return (
                          <button
                            key={primaryLocale}
                            type="button"
                            onClick={() => switchLocale(primaryLocale)}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                              primaryLocale === locale
                                ? "bg-emerald-500/12 text-emerald-700"
                                : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                            }`}
                          >
                            <span className="font-medium">{definition.nativeLabel}</span>
                            <span className="text-text-muted">{primaryLocale.toUpperCase()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-text-muted">
                      {tHeader("allLanguages")}
                    </p>
                    <div className="space-y-1">
                      {filteredSecondaryLocales.map((secondaryLocale) => {
                        const definition = localeDefinitions[secondaryLocale];

                        return (
                          <button
                            key={secondaryLocale}
                            type="button"
                            onClick={() => switchLocale(secondaryLocale)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-primary hover:text-text-primary"
                          >
                            <span className="min-w-0 text-left">
                              <span className="block truncate font-medium text-text-primary">
                                {definition.nativeLabel}
                              </span>
                              <span className="block truncate text-xs text-text-muted">
                                {definition.englishLabel}
                              </span>
                            </span>
                            <span className="ml-3 shrink-0 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                              {secondaryLocale}
                            </span>
                          </button>
                        );
                      })}
                      {filteredSecondaryLocales.length === 0 && (
                        <p className="rounded-xl border border-dashed border-border px-3 py-4 text-sm text-text-muted">
                          {tHeader("searchLanguages")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
