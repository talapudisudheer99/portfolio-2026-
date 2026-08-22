"use client"

import type { ReactNode } from "react"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AmbientAtmosphere } from "@/components/shared/blob-scene"
import { CursorInteraction } from "@/components/shared/cursor"
import { ScrollGrain } from "@/components/shared/parallax"
import { SpaceField } from "@/components/shared/space-field"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Toaster } from "@/components/ui/sonner"
import { siteConfig } from "@/data/site"

interface MotionRootProps {
  children: ReactNode
}

/**
 * Global motion layer. Content stays separate from WebGL / scroll owners.
 * Navbar lives inside Lenis so it scrolls with the page.
 */
export function MotionRoot({ children }: Readonly<MotionRootProps>) {
  return (
    <>
      <CursorInteraction />
      <SmoothScroll>
        <AmbientAtmosphere />
        <SpaceField />
        <ScrollGrain />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          {siteConfig.labels.skipToContent}
        </a>
        <Navbar />
        <main id="main-content" className="relative z-[2]">
          {children}
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
      </SmoothScroll>
    </>
  )
}
