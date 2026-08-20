"use client"

import { ReactLenis, useLenis } from "lenis/react"
import { useEffect, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"
import { scrollFeel } from "@/lib/motion"
import { bindLenisToScrollTrigger } from "@/lib/motion/scroll"

function LenisGsapSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    return bindLenisToScrollTrigger(lenis)
  }, [lenis])

  return null
}

interface SmoothScrollProps {
  children: ReactNode
}

/**
 * Phase 09 Task 2 — one global Lenis instance + ScrollTrigger sync.
 * Authored feel: smooth / physical / controlled — not slow or rubbery.
 */
export function SmoothScroll({ children }: Readonly<SmoothScrollProps>) {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) {
    return children
  }

  return (
    <ReactLenis
      root
      options={{
        // GSAP ticker drives raf — avoid a second Lenis auto loop
        autoRaf: false,
        duration: scrollFeel.duration,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        wheelMultiplier: scrollFeel.wheelMultiplier,
        touchMultiplier: scrollFeel.touchMultiplier,
        syncTouch: true,
        syncTouchLerp: scrollFeel.syncTouchLerp,
      }}
    >
      <LenisGsapSync />
      {children}
    </ReactLenis>
  )
}
