"use client"

import { ReactLenis, useLenis } from "lenis/react"
import { useEffect, useMemo, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
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

const lenisEase = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t))

interface SmoothScrollProps {
  children: ReactNode
}

/** One Lenis instance. GSAP ticker owns raf — do not enable Lenis autoRaf. */
export function SmoothScroll({ children }: Readonly<SmoothScrollProps>) {
  const prefersReducedMotion = useHydratedReducedMotion()
  const options = useMemo(
    () => ({
      autoRaf: false as const,
      duration: prefersReducedMotion ? 0 : scrollFeel.duration,
      easing: lenisEase,
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: scrollFeel.wheelMultiplier,
      touchMultiplier: scrollFeel.touchMultiplier,
      syncTouch: false,
      syncTouchLerp: scrollFeel.syncTouchLerp,
    }),
    [prefersReducedMotion]
  )

  return (
    <ReactLenis root options={options}>
      <LenisGsapSync />
      {children}
    </ReactLenis>
  )
}
