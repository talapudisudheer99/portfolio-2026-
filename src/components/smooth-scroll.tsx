"use client"

import { ReactLenis } from "lenis/react"
import type { ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"

interface SmoothScrollProps {
  children: ReactNode
}

/**
 * Podium-style weighted scroll. Disabled when the reader prefers reduced motion
 * so native scroll and instant reveals stay intact.
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
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1,
        syncTouch: true,
        syncTouchLerp: 0.09,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
