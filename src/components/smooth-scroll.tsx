"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ReactLenis, useLenis } from "lenis/react"
import type { ReactNode } from "react"

import { useHydratedReducedMotion } from "@/components/shared/motion"

gsap.registerPlugin(useGSAP, ScrollTrigger)

function LenisGsapSync() {
  useLenis((lenis) => {
    ScrollTrigger.update()
    void lenis
  })
  return null
}

interface SmoothScrollProps {
  children: ReactNode
}

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
      <LenisGsapSync />
      {children}
    </ReactLenis>
  )
}
