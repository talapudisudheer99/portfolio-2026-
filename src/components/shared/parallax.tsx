"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { ReactNode } from "react"
import { useRef } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { parallax } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface ParallaxFooterProps {
  children: ReactNode
  className?: string
}

/**
 * Footer settles into place as it scrolls in. Same scroll engine as every
 * other scroll-linked effect (GSAP ScrollTrigger on Lenis, no extra lag).
 */
export function ParallaxFooter({
  children,
  className,
}: Readonly<ParallaxFooterProps>) {
  const ref = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const still = useHydratedReducedMotion()

  useGSAP(
    () => {
      const footer = ref.current
      const inner = innerRef.current
      if (!footer || !inner || still) return
      gsap.fromTo(
        inner,
        { y: parallax.footer },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      )
    },
    { dependencies: [still], revertOnUpdate: true }
  )

  return (
    <footer ref={ref} className={cn("relative overflow-hidden", className)}>
      <div ref={innerRef}>{children}</div>
    </footer>
  )
}

/** Fixed film grain — CSS only, no mix-blend (Safari/Firefox paint tax). */
export function ScrollGrain() {
  const prefersReducedMotion = useHydratedReducedMotion()

  if (prefersReducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className="scroll-grain pointer-events-none fixed inset-0 z-40"
    />
  )
}
