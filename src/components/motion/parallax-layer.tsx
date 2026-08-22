"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef, type ElementType, type ReactNode } from "react"

import { useHydratedReducedMotion } from "@/hooks/use-hydrated-reduced-motion"
import { depth } from "@/lib/motion"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type ParallaxStrength = "bg" | "decoration" | "visual"

interface MotionParallaxProps {
  children?: ReactNode
  className?: string
  strength?: ParallaxStrength
  /** Keep SSR/client tag identical — use span for decorative auroras */
  as?: "div" | "span"
  "aria-hidden"?: boolean | "true" | "false"
}

/**
 * Phase 09 Task 4 — GSAP ScrollTrigger parallax for decoration / visuals.
 * Do not wrap primary content. Tablet: reduced travel. Mobile: none.
 */
export function MotionParallax({
  children,
  className,
  strength = "decoration",
  as = "div",
  "aria-hidden": ariaHidden,
}: Readonly<MotionParallaxProps>) {
  const ref = useRef<HTMLElement | null>(null)
  const still = useHydratedReducedMotion()
  const travel = depth[strength]
  const Tag = as as ElementType

  useGSAP(
    () => {
      const el = ref.current
      if (!el || still) return

      const mm = gsap.matchMedia()

      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          el,
          { y: travel },
          {
            y: -travel,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          }
        )
      })

      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        const mid = travel * 0.55
        gsap.fromTo(
          el,
          { y: mid },
          {
            y: -mid,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.75,
            },
          }
        )
      })

      mm.add("(max-width: 767px)", () => {
        gsap.set(el, { y: 0, clearProps: "transform" })
      })

      return () => mm.revert()
    },
    { dependencies: [still, travel], revertOnUpdate: true }
  )

  return (
    <Tag ref={ref} className={cn(className)} aria-hidden={ariaHidden}>
      {children}
    </Tag>
  )
}
