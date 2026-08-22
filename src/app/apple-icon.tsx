import { ImageResponse } from "next/og"

import { siteConfig } from "@/data/site"

export const alt = siteConfig.contact.name
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

/** iOS touch icon — HUD mark (black + molten gold), matches favicon / nav. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#000000",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 148,
            height: 148,
            borderRadius: 999,
            border: "6px solid #00d4ff",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            color: "#00d4ff",
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "0.08em",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          S
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
