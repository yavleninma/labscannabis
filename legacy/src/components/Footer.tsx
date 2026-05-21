import { useLocale, useTranslations } from "next-intl";
import { getContactMessageLocale } from "@/i18n/config";
import { buildContactLinks } from "@/lib/contact-links";
import type { ShopSettings } from "@/lib/mock-data";
import { mockShopSettings } from "@/lib/mock-data";

interface FooterProps {
  shopSettings?: ShopSettings;
}

export function Footer({ shopSettings = mockShopSettings }: FooterProps) {
  const t = useTranslations("footer");
  const locale = useLocale();
  const links = buildContactLinks(shopSettings, getContactMessageLocale(locale), { kind: "general" });
  const lineHref = links.line || links.phone || "#";
  const whatsappHref = links.whatsapp || links.phone || "#";
  const telegramHref = links.telegram || links.phone || "#";
  const phoneHref = links.phone || "#";

  return (
    <footer className="border-t border-border py-8 px-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              LABS
            </span>
            <span className="text-emerald-500 text-sm font-medium">Cannabis</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={lineHref}
              target={lineHref.startsWith("http") ? "_blank" : undefined}
              rel={lineHref.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-text-muted hover:text-text-secondary transition-colors"
              aria-label="LINE"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
            </a>
            <a
              href={whatsappHref}
              target={whatsappHref.startsWith("http") ? "_blank" : undefined}
              rel={whatsappHref.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-text-muted hover:text-text-secondary transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href={telegramHref}
              target={telegramHref.startsWith("http") ? "_blank" : undefined}
              rel={telegramHref.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-text-muted hover:text-text-secondary transition-colors"
              aria-label="Telegram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
            <a href={phoneHref} className="text-text-muted hover:text-text-secondary transition-colors" aria-label="Phone">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.3 21 3 13.7 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="text-text-muted text-xs leading-relaxed max-w-2xl mx-auto">
            {t("disclaimer")}
          </p>
          <p className="text-text-muted text-xs mt-3">
            &copy; {new Date().getFullYear()} Labs Cannabis. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
