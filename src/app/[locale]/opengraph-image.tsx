import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Labs Cannabis — Licensed Cannabis Dispensary in Pattaya";

// Keep a single Latin version across all locales to avoid bundling Thai/Cyrillic
// fonts into the edge runtime — OG images are mostly consumed by scrapers anyway.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111111 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: "1px solid #262626",
            borderRadius: 20,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 999,
            border: "2px solid #10b981",
            color: "#10b981",
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          LC
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: -1,
          }}
        >
          <span style={{ color: "#10b981" }}>Labs</span>
          <span style={{ color: "#ffffff" }}>&nbsp;Cannabis</span>
        </div>
        <div style={{ color: "#a3a3a3", fontSize: 28, marginBottom: 14 }}>
          Licensed Medical Cannabis Dispensary
        </div>
        <div
          style={{
            color: "#737373",
            fontSize: 22,
            marginBottom: 32,
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          Soi Hollywood, Pattaya — Walk-in, Pickup &amp; Delivery
        </div>
        <div
          style={{
            width: 220,
            height: 3,
            backgroundColor: "#10b981",
            opacity: 0.5,
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
