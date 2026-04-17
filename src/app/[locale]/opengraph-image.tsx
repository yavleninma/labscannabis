import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const alt = "Labs Cannabis — Cannabis Shop in Pattaya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
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
          background: "linear-gradient(135deg, #0a1a0f 0%, #0d2218 50%, #0a1a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Green accent bar */}
        <div style={{ width: 80, height: 4, background: "#10b981", marginBottom: 32 }} />
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 80, fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>
            LABS
          </span>
          <span style={{ fontSize: 40, fontWeight: 500, color: "#10b981" }}>
            Cannabis
          </span>
        </div>
        {/* Tagline */}
        <div style={{ fontSize: 34, color: "#6ee7b7", marginBottom: 48, lineHeight: 1.3 }}>
          {t("ogTitle")}
        </div>
        {/* Location badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 12,
            padding: "14px 28px",
          }}
        >
          <div style={{ fontSize: 26, color: "#10b981" }}>📍</div>
          <div style={{ fontSize: 26, color: "#d1fae5" }}>
            Pattaya, Thailand · 5 min from Walking Street
          </div>
        </div>
        {/* Rating */}
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24, color: "#fbbf24" }}>★★★★★</span>
          <span style={{ fontSize: 22, color: "#a3a3a3" }}>4.8 on Google</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
