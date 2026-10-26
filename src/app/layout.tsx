import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Michroma } from "next/font/google"

import { MotionRoot } from "@/components/motion"
import { PaletteInitScript } from "@/components/palette-init-script"
import { PaletteProvider } from "@/components/palette-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { createJsonLd, createSiteMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"

import "./globals.css"

/** Aerospace HUD display — Eurostile/Microgramma lineage (SpaceX-style panels). */
const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  // Only used for small below-the-fold labels; skip the render-blocking preload.
  preload: false,
})

export const metadata: Metadata = createSiteMetadata()

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "dark",
        michroma.variable,
        inter.variable,
        jetbrainsMono.variable
      )}
    >
      <head>
        <PaletteInitScript />
        {/* Reload always starts at the hero (deep links with #hash still work). */}
        <script
          id="portfolio-scroll-top"
          dangerouslySetInnerHTML={{
            __html:
              "try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(!location.hash)window.scrollTo(0,0)}catch(e){}",
          }}
        />
        {/* crossOrigin matches three.js TextureLoader — otherwise the browser downloads it twice. */}
        <link
          rel="preload"
          href="/moon/color-1k.jpg"
          as="image"
          type="image/jpeg"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/space/astronaut.png"
          as="image"
          type="image/png"
          crossOrigin="anonymous"
          media="(min-width: 1024px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(createJsonLd()),
          }}
        />
      </head>
      <body className="min-h-svh font-sans antialiased">
        <ThemeProvider>
          <PaletteProvider>
            <MotionRoot>{children}</MotionRoot>
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
