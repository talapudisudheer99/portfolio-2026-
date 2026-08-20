import { ImageResponse } from "next/og"

import { siteConfig } from "@/data/site"

export const alt = siteConfig.contact.name
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

/** iOS touch icon — molten metal mark matching the nav logo. */
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 132,
            height: 132,
            borderRadius: 999,
            background: "linear-gradient(135deg, #8b6914 0%, #d4a024 48%, #f0d060 100%)",
            color: "#000000",
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
          }}
        >
          S
          <div
            style={{
              width: 12,
              height: 12,
              marginLeft: 2,
              marginTop: 28,
              borderRadius: 999,
              background: "#000000",
              opacity: 0.55,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
