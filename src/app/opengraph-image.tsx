import { ImageResponse } from "next/og"

import { siteConfig } from "@/data/site"

export const alt = `${siteConfig.contact.name} — Frontend engineer who shipped Sameward`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  const { contact, metadata, hero } = siteConfig
  const headline = hero.headline.map((part) => part.text).join(" ")
  const tagline = Array.isArray(hero.tagline)
    ? hero.tagline.join(" ")
    : hero.tagline

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          background: "#000000",
          color: "#eceae5",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid #28220e",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#d4a024",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>ST · PORTFOLIO</span>
          <span>{hero.availability.toUpperCase()}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#f0d060",
            }}
          >
            {contact.name}
          </div>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.25,
              color: "#eceae5",
              maxWidth: 980,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#9a9178",
              lineHeight: 1.5,
              maxWidth: 920,
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#8b6914",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>{contact.location}</span>
          <span>{metadata.siteName}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
