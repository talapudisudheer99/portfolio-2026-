import { ImageResponse } from "next/og"

import { siteConfig } from "@/data/site"

export const alt = `${siteConfig.contact.name} — Frontend Engineer and Product Builder`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  const { contact, metadata, hero } = siteConfig

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px",
        background: "#fafaf7",
        color: "#0f0f0f",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: 26,
          color: "#8e2b3a",
          fontWeight: 600,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "#8e2b3a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "#fafaf7",
          }}
        >
          ST
        </div>
        {hero.badge}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{ fontSize: 80, fontWeight: 500, letterSpacing: "-0.04em" }}
        >
          {contact.name}
        </div>
        <div style={{ fontSize: 40, color: "#8e2b3a", fontWeight: 500, letterSpacing: "-0.04em" }}>
          {`${hero.kicker}. ${hero.headline.map((part) => part.text).join(" ")}`}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#5a5750",
            lineHeight: 1.65,
            maxWidth: 900,
          }}
        >
          {metadata.description}
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
