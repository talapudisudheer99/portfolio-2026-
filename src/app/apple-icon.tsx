import { ImageResponse } from "next/og"

import { siteConfig } from "@/data/site"

export const alt = siteConfig.contact.name
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

// iOS ignores SVG touch icons, so this mark is rendered as a PNG.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#101117",
        color: "#f2f1ed",
        fontSize: 118,
        fontWeight: 700,
        letterSpacing: "-0.05em",
      }}
    >
      S
      <div
        style={{
          width: 20,
          height: 20,
          marginLeft: 6,
          marginTop: 48,
          borderRadius: 999,
          background: "#cf5c63",
        }}
      />
    </div>,
    {
      ...size,
    }
  )
}
