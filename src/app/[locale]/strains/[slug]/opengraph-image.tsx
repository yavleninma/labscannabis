import { ImageResponse } from "next/og";
import { getStrainBySlug } from "@/lib/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const typeLabels: Record<string, string> = {
  indica: "Indica",
  sativa: "Sativa",
  hybrid: "Hybrid",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const strain = await getStrainBySlug(slug);

  const name = strain?.name ?? "Cannabis Strain";
  const type = strain?.type ? typeLabels[strain.type] ?? strain.type : "";
  const thc =
    typeof strain?.thcPercent === "number"
      ? `THC ${strain.thcPercent}%`
      : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#34d399",
            }}
          />
          <span
            style={{
              color: "#34d399",
              fontSize: "18px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Labs Cannabis · Pattaya
          </span>
        </div>

        {/* Strain info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: name.length > 20 ? "64px" : "80px",
              fontWeight: "bold",
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {type && (
              <span
                style={{
                  color: "#a3a3a3",
                  fontSize: "28px",
                  textTransform: "capitalize",
                }}
              >
                {type}
              </span>
            )}
            {thc && (
              <span
                style={{
                  color: "#34d399",
                  fontSize: "28px",
                  fontWeight: "600",
                }}
              >
                {thc}
              </span>
            )}
            {strain?.pricePerGram && (
              <span
                style={{
                  color: "#525250",
                  fontSize: "24px",
                }}
              >
                ฿{strain.pricePerGram}/g
              </span>
            )}
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            color: "#525250",
            fontSize: "18px",
            letterSpacing: "0.05em",
          }}
        >
          labscannabis.boutique
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
