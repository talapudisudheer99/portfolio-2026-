import type { Metadata } from "next"
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google"

import { MotionRoot } from "@/components/motion"
import { PaletteProvider } from "@/components/palette-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { createSiteMetadata } from "@/lib/metadata"
import { cn } from "@/lib/utils"

import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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
        fraunces.variable,
        manrope.variable,
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
