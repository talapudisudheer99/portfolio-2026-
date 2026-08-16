import { ImageResponse } from "next/og"

import { siteConfig } from "@/data/site"

export const alt = `${siteConfig.contact.name} — Frontend Engineer`
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
        background: "#f3f0e8",
        color: "#171612",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: 26,
          color: "#d94b2b",
          fontWeight: 600,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "#d94b2b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "#fffaf2",
          }}
        >
          ST
        </div>
        {hero.badge}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{ fontSize: 78, fontWeight: 800, letterSpacing: "-0.055em" }}
        >
          {contact.name}
        </div>
        <div style={{ fontSize: 42, color: "#d94b2b", fontWeight: 600 }}>
          Frontend engineer. Full product thinker.
        </div>
        <div
          style={{
            fontSize: 26,
            color: "#6e685e",
            lineHeight: 1.5,
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
