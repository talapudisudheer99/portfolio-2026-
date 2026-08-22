"use client"

import dynamic from "next/dynamic"
import type { ReactNode } from "react"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { useDeferredLayer } from "@/hooks/use-deferred-layer"
import { siteConfig } from "@/data/site"

const AmbientAtmosphere = dynamic(
  () =>
    import("@/components/shared/blob-scene").then((m) => ({
      default: m.AmbientAtmosphere,
    })),
  { ssr: false }
)

const SpaceField = dynamic(
  () =>
    import("@/components/shared/space-field").then((m) => ({
      default: m.SpaceField,
    })),
  { ssr: false }
)

const CursorInteraction = dynamic(
  () =>
    import("@/components/shared/cursor").then((m) => ({
      default: m.CursorInteraction,
    })),
  { ssr: false }
)

const ScrollGrain = dynamic(
  () =>
    import("@/components/shared/parallax").then((m) => ({
      default: m.ScrollGrain,
    })),
  { ssr: false }
)

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false }
)

interface MotionRootProps {
  children: ReactNode
}

/**
 * World (moon + stars + props) mounts with the page so the hero tick
 * can run over the scene, not over empty black.
 */
export function MotionRoot({ children }: Readonly<MotionRootProps>) {
  const chrome = useDeferredLayer(240)

  return (
    <>
      {chrome ? <CursorInteraction /> : null}
      <SmoothScroll>
        <AmbientAtmosphere />
        <SpaceField />
        {chrome ? <ScrollGrain /> : null}
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
        {chrome ? <Toaster richColors position="top-right" /> : null}
      </SmoothScroll>
    </>
  )
}
