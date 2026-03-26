import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16"
      aria-label="Labs Cannabis — Licensed Cannabis Dispensary Pattaya"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* TODO: Add logo image here */}
        <div
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
          role="img"
          aria-label="Labs Cannabis logo — cannabis dispensary Pattaya"
        >
          <span className="text-emerald-500 text-3xl font-bold">LC</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
          <span className="text-emerald-500">Labs</span> Cannabis
        </h1>

        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-4">
          {t("subtitle")}
        </p>

        <p className="text-sm text-text-muted mb-10">
          {t("tagline")}
        </p>

        <a
          href="https://maps.app.goo.gl/T67UqNDGdALMC1VZ8"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t("cta")}
        </a>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
