import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-bg-card border-t border-border py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div>
          <span className="text-xl font-bold">
            <span className="text-emerald-500">Labs</span> Cannabis
          </span>
          <p className="text-sm text-text-muted mt-1">{t("medical")}</p>
        </div>

        <p className="text-xs text-text-muted max-w-2xl mx-auto leading-relaxed">
          {t("disclaimer")}
        </p>

        <p className="text-xs text-text-muted">{t("copyright")}</p>
      </div>
    </footer>
  );
}
