export const WHATSAPP_TRACKING_SOURCES = [
  "hero",
  "sticky_cta",
  "product_card",
  "strain_page",
  "wholesale_quote",
  "delivery",
  "map",
  "language",
  "seo_landing_page",
] as const;

export type WhatsAppTrackingSource = (typeof WHATSAPP_TRACKING_SOURCES)[number];

export const DEFAULT_WHATSAPP_TRACKING_SOURCE: WhatsAppTrackingSource = "seo_landing_page";

export type WhatsAppTrackingAttrs = {
  "data-track": string;
  "data-track-placement": WhatsAppTrackingSource;
  "data-track-detail": string;
  "data-whatsapp-source": WhatsAppTrackingSource;
  "data-source": WhatsAppTrackingSource;
  "data-utm-source": string;
  "data-utm-medium": string;
  "data-utm-campaign": string;
  "data-whatsapp-ref"?: string;
  "data-utm-content"?: string;
};

export type WhatsAppTrackingOptions = {
  source: WhatsAppTrackingSource;
  ref?: string;
  detail?: string;
  eventName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
};

export function whatsappTrackingAttrs(options: WhatsAppTrackingOptions): WhatsAppTrackingAttrs {
  const detail = options.detail ?? `${options.source}:${options.ref ?? "whatsapp"}`;
  const attrs: WhatsAppTrackingAttrs = {
    "data-track": options.eventName ?? "contact_whatsapp_click",
    "data-track-placement": options.source,
    "data-track-detail": detail,
    "data-whatsapp-source": options.source,
    "data-source": options.source,
    "data-utm-source": options.utmSource ?? "labscannabis_site",
    "data-utm-medium": options.utmMedium ?? "whatsapp_cta",
    "data-utm-campaign": options.utmCampaign ?? options.source,
  };

  if (options.ref) attrs["data-whatsapp-ref"] = options.ref;
  const utmContent = options.utmContent ?? options.ref;
  if (utmContent) attrs["data-utm-content"] = utmContent;

  return attrs;
}

export function whatsappLinkProps(href: string, options: WhatsAppTrackingOptions) {
  return {
    href,
    target: "_blank",
    rel: "noopener noreferrer",
    ...whatsappTrackingAttrs(options),
  };
}
