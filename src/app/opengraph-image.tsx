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
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "linear-gradient(135deg, #020617 0%, #1e1b4b 55%, #312e81 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            color: "#a5b4fc",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            ST
          </div>
          {hero.badge}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em" }}>
            {contact.name}
          </div>
          <div style={{ fontSize: 34, color: "#c7d2fe", fontWeight: 500 }}>
            {hero.role}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              lineHeight: 1.5,
              maxWidth: 900,
            }}
          >
            {metadata.description}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
