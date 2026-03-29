import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const alt = "Labs Cannabis — Cannabis Shop in Pattaya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Green dot + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#34d399",
            }}
          />
          <span
            style={{
              color: "#34d399",
              fontSize: "18px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
            }}
          >
            Licensed Cannabis Dispensary · Pattaya, Thailand
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "88px",
            fontWeight: "bold",
            lineHeight: 1.05,
            marginBottom: "28px",
            fontFamily: "Georgia, serif",
          }}
        >
          Labs Cannabis
        </div>

        {/* Subtitle from i18n */}
        <div
          style={{
            color: "#a3a3a3",
            fontSize: "26px",
            lineHeight: 1.4,
            maxWidth: "800px",
            fontFamily: "Georgia, serif",
          }}
        >
          {t("ogDescription")}
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            color: "#525250",
            fontSize: "18px",
            fontFamily: "Georgia, serif",
          }}
        >
          labscannabis.boutique
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
