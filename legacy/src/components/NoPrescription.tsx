import { useTranslations } from "next-intl";

export function NoPrescription() {
  const t = useTranslations("noPrescription");

  const steps = [
    { num: "1", icon: "🚶", key: "step1" },
    { num: "2", icon: "📱", key: "step2" },
    { num: "3", icon: "✅", key: "step3" },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-bg-secondary border border-border rounded-2xl p-6 sm:p-10">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("title")}
          </h2>
          <p className="text-text-secondary mb-8 text-base sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {steps.map((step) => (
              <div key={step.key} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                    {step.num}
                  </span>
                  <span className="text-lg">{step.icon}</span>
                </div>
                <h3 className="font-semibold text-text-primary">
                  {t(`${step.key}Title`)}
                </h3>
                <p className="text-text-secondary text-sm">
                  {t(`${step.key}Desc`)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-emerald-400">
            <span>✓ {t("badge1")}</span>
            <span>✓ {t("badge2")}</span>
            <span>✓ {t("badge3")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
