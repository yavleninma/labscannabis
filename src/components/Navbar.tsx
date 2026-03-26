"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const tLang = useTranslations("langSwitcher");
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: t("about") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "#location", label: t("location") },
    { href: "#contact", label: t("contact") },
  ];

  const locales = ["en", "ru", "th"] as const;

  function switchLocale(locale: "en" | "ru" | "th") {
    router.replace(pathname, { locale });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tight">
          <span className="text-emerald-500">Labs</span> Cannabis
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-emerald-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-1 ml-4 border-l border-border pl-4">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className="px-2 py-1 text-xs rounded text-text-secondary hover:text-emerald-400 hover:bg-bg-card transition-colors"
              >
                {tLang(locale)}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-text-secondary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg-secondary border-b border-border px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-text-secondary hover:text-emerald-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-border">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => {
                  switchLocale(locale);
                  setMenuOpen(false);
                }}
                className="px-3 py-1 text-sm rounded text-text-secondary hover:text-emerald-400 hover:bg-bg-card transition-colors"
              >
                {tLang(locale)}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
