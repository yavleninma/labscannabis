"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const faqKeys = ["1", "2", "3", "4", "5", "6", "7"] as const;

export function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("title")}
        </h2>

        <div className="space-y-2">
          {faqKeys.map((key, i) => {
            const isOpen = openIndex === i;
            const questionId = `faq-question-${key}`;
            const panelId = `faq-panel-${key}`;
            return (
              <div
                key={key}
                className="bg-bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-text-primary">
                    {t(`q${key}`)}
                  </span>
                  <svg
                    className={`w-4 h-4 shrink-0 text-text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={questionId}
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                    {t(`a${key}`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
