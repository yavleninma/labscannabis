import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    { num: "01", titleKey: "step1Title" as const, descKey: "step1Desc" as const },
    { num: "02", titleKey: "step2Title" as const, descKey: "step2Desc" as const },
    { num: "03", titleKey: "step3Title" as const, descKey: "step3Desc" as const },
    { num: "04", titleKey: "step4Title" as const, descKey: "step4Desc" as const },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28"
      aria-label="How to buy cannabis in Pattaya — medical dispensary process"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          <span className="text-emerald-500">{t("sectionTitle")}</span>
        </h2>
        <p className="text-text-secondary text-center mb-14 max-w-2xl mx-auto">
          {t("intro")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative bg-bg-card border border-border rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
            >
              <span className="text-5xl font-bold text-emerald-500/10 absolute top-4 right-4">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold mb-2 text-emerald-400">
                {t(step.titleKey)}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
