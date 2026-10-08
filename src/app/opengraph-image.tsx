import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const runtime = "edge";
export const alt = "solarquack · Jeel Nada Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#070706",
          color: "#E9E3D2",
          fontFamily: "serif",
          border: "2px solid rgba(233,227,210,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: "#E5381B",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 16,
                letterSpacing: "0.1em",
                color: "#E9E3D2",
                textTransform: "uppercase",
              }}
            >
              SOLARQUACK // SYSTEM DOSSIER
            </span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 14, color: "#8C8778" }}>
            BENGALURU, IN · 2026
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h1
            style={{
              fontSize: 84,
              fontWeight: 300,
              letterSpacing: "-0.04em",
              margin: 0,
              lineHeight: 0.9,
              color: "#E9E3D2",
            }}
          >
            {siteConfig.brand}
          </h1>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: "0.06em",
              color: "#8C8778",
              textTransform: "uppercase",
              marginTop: 16,
            }}
          >
            {siteConfig.legalName} · {siteConfig.role}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(233,227,210,0.2)",
            paddingTop: 24,
            fontFamily: "monospace",
            fontSize: 14,
            color: "#8C8778",
          }}
        >
          <span>BUILT WITH STRENGTH. SHIPPED WITH TASTE.</span>
          <span style={{ color: "#E5381B" }}>ΙΣΧΥΣ ΚΑΙ ΤΕΧΝΗ</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
