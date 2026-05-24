"use client";

import { useEffect, useState } from "react";

interface StrainStickyCtaProps {
  href: string | null;
  priceLabel: string;
  thcLabel?: string | null;
  buttonLabel: string;
}

export function StrainStickyCta({
  href,
  priceLabel,
  thcLabel,
  buttonLabel,
}: StrainStickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > 420);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!href) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg-card/95 px-4 py-3 shadow-2xl backdrop-blur transition-transform sm:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">
            {priceLabel}
            {thcLabel ? ` · ${thcLabel}` : ""}
          </p>
        </div>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}
