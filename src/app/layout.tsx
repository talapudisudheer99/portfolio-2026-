import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google"

import { MotionRoot } from "@/components/motion"
import { PaletteProvider } from "@/components/palette-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { createSiteMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"

import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
        spaceGrotesk.variable,
        inter.variable,
        jetbrainsMono.variable
      )}
    >
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
